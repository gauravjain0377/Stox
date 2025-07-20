import React, { useState } from "react";

function MarginCalculator() {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [marginPercent, setMarginPercent] = useState("");
  const [result, setResult] = useState(null);

  const calculateMargin = (e) => {
    e.preventDefault();
    const stockPrice = parseFloat(price);
    const qty = parseFloat(quantity);
    const marginRate = parseFloat(marginPercent) / 100;

    if (stockPrice > 0 && qty > 0 && marginRate > 0) {
      const totalValue = stockPrice * qty;
      const marginRequired = totalValue * marginRate;
      const leverage = 1 / marginRate;

      setResult({
        totalValue: totalValue.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
        marginRequired: marginRequired.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
        leverage: leverage.toFixed(2),
      });
    }
  };

  return (
    <form className="utilities-calc-form" onSubmit={calculateMargin}>
      <div>
        <label htmlFor="stock-price">Stock Price (₹)</label>
        <input
          type="number"
          id="stock-price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g., 2500"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="margin-quantity">Quantity</label>
        <input
          type="number"
          id="margin-quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g., 100"
          required
        />
      </div>
      <div>
        <label htmlFor="margin-percent">Margin Requirement (%)</label>
        <input
          type="number"
          id="margin-percent"
          value={marginPercent}
          onChange={(e) => setMarginPercent(e.target.value)}
          placeholder="e.g., 20"
          step="0.1"
          required
        />
      </div>
      <button type="submit" className="utilities-calc-btn">
        Calculate
      </button>

      {result && (
        <div className="utilities-calc-result">
          <p>Total Value: {result.totalValue}</p>
          <p>Margin Required: {result.marginRequired}</p>
          <p>Leverage: {result.leverage}x</p>
        </div>
      )}
    </form>
  );
}

export default MarginCalculator;