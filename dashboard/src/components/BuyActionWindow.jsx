import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useGeneralContext } from "./GeneralContext";
import "../styles/BuyActionWindow.css";

const BuyActionWindow = ({ uid, onClose }) => {
  const { user } = useGeneralContext();
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [livePrice, setLivePrice] = useState(null);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch live price from backend
  useEffect(() => {
    let interval;
    let isMounted = true;
    async function fetchLivePrice() {
      try {
        const res = await axios.get(`http://localhost:3000/api/price/${uid}`);
        if (res.data.price && isMounted) {
          setLivePrice(Number(res.data.price));
          setStockPrice(Number(res.data.price));
        } else if (isMounted) {
          setLivePrice(null);
          setError("Live price unavailable. Please try again later.");
        }
      } catch (err) {
        if (isMounted) {
          setLivePrice(null);
          setError("Live price unavailable. Please try again later.");
        }
      }
    }
    fetchLivePrice();
    // interval = setInterval(fetchLivePrice, 3000); // Poll every 5 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [uid]);

  // Calculate total cost
  const totalCost = stockQuantity * stockPrice;

  const handleBuyClick = async () => {
    setError("");
    if (!stockQuantity || stockQuantity <= 0) {
      setError("Please enter a valid quantity (greater than 0)");
      return;
    }
    if (!stockPrice || stockPrice <= 0) {
      setError("Please enter a valid price (greater than 0)");
      return;
    }
    if (livePrice === null) {
      setError("Live price unavailable. Please try again later.");
      return;
    }
    if (Number(stockPrice) < Number(livePrice)) {
      setError(`You cannot buy below the current market price (₹${Number(livePrice).toFixed(2)}).`);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmBuy = async () => {
    setShowConfirm(false);
    if (!stockQuantity || stockQuantity <= 0) {
      setError("Please enter a valid quantity");
      return;
    }
    if (!stockPrice || stockPrice <= 0) {
      setError("Please enter a valid price");
      return;
    }
    if (livePrice === null) {
      setError("Live price unavailable. Please try again later.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/newOrder", {
        userId: user.userId,
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "BUY",
      });
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Buy failed");
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  const handleCancelClick = () => {
    onClose(); 
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
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
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
              min={livePrice || 0}
              disabled={livePrice === null}
            />
          </fieldset>
        </div>
        {livePrice !== null && (
          <div style={{marginTop: '10px', color: '#666', fontSize: '14px'}}>Current Market Price: ₹{livePrice.toFixed(2)}</div>
        )}
      </div>
      <div className="buttons">
        <span>Total Cost: ₹{totalCost.toFixed(2)}</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick} disabled={livePrice === null}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
      {error && <div className="error-popup">{error}</div>}
      {showConfirm && (
        <div className="confirm-popup">
          <p>Are you sure you want to buy {stockQuantity} {uid} at ₹{stockPrice}?</p>
          <p>Total Cost: ₹{totalCost.toFixed(2)}</p>
          <button className="btn btn-blue" onClick={handleConfirmBuy}>Yes, Buy</button>
          <button className="btn btn-grey" onClick={handleCancelConfirm}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default BuyActionWindow;