import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useGeneralContext } from "./GeneralContext";
import "../styles/BuyActionWindow.css";

const SellActionWindow = ({ stock }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(stock ? stock.price : 0.0);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  const { user, closeSellWindow, refreshHoldings, refreshOrders } = useGeneralContext();

  // Calculate total proceeds
  const totalProceeds = stockQuantity * stockPrice;

  const handleSellClick = async () => {
    if (!user) return;
    const currentPrice = stock ? stock.price : 0;
    const enteredPrice = parseFloat(stockPrice);
    // Prevent selling much lower than current price (2% below)
    if (enteredPrice < currentPrice * 0.98) {
      setError(`You cannot sell more than 2% below the current price (₹${currentPrice})`);
      return;
    }
    // If selling above current price, show special confirmation
    if (enteredPrice > currentPrice) {
      setConfirmMessage("If the market goes up to this price, we will automatically sell it. Do you want to place this order?");
    } else {
      setConfirmMessage(`Are you sure you want to sell ${stockQuantity} ${stock.name} at ₹${stockPrice}?`);
    }
    setShowConfirm(true);
  };

  const handleConfirmSell = async () => {
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
      
      const response = await fetch('http://localhost:3000/api/orders/sell', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          symbol: stock.name,
          name: stock.name,
          quantity: stockQuantity,
          price: stockPrice
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        refreshHoldings();
        refreshOrders && refreshOrders();
        closeSellWindow();
      } else {
        setError(data.message || "Failed to sell stock");
      }
    } catch (error) {
      console.error('Error selling stock:', error);
      setError("Failed to sell stock. Please try again.");
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
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min={1}
              max={stock ? stock.qty : 1}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(Number(e.target.value))}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Total Proceeds: ₹{totalProceeds.toFixed(2)}</span>
        <div>
          <Link className="btn btn-blue" onClick={handleSellClick}>
            Sell
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
      {error && <div className="error-popup">{error}</div>}
      {showConfirm && (
        <div className="confirm-popup">
          <p>{confirmMessage}</p>
          <p>Total Proceeds: ₹{totalProceeds.toFixed(2)}</p>
          <button className="btn btn-blue" onClick={handleConfirmSell}>Yes, Sell</button>
          <button className="btn btn-grey" onClick={handleCancelConfirm}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SellActionWindow;
