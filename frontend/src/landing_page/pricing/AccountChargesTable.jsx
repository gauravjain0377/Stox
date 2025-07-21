import React from "react";
import './AccountChargesTable.css';


const AccountChargesTable = () => (
  <section className="account-charges-section">
    <h2 className="account-charges-title">Charges for Account Opening</h2>
    <div className="account-charges-table-container">
      <table className="account-charges-table">
        <thead>
          <tr>
            <th>Type of account</th>
            <th>Charges</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Online account</td>
            <td><span className="account-charges-free">FREE</span></td>
          </tr>
          <tr>
            <td>Offline account</td>
            <td><span className="account-charges-free">FREE</span></td>
          </tr>
          <tr>
            <td>NRI account (offline only)</td>
            <td>₹ 500</td>
          </tr>
          <tr>
            <td>Partnership, LLP, HUF, or Corporate accounts (offline only)</td>
            <td>₹ 500</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 className="account-charges-title" style={{marginTop: '3rem'}}>Charges for Optional Value Added Services</h2>
    <div className="account-charges-table-container">
      <table className="account-charges-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Billing Frequency</th>
            <th>Charges</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tickertape</td>
            <td>Monthly / Annual</td>
            <td>Free: 0 | Pro: 249/2399</td>
          </tr>
          <tr>
            <td>Smallcase</td>
            <td>Per transaction</td>
            <td>Buy & Invest More: 100 | SIP: 10</td>
          </tr>
          <tr>
            <td>Kite Connect</td>
            <td>Monthly</td>
            <td>Connect: 500 | Historical: 500</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);




export default AccountChargesTable; 
