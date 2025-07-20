import React from "react";
import './Hero.css';

const ChargesTable = () => (
  <div className="pricing-charges-section">
    <h2 className="pricing-charges-title">Regulatory & Statutory Charges</h2>
    <div className="pricing-charges-table-container">
      <table className="pricing-charges-table">
        <thead>
          <tr>
            <th>Charge Type</th>
            <th>Equity Intraday</th>
            <th>Equity Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>STT (Securities Transaction Tax)</td>
            <td>0.025% on the sell side</td>
            <td>0.1% on both buy and sell</td>
          </tr>
          <tr>
            <td>Stamp Duty</td>
            <td>0.003% on the buy side</td>
            <td>0.015% on the buy side</td>
          </tr>
          <tr>
            <td>Exchange Transaction Charges</td>
            <td>NSE: ~0.00325%</td>
            <td>NSE: ~0.00325%</td>
          </tr>
          <tr>
            <td>GST</td>
            <td>18% on (Brokerage + Transaction + SEBI Fees)</td>
            <td>18% on (Brokerage + Transaction + SEBI Fees)</td>
          </tr>
          <tr>
            <td>SEBI Turnover Charges</td>
            <td>₹10 per crore</td>
            <td>₹10 per crore</td>
          </tr>
          <tr>
            <td>Depository Participant (DP) Charges</td>
            <td>Not applicable</td>
            <td>₹13.5 + GST per scrip on sell side</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default ChargesTable; 

