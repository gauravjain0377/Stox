import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import "../styles/Summary.css";
import { stockService } from "../services/stockService";

// Mock data for indices
const indices = [
  { name: "NIFTY", value: 25461.0, change: 55.7, percent: 0.22 },
  { name: "SENSEX", value: 83432.89, change: 193.42, percent: 0.23 },
  { name: "BANKNIFTY", value: 57031.9, change: 239.95, percent: 0.42 },
  { name: "MIDCPNIFTY", value: 13416.0, change: -46.55, percent: -0.35 },
  { name: "FINNIFTY", value: 26800.0, change: 12.5, percent: 0.05 },
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
  const [mostTraded, setMostTraded] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMostTraded = async () => {
      try {
        setLoading(true);
        const stocks = await stockService.getMostTradedStocks();
        setMostTraded(stocks);
      } catch (error) {
        console.error("Error fetching most traded stocks:", error);
        // Fallback to default stocks
        setMostTraded([
          { symbol: "TCS", name: "Tata Consultancy Services Ltd.", price: 3194.80, percent: -0.25, volume: "1.8M", marketCap: "11.7T" },
          { symbol: "RELIANCE", name: "Reliance Industries Ltd.", price: 2745.30, percent: 0.42, volume: "3.2M", marketCap: "18.3T" },
          { symbol: "INFY", name: "Infosys Ltd.", price: 1567.90, percent: -1.15, volume: "2.1M", marketCap: "6.7T" },
          { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1578.40, percent: 0.75, volume: "2.9M", marketCap: "11.9T" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMostTraded();
  }, []);

  // Calculate summary values
  const totalInvestment = holdings.reduce((sum, h) => sum + (h.avg || 0) * (h.qty || 0), 0);
  const currentValue = holdings.reduce((sum, h) => sum + (h.price || 0) * (h.qty || 0), 0);
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;

  const handleStockClick = (stock) => {
    navigate(`/stock/${encodeURIComponent(stock.symbol)}`);
  };

  return (
    <div className="dashboard-summary-new">
      {/* Indices Ticker */}
      <div className="indices-ticker">
        {indices.map((index) => (
          <div key={index.name} className="index-item">
            <span className="index-name">{index.name}</span>
            <span className="index-value">{index.value.toLocaleString()}</span>
            <span className={`index-change ${index.change >= 0 ? "pos" : "neg"}`}>
              {index.change >= 0 ? "+" : ""}{index.change.toFixed(2)} ({index.percent >= 0 ? "+" : ""}{index.percent.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>

      <div className="dashboard-main-row">
        {/* Left: Most Traded Stocks & Products */}
        <div className="dashboard-main-left">
          <div className="section-title">Most Traded Stocks on Groww</div>
          {loading ? (
            <div className="most-traded-list">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="most-traded-card">
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="most-traded-list">
              {mostTraded.map((stock) => (
                <div 
                  className="most-traded-card cursor-pointer hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 hover:bg-blue-50/30 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1" 
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock)}
                >
                  <div className="stock-logo hover:bg-blue-100 transition-colors duration-300">
                    <span className="font-semibold text-lg text-gray-700 hover:text-blue-700 transition-colors duration-300">
                      {stock.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="stock-title hover:text-blue-900 transition-colors duration-300">{stock.name}</div>
                  <div className="stock-price hover:text-blue-900 transition-colors duration-300">₹{(stock.price || 0).toLocaleString()}</div>
                  <div className={`stock-change ${(stock.percent || 0) >= 0 ? "pos" : "neg"}`}>
                    {(stock.percent || 0) >= 0 ? "+" : ""}{(stock.percent || 0).toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          )}
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
          {/* Investments Card */}
          <div className="investments-card">
            <div className="investments-title">
              <h3>Investments</h3>
              <a href="#" className="dashboard-link">View all</a>
            </div>
            <div className="investments-returns">
              <span className="returns-pos">+₹{pnl.toLocaleString()}</span>
              <span className="returns-label">+{pnlPercent.toFixed(2)}%</span>
            </div>
            <div className="investments-value">
              <span>₹{currentValue.toLocaleString()}</span>
              <span className="returns-label">Current Value</span>
            </div>
          </div>

          {/* Watchlists Card */}
          <div className="watchlists-card">
            <div className="watchlists-title">
              <h3>Watchlists</h3>
              <a href="#" className="dashboard-link">View all</a>
            </div>
            <ul className="watchlist-list">
              <li className="watchlist-item">
                <span className="watchlist-name">{user?.username || 'Gaurav'}'s Watchlist</span>
                <span className="watchlist-count">5 items</span>
              </li>
              <li className="watchlist-item">
                <span className="watchlist-name">My Watchlist</span>
                <span className="watchlist-count">3 items</span>
              </li>
            </ul>
            <button className="create-watchlist-btn">+ Create new watchlist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
