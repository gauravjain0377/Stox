import React, { useState } from "react";

function SipCalculator() {
  const [investment, setInvestment] = useState("");
  const [rate, setRate] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState(null);

  const calculateSip = (e) => {
    e.preventDefault();
    const P = parseFloat(investment); // Monthly investment
    const annualRate = parseFloat(rate);
    const n = parseFloat(period) * 12; // Number of months
    const i = annualRate / 12 / 100; // Monthly interest rate

    if (P > 0 && i > 0 && n > 0) {
      // Future Value (M) = P * {[(1 + i)^n - 1] / i} * (1 + i)
      const futureValue = P * ((Math.pow(1 + i, n) - 1) / i);
      const totalInvestment = P * n;
      const wealthGained = futureValue - totalInvestment;

      setResult({
        futureValue: futureValue.toLocaleString("en-IN", { style:"currency", currency:"INR", maximumFractionDigits: 0 }),
        totalInvestment: totalInvestment.toLocaleString("en-IN", { style:"currency", currency:"INR", maximumFractionDigits: 0 }),
        wealthGained: wealthGained.toLocaleString("en-IN", { style:"currency", currency:"INR", maximumFractionDigits: 0 }),
      });
    }
  };

  return (
    <form className="utilities-calc-form" onSubmit={calculateSip}>
      <div>
        <label htmlFor="sip-investment">Monthly Investment (₹)</label>
        <input
          type="number"
          id="sip-investment"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          // Example-driven placeholder
          placeholder="e.g., 5000"
          required
        />
      </div>
      <div>
        <label htmlFor="sip-rate">Expected Return Rate (% p.a.)</label>
        <input
          type="number"
          id="sip-rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          // Example-driven placeholder
          placeholder="e.g., 12"
          step="0.1"
          required
        />
      </div>
      <div>
        <label htmlFor="sip-period">Time Period (Years)</label>
        <input
          type="number"
          id="sip-period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          // Example-driven placeholder
          placeholder="e.g., 10"
          required
        />
      </div>
      <button type="submit" className="utilities-calc-btn">
        Calculate
      </button>

      {result && (
        <div className="utilities-calc-result">
          <p>Invested Amount: {result.totalInvestment}</p>
          <p>Wealth Gained: {result.wealthGained}</p>
          <p>Expected Amount: {result.futureValue}</p>
        </div>
      )}
    </form>
  );
}

export default SipCalculator;