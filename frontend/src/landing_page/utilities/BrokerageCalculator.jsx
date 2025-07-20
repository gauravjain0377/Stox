import React, { useState } from "react";

function BrokerageCalculator() {
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brokerageRate, setBrokerageRate] = useState("0.05"); // Common default rate
  const [result, setResult] = useState(null);

  const calculateBrokerage = (e) => {
    e.preventDefault();
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity);
    const rate = parseFloat(brokerageRate) / 100;

    if (buy > 0 && sell > 0 && qty > 0 && rate >= 0) {
      const buyValue = buy * qty;
      const sellValue = sell * qty;
      const totalTurnover = buyValue + sellValue;
      const totalBrokerage = totalTurnover * rate;
      const profit = (sellValue - buyValue) - totalBrokerage;

      setResult({
        totalBrokerage: totalBrokerage.toLocaleString("en-IN", { style: "currency", currency: "INR" }),
        profit: profit.toLocaleString("en-IN", { style: "currency", currency: "INR" }),
        totalTurnover: totalTurnover.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      });
    }
  };

  return (
    <form className="utilities-calc-form" onSubmit={calculateBrokerage}>
      <div>
        <label htmlFor="buy-price">Buy Price per Share</label>
        <input
          type="number"
          id="buy-price"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          placeholder="e.g., 150.50"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="sell-price">Sell Price per Share</label>
        <input
          type="number"
          id="sell-price"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          placeholder="e.g., 165.75"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g., 100"
          required
        />
      </div>
       <div>
        <label htmlFor="brokerage-rate">Brokerage (%)</label>
        <input
          type="number"
          id="brokerage-rate"
          value={brokerageRate}
          onChange={(e) => setBrokerageRate(e.target.value)}
          placeholder="e.g., 0.05"
          step="0.01"
          required
        />
      </div>
      <button type="submit" className="utilities-calc-btn">
        Calculate
      </button>

      {result && (
        <div className="utilities-calc-result">
           <p>Turnover: {result.totalTurnover}</p>
           <p>Brokerage*: {result.totalBrokerage}</p>
           <p>Net Profit/Loss: {result.profit}</p>
           <small style={{marginTop: '8px', display: 'block'}}>*Other charges like STT not included.</small>
        </div>
      )}
    </form>
  );
}

export default BrokerageCalculator;