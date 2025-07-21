import React, { useState } from "react";

function SwpCalculator() {
  const [totalInvestment, setTotalInvestment] = useState("");
  const [withdrawal, setWithdrawal] = useState("");
  const [rate, setRate] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState(null);

  const calculateSwp = (e) => {
    e.preventDefault();
    const principal = parseFloat(totalInvestment);
    const monthlyWithdrawal = parseFloat(withdrawal);
    const annualRate = parseFloat(rate);
    const years = parseFloat(period);
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;

    if (principal > 0 && monthlyWithdrawal > 0 && annualRate > 0 && years > 0) {
      let currentBalance = principal;
      let totalWithdrawnAmount = 0;

      for (let i = 0; i < totalMonths; i++) {
        if (currentBalance <= 0) break;
        const interestEarned = currentBalance * monthlyRate;
        currentBalance += interestEarned;
        
        if (currentBalance >= monthlyWithdrawal) {
          currentBalance -= monthlyWithdrawal;
          totalWithdrawnAmount += monthlyWithdrawal;
        } else {
          totalWithdrawnAmount += currentBalance;
          currentBalance = 0;
          break;
        }
      }
      
      setResult({
        totalInvestment: principal.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
        totalWithdrawn: totalWithdrawnAmount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
        finalValue: currentBalance.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      });
    }
  };

  // Style objects for cleaner JSX
  const inputGroupStyle = {
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    fontWeight: 600,
    color: '#374151',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
    display: 'block',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  return (
    <form
      onSubmit={calculateSwp}
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e7ef',
      }}
    >
      <div style={inputGroupStyle}>
        <label htmlFor="swp-investment" style={labelStyle}>Total Investment (₹)</label>
        <input
          type="number"
          id="swp-investment"
          value={totalInvestment}
          onChange={(e) => setTotalInvestment(e.target.value)}
          placeholder="e.g., 100000"
          required
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label htmlFor="swp-withdrawal" style={labelStyle}>Withdrawal per Month (₹)</label>
        <input
          type="number"
          id="swp-withdrawal"
          value={withdrawal}
          onChange={(e) => setWithdrawal(e.target.value)}
          placeholder="e.g., 10000"
          required
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label htmlFor="swp-rate" style={labelStyle}>Expected Annual Return (%)</label>
        <input
          type="number"
          id="swp-rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="e.g., 10"
          step="0.1"
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="swp-period" style={labelStyle}>Time Period (Years)</label>
        <input
          type="number"
          id="swp-period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="e.g., 5"
          required
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: '0.9rem 1.5rem',
          backgroundColor: '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          marginTop: '1.5rem',
        }}
      >
        Calculate
      </button>

 {result && (
  <div className="utilities-calc-result">
    <div className="utilities-calc-result-row">
      <span>Total Investment:</span>
      <span className="utilities-calc-result-value">{result.totalInvestment}</span>
    </div>

    <div className="utilities-calc-result-row">
      <span>Total Withdrawn:</span>
      <span className="utilities-calc-result-value">{result.totalWithdrawn}</span>
    </div>

    <div className="utilities-calc-result-row">
      <span>Final Value:</span>
      <span className="utilities-calc-result-value">{result.finalValue}</span>
    </div>
  </div>
)}
    </form>
  );
}

export default SwpCalculator;