import React, { useState, useEffect } from "react";
import axios from "axios";
import TradeConfirmModal from "./TradeConfirmModal";
import TradeNotification from './TradeNotification';

import { useGeneralContext } from "./GeneralContext";
import "../styles/BuyActionWindow.css";

const SellActionWindow = ({ stock }) => {
  // Ensure we get the correct quantity from the stock object
  const availableQty = stock?.qty || 0;
  const [stockQuantity, setStockQuantity] = useState(1); // Default to 1 initially
  const [stockPrice, setStockPrice] = useState(stock ? Number(stock.price) : 0.0);
  
  // Update stockQuantity when stock data changes
  useEffect(() => {
    if (stock && stock.qty > 0) {
      setStockQuantity(1); // Set to 1 if shares are available
    } else {
      setStockQuantity(0); // Set to 0 if no shares available
    }
  }, [stock]);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [tradeNotification, setTradeNotification] = useState(null);

  const { user, closeSellWindow, refreshHoldings, refreshOrders } = useGeneralContext();

  // Calculate total proceeds
  const totalProceeds = Number(stockQuantity) * Number(stockPrice);

  const handleSellClick = async () => {
    setError("");
    if (!user) {
      setError("You must be logged in to place an order.");
      return;
    }
    if (!stockQuantity || stockQuantity <= 0) {
      setError("Please enter a valid quantity (greater than 0)");
      return;
    }
    if (stockQuantity > availableQty) {
      setError(`You only have ${availableQty} shares. Please enter a quantity between 1 and ${availableQty}.`);
      return;
    }
    if (!stockPrice || stockPrice <= 0) {
      setError("Please enter a valid price (greater than 0)");
      return;
    }
    const currentPrice = stock ? Number(stock.price) : 0;
    const enteredPrice = Number(stockPrice);
    // Prevent selling much lower than current price (2% below)
    if (enteredPrice < currentPrice * 0.98) {
      setError(`You cannot sell more than 2% below the current price (₹${currentPrice.toFixed(2)})`);
      return;
    }
    // If selling above current price, show special confirmation
    if (enteredPrice > currentPrice) {
      setConfirmMessage("If the market goes up to this price, we will automatically sell it. Do you want to place this order?");
    } else {
      setConfirmMessage(`Are you sure you want to sell ${stockQuantity} ${stock.name} at ₹${Number(stockPrice).toFixed(2)}?`);
    }
    setShowConfirm(true);
  };

  const handleConfirmSell = async (adjustedQuantity) => {
    setShowConfirm(false);
    try {
      // Get authentication data
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authentication headers
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (userData) {
        headers['x-user-data'] = encodeURIComponent(userData);
      }
      
      // Use the adjusted quantity if provided
      const finalQuantity = adjustedQuantity || stockQuantity;
      
      const response = await axios.post('http://localhost:3000/api/orders/sell', {
        symbol: stock.name,
        name: stock.name,
        quantity: finalQuantity,
        price: stockPrice
      }, { headers, withCredentials: true });
      
      if (response.data.success) {
        setTradeNotification({
          message: `Successfully sold ${finalQuantity} shares of ${stock.name}!`,
          type: 'success'
        });
        
        // Refresh holdings and orders data
        refreshHoldings && refreshHoldings();
        refreshOrders && refreshOrders();
        
        // Close the sell window after a short delay
        setTimeout(() => {
          closeSellWindow();
        }, 2000);
      } else {
        setTradeNotification({
          message: `Error: ${response.data.message || 'Failed to place sell order'}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error executing sell trade:', error);
      setTradeNotification({
        message: `Error: Failed to place sell order. Please try again.`,
        type: 'error'
      });
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  const handleCancelClick = () => {
    closeSellWindow(); // Close the window
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      {tradeNotification && (
        <TradeNotification
          message={tradeNotification.message}
          type={tradeNotification.type}
          onClose={() => setTradeNotification(null)}
        />
      )}
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min={1}
              max={availableQty}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!Number.isFinite(val)) return;
                const clamped = Math.max(1, Math.min(val, availableQty || 1));
                setStockQuantity(clamped);
                if (val > availableQty) {
                  setError(`Max quantity available to sell is ${availableQty}.`);
                } else if (val < 1) {
                  setError("Quantity must be at least 1.");
                } else {
                  setError("");
                }
              }}
              value={stockQuantity}
            />
            <div style={{ marginTop: 6, fontSize: '12px', color: '#666' }}>
              Available: <b>{availableQty}</b> share{availableQty === 1 ? '' : 's'}
            </div>
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min={0}
              onChange={(e) => {
                const val = Number(e.target.value);
                setStockPrice(val);
              }}
              value={stockPrice}
            />
            <div style={{ marginTop: 6, fontSize: '12px', color: '#666' }}>
              LTP: <b>₹{Number(stock?.price || 0).toFixed(2)}</b>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Total Proceeds: ₹{totalProceeds.toFixed(2)}</span>
        <div>
          <button 
            type="button" 
            className="btn btn-blue" 
            onClick={handleSellClick}
            disabled={!availableQty || stockQuantity < 1 || stockQuantity > availableQty || !stockPrice}
          >
            Sell
          </button>
          <button type="button" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
      {error && <div className="error-popup">{error}</div>}
      <TradeConfirmModal
        isOpen={showConfirm}
        type="sell"
        name={stock?.name}
        symbol={stock?.symbol || stock?.name}
        price={Number(stockPrice)}
        quantity={stockQuantity}
        currentShares={availableQty}
        // We don't track connection here; omit the status bar by not passing isConnected
        note={confirmMessage}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirmSell}
      />
    </div>
  );
};

export default SellActionWindow;
