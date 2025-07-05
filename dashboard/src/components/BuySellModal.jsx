import React, { useState } from "react";

const BuySellModal = ({
  symbol = "INFY",
  onClose,
  availableFunds = 10000,
  marginAvailable = 2000,
  ltp = 1555.45,
}) => {
  const [mode, setMode] = useState("BUY");
  const [orderType, setOrderType] = useState("Market");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(ltp);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isBuy = mode === "BUY";

  // Calculate total cost/proceeds
  const total = orderType === "Market" ? ltp * quantity : price * quantity;

  // Handle confirm
  const handleConfirm = () => {
    setError("");
    setSuccess("");
    if (!quantity || quantity <= 0) {
      setError("Enter a valid quantity.");
      return;
    }
    if (orderType === "Limit" && (!price || price <= 0)) {
      setError("Enter a valid price.");
      return;
    }
    if (isBuy && total > availableFunds) {
      setError("Insufficient funds.");
      return;
    }
    setSuccess(`${isBuy ? "Buy" : "Sell"} order placed successfully!`);
    // Call backend here...
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.25)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 32px #0002",
          padding: 32,
          minWidth: 350,
          maxWidth: 400,
          width: "100%",
          fontFamily: "Inter, Arial, sans-serif",
          position: "relative"
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none", fontSize: 22, color: "#888", cursor: "pointer"
          }}
          aria-label="Close"
        >×</button>

        {/* Toggle Buy/Sell */}
        <div style={{ display: "flex", marginBottom: 24 }}>
          <button
            onClick={() => setMode("BUY")}
            style={{
              flex: 1,
              background: isBuy ? "#2563eb" : "#f5f7fa",
              color: isBuy ? "#fff" : "#222",
              border: "none",
              borderRadius: "8px 0 0 8px",
              fontWeight: 700,
              fontSize: 18,
              padding: "12px 0",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >Buy</button>
          <button
            onClick={() => setMode("SELL")}
            style={{
              flex: 1,
              background: !isBuy ? "#e74c3c" : "#f5f7fa",
              color: !isBuy ? "#fff" : "#222",
              border: "none",
              borderRadius: "0 8px 8px 0",
              fontWeight: 700,
              fontSize: 18,
              padding: "12px 0",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >Sell</button>
        </div>

        {/* Stock Info */}
        <div style={{ marginBottom: 18, fontSize: 18, fontWeight: 600, color: "#2563eb" }}>
          {symbol} <span style={{ color: "#888", fontWeight: 400, fontSize: 15 }}>LTP: ₹{ltp}</span>
        </div>

        {/* Order Type */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, color: "#222", marginRight: 8 }}>Order Type:</label>
          <select
            value={orderType}
            onChange={e => setOrderType(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: 16,
              background: "#fafbfc"
            }}
          >
            <option value="Market">Market</option>
            <option value="Limit">Limit</option>
          </select>
        </div>

        {/* Quantity and Price */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600, color: "#222" }}>Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: 16,
                marginTop: 4
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600, color: "#222" }}>Price</label>
            <input
              type="number"
              min={1}
              value={orderType === "Market" ? ltp : price}
              onChange={e => setPrice(Number(e.target.value))}
              disabled={orderType === "Market"}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: 16,
                marginTop: 4,
                background: orderType === "Market" ? "#f5f7fa" : "#fff"
              }}
            />
          </div>
        </div>

        {/* Margin Info */}
        <div style={{ marginBottom: 10, color: "#888", fontSize: 15 }}>
          Margin available: <b style={{ color: "#2563eb" }}>₹{marginAvailable}</b> &nbsp; | &nbsp;
          Funds: <b style={{ color: "#2563eb" }}>₹{availableFunds}</b>
        </div>

        {/* Total Cost/Proceeds */}
        <div style={{
          marginBottom: 18,
          fontWeight: 600,
          fontSize: 18,
          color: isBuy ? "#2563eb" : "#e74c3c"
        }}>
          {isBuy ? "Total Cost" : "Total Proceeds"}: ₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>

        {/* Error/Success */}
        {error && <div style={{ color: "#e74c3c", marginBottom: 10, fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: "#2ecc40", marginBottom: 10, fontWeight: 600 }}>{success}</div>}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          style={{
            width: "100%",
            background: isBuy ? "#2563eb" : "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 0",
            fontWeight: 700,
            fontSize: 20,
            marginTop: 8,
            boxShadow: isBuy ? "0 2px 8px #2563eb22" : "0 2px 8px #e74c3c22",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Confirm {isBuy ? "Buy" : "Sell"}
        </button>
      </div>
    </div>
  );
};

export default BuySellModal; 