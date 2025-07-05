import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/PersonalWatchlist.css";

// Mock data for watchlist stocks
const mockWatchlistData = [
  {
    id: 1,
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2456.80,
    change: 45.20,
    changePercent: 1.88,
    volume: "2.5M",
    marketCap: "₹16.2T",
    chartData: [2400, 2410, 2420, 2430, 2440, 2450, 2456.8],
    alert: null
  },
  {
    id: 2,
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    price: 3890.50,
    change: -12.30,
    changePercent: -0.32,
    volume: "1.8M",
    marketCap: "₹14.1T",
    chartData: [3900, 3895, 3890, 3885, 3890, 3895, 3890.5],
    alert: { type: "above", price: 4000 }
  },
  {
    id: 3,
    symbol: "INFY",
    name: "Infosys Ltd",
    price: 1520.75,
    change: 28.45,
    changePercent: 1.91,
    volume: "3.2M",
    marketCap: "₹6.3T",
    chartData: [1490, 1500, 1510, 1520, 1525, 1520, 1520.75],
    alert: null
  },
  {
    id: 4,
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: 1650.20,
    change: -8.90,
    changePercent: -0.54,
    volume: "4.1M",
    marketCap: "₹9.1T",
    chartData: [1660, 1655, 1650, 1645, 1650, 1655, 1650.2],
    alert: { type: "below", price: 1600 }
  },
  {
    id: 5,
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    price: 920.45,
    change: 15.75,
    changePercent: 1.74,
    volume: "5.8M",
    marketCap: "₹6.4T",
    chartData: [905, 910, 915, 920, 925, 920, 920.45],
    alert: null
  }
];

