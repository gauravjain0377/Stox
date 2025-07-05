import React, { useContext } from "react";
import GeneralContext from "./GeneralContext";
import "../styles/Summary.css";

// Mock data for indices
const indices = [
  { name: "NIFTY", value: 25461.0, change: 55.7, percent: 0.22 },
  { name: "SENSEX", value: 83432.89, change: 193.42, percent: 0.23 },
  { name: "BANKNIFTY", value: 57031.9, change: 239.95, percent: 0.42 },
  { name: "MIDCPNIFTY", value: 13416.0, change: -46.55, percent: -0.35 },
  { name: "FINNIFTY", value: 26800.0, change: 12.5, percent: 0.05 },
];

// Mock data for most traded stocks
const mostTraded = [
  {
    logo: "https://assets-netstorage.groww.in/stock-assets/logos/BSE.png",
    name: "BSE",
    price: 2635.2,
    change: -184.9,
    percent: -6.56,
  },
  {
    logo: "https://assets-netstorage.groww.in/stock-assets/logos/CPCL.png",
    name: "Chennai Petro Corp",
    price: 771.15,
    change: 58.75,
    percent: 8.25,
  },
  {
    logo: "https://assets-netstorage.groww.in/stock-assets/logos/HDB.png",
    name: "HDB Financial Services",
    price: 845.45,
    change: -18.55,
    percent: -2.15,
  },
  {
    logo: "https://assets-netstorage.groww.in/stock-assets/logos/CREDITACCESS.png",
    name: "CreditAccess Grameen",
    price: 1290.5,
    change: 49.5,
    percent: 3.99,
  },
];

// Mock data for products & tools
const products = [
  { icon: "📢", label: "IPO" },
  { icon: "🧩", label: "MTF" },
  { icon: "📜", label: "Bonds" },
  { icon: "⏳", label: "Intraday" },
  { icon: "📅", label: "Events" },
  { icon: "🔎", label: "Screener" },
];

const Summary = () => {
  const { holdings, user } = useContext(GeneralContext);

  // Calculate summary values
  const totalInvestment = holdings.reduce((sum, h) => sum + h.avg * h.qty, 0);
  const currentValue = holdings.reduce((sum, h) => sum + h.price * h.qty, 0);
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;

  return (
    <div className="dashboard-summary-new">
      {/* Indices Ticker */}
      <div className="indices-ticker">
        {indices.map((idx) => (
          <div key={idx.name} className="index-item">
            <span className="index-name">{idx.name}</span>
            <span className="index-value">{idx.value.toLocaleString()}</span>
            <span className={`index-change ${idx.change >= 0 ? "pos" : "neg"}`}>
              {idx.change >= 0 ? "+" : ""}{idx.change.toFixed(2)} ({idx.percent >= 0 ? "+" : ""}{idx.percent.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>

      <div className="dashboard-main-row">
        {/* Left: Most Traded Stocks & Products */}
        <div className="dashboard-main-left">
          <div className="section-title">Most Traded Stocks on Groww</div>
          <div className="most-traded-list">
            {mostTraded.map((stock) => (
              <div className="most-traded-card" key={stock.name}>
                <img src={stock.logo} alt={stock.name} className="stock-logo" />
                <div className="stock-title">{stock.name}</div>
                <div className="stock-price">₹{stock.price.toLocaleString()}</div>
                <div className={`stock-change ${stock.change >= 0 ? "pos" : "neg"}`}>
                  {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.percent >= 0 ? "+" : ""}{stock.percent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
          <div className="see-more">See more</div>

          <div className="section-title" style={{ marginTop: 32 }}>Products &amp; tools</div>
          <div className="products-row">
            {products.map((prod) => (
              <div className="product-card" key={prod.label}>
                <div className="product-icon">{prod.icon}</div>
                <div className="product-label">{prod.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Investments & Watchlists */}
        <div className="dashboard-main-right">
          <div className="investments-card">
            <div className="investments-title">Your Investments <span className="dashboard-link">Dashboard</span></div>
            <div className="investments-returns">
              <span className="returns-pos">+ ₹{(pnl >= 0 ? pnl : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              <span className="returns-label">Total Returns</span>
            </div>
            <div className="investments-value">
              ₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="returns-label">Current Value</span>
            </div>
          </div>

          <div className="watchlists-card">
            <div className="watchlists-title">All watchlists <span className="dashboard-link">View all</span></div>
            <div className="watchlist-list">
              <div className="watchlist-item">
                <div className="watchlist-name">{user?.username || "Gaurav"}'s Watchlist</div>
                <div className="watchlist-count">5 items</div>
              </div>
              <button className="create-watchlist-btn">+ Create new watchlist</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
