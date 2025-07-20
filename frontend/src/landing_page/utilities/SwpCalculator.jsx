import React, { useState } from "react";

function SwpCalculator() {
  const [totalInvestment, setTotalInvestment] = useState("");
  const [withdrawal, setWithdrawal] = useState("");
  const [rate, setRate] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState(null);

  const calculateSwp = (e) => {
    e.preventDefault();
    let principal = parseFloat(totalInvestment);
    const monthlyWithdrawal = parseFloat(withdrawal);
    const annualRate = parseFloat(rate);
    const years = parseFloat(period);
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;

    if (principal > 0 && monthlyWithdrawal > 0 && annualRate > 0 && years > 0) {
      for (let i = 0; i < totalMonths; i++) {
        const interestEarned = principal * monthlyRate;
        principal += interestEarned;
        principal -= monthlyWithdrawal;
        // Ensure balance doesn't go negative if withdrawals exceed capital+growth
        if (principal < 0) principal = 0;
      }

      const totalWithdrawn = monthlyWithdrawal * totalMonths;
      
      setResult({
        totalWithdrawn: totalWithdrawn.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
        finalValue: principal.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      });
    }
  };

  return (
    <form className="utilities-calc-form" onSubmit={calculateSwp}>
      <div>
        <label htmlFor="swp-investment">Total Investment (₹)</label>
        <input
          type="number"
          id="swp-investment"
          value={totalInvestment}
          onChange={(e) => setTotalInvestment(e.target.value)}
          placeholder="e.g., 1000000"
          required
        />
      </div>
      <div>
        <label htmlFor="swp-withdrawal">Withdrawal per Month (₹)</label>
        <input
          type="number"
          id="swp-withdrawal"
          value={withdrawal}
          onChange={(e) => setWithdrawal(e.target.value)}
          placeholder="e.g., 8000"
          required
        />
      </div>
      <div>
        <label htmlFor="swp-rate">Expected Annual Return (%)</label>
        <input
          type="number"
          id="swp-rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="e.g., 10"
          step="0.1"
          required
        />
      </div>
      <div>
        <label htmlFor="swp-period">Time Period (Years)</label>
        <input
          type="number"
          id="swp-period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="e.g., 15"
          required
        />
      </div>
      <button type="submit" className="utilities-calc-btn">
        Calculate
      </button>

      {result && (
        <div className="utilities-calc-result">
          <p>Total Withdrawn: {result.totalWithdrawn}</p>
          <p>Final Value: {result.finalValue}</p>
        </div>
      )}
    </form>
  );
}

export default SwpCalculator;