const PersonalWatchlist = () => {
  const { theme } = useTheme();
  const [watchlist, setWatchlist] = useState(mockWatchlistData);
  const [viewMode, setViewMode] = useState("card"); // "card" or "table"
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("symbol");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddStock, setShowAddStock] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [newStockSymbol, setNewStockSymbol] = useState("");

  // Filter and sort watchlist
  const filteredAndSortedWatchlist = watchlist
    .filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "change":
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case "volume":
          aValue = parseFloat(a.volume.replace(/[^0-9.]/g, ""));
          bValue = parseFloat(b.volume.replace(/[^0-9.]/g, ""));
          break;
        default:
          aValue = a.symbol;
          bValue = b.symbol;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Handle stock removal
  const removeStock = (stockId) => {
    setWatchlist(prev => prev.filter(stock => stock.id !== stockId));
  };

  // Handle stock reordering
  const moveStock = (stockId, direction) => {
    setWatchlist(prev => {
      const newList = [...prev];
      const currentIndex = newList.findIndex(stock => stock.id === stockId);
      
      if (direction === "up" && currentIndex > 0) {
        [newList[currentIndex], newList[currentIndex - 1]] = [newList[currentIndex - 1], newList[currentIndex]];
      } else if (direction === "down" && currentIndex < newList.length - 1) {
        [newList[currentIndex], newList[currentIndex + 1]] = [newList[currentIndex + 1], newList[currentIndex]];
      }
      
      return newList;
    });
  };

  // Handle adding new stock
  const addStock = () => {
    if (newStockSymbol.trim()) {
      const newStock = {
        id: Date.now(),
        symbol: newStockSymbol.toUpperCase(),
        name: `${newStockSymbol.toUpperCase()} Company Ltd`,
        price: Math.random() * 1000 + 100,
        change: (Math.random() - 0.5) * 50,
        changePercent: (Math.random() - 0.5) * 5,
        volume: `${(Math.random() * 10 + 1).toFixed(1)}M`,
        marketCap: `₹${(Math.random() * 10 + 1).toFixed(1)}T`,
        chartData: Array.from({ length: 7 }, () => Math.random() * 100 + 100),
        alert: null
      };
      
      setWatchlist(prev => [...prev, newStock]);
      setNewStockSymbol("");
      setShowAddStock(false);
    }
  };

  // Handle price alert
  const setPriceAlert = (stockId, alertType, price) => {
    setWatchlist(prev => 
      prev.map(stock => 
        stock.id === stockId 
          ? { ...stock, alert: { type: alertType, price: parseFloat(price) } }
          : stock
      )
    );
    setShowAlertModal(false);
    setSelectedStock(null);
  };

  // Remove price alert
  const removeAlert = (stockId) => {
    setWatchlist(prev => 
      prev.map(stock => 
        stock.id === stockId 
          ? { ...stock, alert: null }
          : stock
      )
    );
  };

  // Mini chart component
  const MiniChart = ({ data, isPositive }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(" ");
    
    return (
      <svg width="60" height="30" viewBox="0 0 60 30" className="mini-chart">
        <polyline
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  // Card view component
  const CardView = () => (
    <div className="watchlist-cards">
      {filteredAndSortedWatchlist.map((stock, index) => (
        <div key={stock.id} className="stock-card">
          <div className="card-header">
            <div className="stock-info">
              <h3 className="stock-symbol">{stock.symbol}</h3>
              <p className="stock-name">{stock.name}</p>
            </div>
            <div className="card-actions">
              <button 
                className="action-btn"
                onClick={() => moveStock(stock.id, "up")}
                disabled={index === 0}
                title="Move Up"
              >
                ↑
              </button>
              <button 
                className="action-btn"
                onClick={() => moveStock(stock.id, "down")}
                disabled={index === filteredAndSortedWatchlist.length - 1}
                title="Move Down"
              >
                ↓
              </button>
              <button 
                className="action-btn danger"
                onClick={() => removeStock(stock.id)}
                title="Remove"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="card-content">
            <div className="price-section">
              <div className="price-info">
                <span className="price">₹{stock.price.toFixed(2)}</span>
                <span className={`change ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
              <MiniChart data={stock.chartData} isPositive={stock.changePercent >= 0} />
            </div>
            
            <div className="stock-details">
              <div className="detail-item">
                <span className="label">Volume:</span>
                <span className="value">{stock.volume}</span>
              </div>
              <div className="detail-item">
                <span className="label">Market Cap:</span>
                <span className="value">{stock.marketCap}</span>
              </div>
            </div>
            
            <div className="alert-section">
              {stock.alert ? (
                <div className="alert-info">
                  <span className="alert-icon">🔔</span>
                  <span className="alert-text">
                    {stock.alert.type === "above" ? "Above" : "Below"} ₹{stock.alert.price}
                  </span>
                  <button 
                    className="remove-alert-btn"
                    onClick={() => removeAlert(stock.id)}
                    title="Remove Alert"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button 
                  className="set-alert-btn"
                  onClick={() => {
                    setSelectedStock(stock);
                    setShowAlertModal(true);
                  }}
                >
                  Set Alert
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Table view component
  const TableView = () => (
    <div className="watchlist-table-container">
      <table className="watchlist-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change</th>
            <th>Volume</th>
            <th>Market Cap</th>
            <th>Chart</th>
            <th>Alert</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedWatchlist.map((stock, index) => (
            <tr key={stock.id}>
              <td className="symbol-cell">
                <strong>{stock.symbol}</strong>
              </td>
              <td className="name-cell">{stock.name}</td>
              <td className="price-cell">₹{stock.price.toFixed(2)}</td>
              <td className={`change-cell ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </td>
              <td>{stock.volume}</td>
              <td>{stock.marketCap}</td>
              <td className="chart-cell">
                <MiniChart data={stock.chartData} isPositive={stock.changePercent >= 0} />
              </td>
              <td className="alert-cell">
                {stock.alert ? (
                  <div className="alert-badge">
                    <span>🔔</span>
                    <span>{stock.alert.type === "above" ? ">" : "<"} ₹{stock.alert.price}</span>
                  </div>
                ) : (
                  <button 
                    className="set-alert-btn small"
                    onClick={() => {
                      setSelectedStock(stock);
                      setShowAlertModal(true);
                    }}
                  >
                    Set
                  </button>
                )}
              </td>
              <td className="actions-cell">
                <div className="table-actions">
                  <button 
                    className="action-btn small"
                    onClick={() => moveStock(stock.id, "up")}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button 
                    className="action-btn small"
                    onClick={() => moveStock(stock.id, "down")}
                    disabled={index === filteredAndSortedWatchlist.length - 1}
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button 
                    className="action-btn small danger"
                    onClick={() => removeStock(stock.id)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="personal-watchlist">
      {/* Header */}
      <div className="watchlist-header">
        <div className="header-left">
          <h1>My Watchlist</h1>
          <span className="stock-count">{filteredAndSortedWatchlist.length} stocks</span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddStock(true)}
          >
            + Add Stock
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="watchlist-controls">
        <div className="search-section">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="controls-right">
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="symbol">Symbol</option>
              <option value="price">Price</option>
              <option value="change">Change %</option>
              <option value="volume">Volume</option>
            </select>
            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "card" ? "active" : ""}`}
              onClick={() => setViewMode("card")}
              title="Card View"
            >
              📱
            </button>
            <button
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              📊
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="watchlist-content">
        {filteredAndSortedWatchlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <h3>No stocks found</h3>
            <p>Try adjusting your search or add some stocks to your watchlist</p>
            <button 
              className="btn-primary"
              onClick={() => setShowAddStock(true)}
            >
              Add Your First Stock
            </button>
          </div>
        ) : (
          viewMode === "card" ? <CardView /> : <TableView />
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddStock && (
        <div className="modal-overlay" onClick={() => setShowAddStock(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Stock to Watchlist</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddStock(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="stock-symbol">Stock Symbol</label>
                <input
                  type="text"
                  id="stock-symbol"
                  placeholder="e.g., RELIANCE, TCS"
                  value={newStockSymbol}
                  onChange={(e) => setNewStockSymbol(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addStock()}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowAddStock(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={addStock}
                disabled={!newStockSymbol.trim()}
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Alert Modal */}
      {showAlertModal && selectedStock && (
        <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Set Price Alert for {selectedStock.symbol}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAlertModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="alert-options">
                <div className="alert-option">
                  <input
                    type="radio"
                    id="alert-above"
                    name="alert-type"
                    value="above"
                    defaultChecked
                  />
                  <label htmlFor="alert-above">Alert when price goes above</label>
                </div>
                <div className="alert-option">
                  <input
                    type="radio"
                    id="alert-below"
                    name="alert-type"
                    value="below"
                  />
                  <label htmlFor="alert-below">Alert when price goes below</label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="alert-price">Price (₹)</label>
                <input
                  type="number"
                  id="alert-price"
                  placeholder="Enter price"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowAlertModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  const alertType = document.querySelector('input[name="alert-type"]:checked').value;
                  const price = document.getElementById('alert-price').value;
                  if (price) {
                    setPriceAlert(selectedStock.id, alertType, price);
                  }
                }}
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalWatchlist; 