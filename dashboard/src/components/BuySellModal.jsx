import React, { useState, useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const isBuy = mode === "BUY";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 32px #0002",
          padding: isMobile ? "20px" : "32px",
          minWidth: isMobile ? "calc(100% - 32px)" : 350,
          maxWidth: 400,
          width: "100%",
          maxHeight: "95vh",
          overflowY: "auto",
          fontFamily: "Inter, Arial, sans-serif",
          position: "relative"
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", 
            top: isMobile ? 12 : 16, 
            right: isMobile ? 12 : 16,
            background: "none", 
            border: "none", 
            fontSize: isMobile ? 20 : 22, 
            color: "#888", 
            cursor: "pointer",
            zIndex: 10
          }}
          aria-label="Close"
        >×</button>

        {/* Toggle Buy/Sell */}
        <div style={{ display: "flex", marginBottom: isMobile ? 16 : 24 }}>
          <button
            onClick={() => setMode("BUY")}
            style={{
              flex: 1,
              background: isBuy ? "#2563eb" : "#f5f7fa",
              color: isBuy ? "#fff" : "#222",
              border: "none",
              borderRadius: "8px 0 0 8px",
              fontWeight: 700,
              fontSize: isMobile ? 16 : 18,
              padding: isMobile ? "10px 0" : "12px 0",
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
              fontSize: isMobile ? 16 : 18,
              padding: isMobile ? "10px 0" : "12px 0",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >Sell</button>
        </div>

        {/* Stock Info */}
        <div style={{ marginBottom: isMobile ? 14 : 18, fontSize: isMobile ? 16 : 18, fontWeight: 600, color: "#2563eb" }}>
          {symbol} <span style={{ color: "#888", fontWeight: 400, fontSize: isMobile ? 13 : 15 }}>LTP: ₹{ltp}</span>
        </div>

        {/* Order Type */}
        <div style={{ marginBottom: isMobile ? 12 : 16 }}>
          <label style={{ fontWeight: 600, color: "#222", marginRight: 8, fontSize: isMobile ? 14 : 16 }}>Order Type:</label>
          <select
            value={orderType}
            onChange={e => setOrderType(e.target.value)}
            style={{
              padding: isMobile ? "6px 10px" : "6px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: isMobile ? 14 : 16,
              background: "#fafbfc",
              width: "100%",
              marginTop: 4
            }}
          >
            <option value="Market">Market</option>
            <option value="Limit">Limit</option>
          </select>
        </div>

        {/* Quantity and Price */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, marginBottom: isMobile ? 12 : 16 }}>
          <div style={{ flex: 1, width: "100%" }}>
            <label style={{ fontWeight: 600, color: "#222", fontSize: isMobile ? 14 : 16 }}>Quantity</label>
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
                fontSize: isMobile ? 14 : 16,
                marginTop: 4
              }}
            />
          </div>
          <div style={{ flex: 1, width: "100%" }}>
            <label style={{ fontWeight: 600, color: "#222", fontSize: isMobile ? 14 : 16 }}>Price</label>
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
                fontSize: isMobile ? 14 : 16,
                marginTop: 4,
                background: orderType === "Market" ? "#f5f7fa" : "#fff"
              }}
            />
          </div>
        </div>

        {/* Margin Info */}
        <div style={{ marginBottom: 10, color: "#888", fontSize: isMobile ? 13 : 15, wordBreak: "break-word" }}>
          Margin available: <b style={{ color: "#2563eb" }}>₹{marginAvailable}</b> &nbsp; | &nbsp;
          Funds: <b style={{ color: "#2563eb" }}>₹{availableFunds}</b>
        </div>

        {/* Total Cost/Proceeds */}
        <div style={{
          marginBottom: isMobile ? 14 : 18,
          fontWeight: 600,
          fontSize: isMobile ? 16 : 18,
          color: isBuy ? "#2563eb" : "#e74c3c",
          wordBreak: "break-word"
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
            padding: isMobile ? "12px 0" : "14px 0",
            fontWeight: 700,
            fontSize: isMobile ? 18 : 20,
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