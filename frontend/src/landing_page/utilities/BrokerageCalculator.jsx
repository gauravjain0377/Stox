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
      // Brokerage (max ₹20 per leg, per side)
      const brokerage = Math.min(20, buyValue * rate) + Math.min(20, sellValue * rate);
      // STT (Securities Transaction Tax) - 0.1% on sell side for delivery
      const stt = sellValue * 0.001;
      // Exchange Charges (NSE) - ~0.00325% per side
      const exchangeCharges = totalTurnover * 0.0000325;
      // SEBI Turnover Fees - ₹10 per crore (0.0001%)
      const sebiFees = totalTurnover * 0.000001;
      // GST - 18% on (Brokerage + Exchange Charges + SEBI Fees)
      const gst = 0.18 * (brokerage + exchangeCharges + sebiFees);
      // Stamp Duty - 0.015% on buy side
      const stampDuty = buyValue * 0.00015;
      // Total Charges
      const totalCharges = brokerage + stt + exchangeCharges + sebiFees + gst + stampDuty;
      // Net P&L
      const profit = (sellValue - buyValue) - totalCharges;

      setResult({
        totalTurnover: totalTurnover.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        grossPL: (sellValue - buyValue).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        brokerage: brokerage.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        stt: stt.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        exchangeCharges: exchangeCharges.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        sebiFees: sebiFees.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        gst: gst.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        stampDuty: stampDuty.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        totalCharges: totalCharges.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
        netPL: profit.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }),
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
        <div className="utilities-calc-result" style={{padding: '32px 40px', maxWidth: '700px', margin: '28px auto 0 auto', fontSize: '1.08rem', background: '#f6fdfb'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15em', marginBottom: 8}}>
            <span>Turnover</span>
            <span>{result.totalTurnover}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15em', marginBottom: 8}}>
            <span>P&amp;L</span>
            <span>{result.grossPL}</span>
          </div>
          <div style={{fontWeight: 700, margin: '18px 0 8px 0', fontSize: '1.12em'}}>Charges</div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
            <span>Brokerage</span>
            <span>{result.brokerage}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
            <span>STT</span>
            <span>{result.stt}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
            <span>Exchange Charges</span>
            <span>{result.exchangeCharges}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
            <span>SEBI Fees</span>
            <span>{result.sebiFees}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
            <span>GST</span>
            <span>{result.gst}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <span>Stamp Duty</span>
            <span>{result.stampDuty}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.08em', marginBottom: 8}}>
            <span>Total Charges</span>
            <span>{result.totalCharges}</span>
          </div>
          <div style={{height: 1, background: '#e0e7ef', margin: '18px 0'}}></div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.18em', color: '#00796b'}}>
            <span>Net P&amp;L</span>
            <span>{result.netPL}</span>
          </div>
        </div>
      )}
    </form>
  );
}

export default BrokerageCalculator;