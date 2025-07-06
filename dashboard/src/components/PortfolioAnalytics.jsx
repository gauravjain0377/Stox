import React, { useState, useEffect, useRef } from "react";
import { Line, Doughnut, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useTheme } from "../context/ThemeContext";
import { useGeneralContext } from "./GeneralContext";
import { watchlist, holdings } from "../data/data";
import "../styles/PortfolioAnalytics.css";

const timeOptions = ["Week", "Month", "Year"];

const PortfolioAnalytics = () => {
  const [time, setTime] = useState("Month");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { holdings: userHoldings, holdingsLoading } = useGeneralContext();
  const [widgetPos, setWidgetPos] = useState({ x: null, y: null });
  const widgetRef = useRef(null);
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  // Dynamic color palette based on theme
  const softPalette = theme === 'dark' 
    ? ["#3b82f6", "#60a5fa", "#a5b4fc", "#fbbf24", "#34d399", "#f87171", "#f472b6"]
    : ["#2563eb", "#60a5fa", "#a5b4fc", "#fbbf24", "#34d399", "#f87171", "#f472b6"];

  // Mock data for comprehensive analytics
  const mockData = {
    portfolioHistory: {
      Week: [3100, 3200, 3150, 3300, 3400, 3500, 3550],
      Month: [2800, 2850, 2900, 3000, 3100, 3200, 3150, 3300, 3400, 3500, 3550],
      Year: [2000, 2100, 2200, 2500, 2700, 3000, 3200, 3400, 3550]
    },
    sectorAllocation: {
      labels: ["IT", "Finance", "Energy", "Pharma", "Auto", "FMCG"],
      data: [35, 25, 15, 10, 10, 5]
    },
    benchmarkData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      portfolio: [2800, 2900, 3000, 3100, 3200, 3550],
      nifty: [18000, 18200, 18500, 18800, 19000, 19500],
      sensex: [60000, 60500, 61000, 61500, 62000, 63500]
    },
    recentTransactions: [
      { date: "2024-01-15", stock: "TCS", type: "Buy", quantity: 10, price: 3150.00, total: 31500.00 },
      { date: "2024-01-14", stock: "RELIANCE", type: "Sell", quantity: 5, price: 2750.00, total: 13750.00 },
      { date: "2024-01-13", stock: "INFY", type: "Buy", quantity: 15, price: 1550.00, total: 23250.00 },
      { date: "2024-01-12", stock: "HDFCBANK", type: "Buy", quantity: 8, price: 1580.00, total: 12640.00 },
      { date: "2024-01-11", stock: "WIPRO", type: "Sell", quantity: 12, price: 580.00, total: 6960.00 }
    ],
    topGainers: [
      { stock: "SBIN", change: "+5.2%", price: 867.20, volume: "3.7M" },
      { stock: "TATAMOTORS", change: "+4.1%", price: 958.10, volume: "4.1M" },
      { stock: "JSWSTEEL", change: "+3.8%", price: 887.65, volume: "2.0M" },
      { stock: "BAJAJ-AUTO", change: "+3.2%", price: 8912.55, volume: "670K" },
      { stock: "HCLTECH", change: "+2.9%", price: 1372.15, volume: "950K" }
    ],
    topLosers: [
      { stock: "ADANIENT", change: "-4.2%", price: 2954.10, volume: "800K" },
      { stock: "ULTRACEMCO", change: "-3.8%", price: 10235.60, volume: "410K" },
      { stock: "LTIM", change: "-3.1%", price: 5421.80, volume: "380K" },
      { stock: "INFY", change: "-2.7%", price: 1567.90, volume: "2.1M" },
      { stock: "TITAN", change: "-2.3%", price: 3667.50, volume: "780K" }
    ],
    newsFeed: [
      { title: "Nifty 50 hits new all-time high, crosses 19,500 mark", time: "2 hours ago", category: "Market" },
      { title: "RBI keeps repo rate unchanged at 6.5%", time: "4 hours ago", category: "Policy" },
      { title: "TCS reports strong Q3 results, beats estimates", time: "6 hours ago", category: "Earnings" },
      { title: "Reliance Industries announces new digital initiatives", time: "8 hours ago", category: "Corporate" },
      { title: "Global markets rally on Fed rate cut expectations", time: "10 hours ago", category: "Global" }
    ],
    performanceMetrics: {
      totalReturn: 15.2,
      annualizedReturn: 18.5,
      sharpeRatio: 1.2,
      maxDrawdown: -8.3,
      volatility: 12.4,
      beta: 0.95
    }
  };

  // Portfolio Value Over Time
  const lineData = {
    labels: Array(mockData.portfolioHistory[time].length)
      .fill(0)
      .map((_, i) => `${time} ${i + 1}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: mockData.portfolioHistory[time],
        borderColor: theme === 'dark' ? "#3b82f6" : "#2563eb",
        backgroundColor: theme === 'dark' ? "rgba(59,130,246,0.1)" : "rgba(37,99,235,0.08)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 7
      }
    ]
  };

  // Benchmark Comparison
  const benchmarkData = {
    labels: mockData.benchmarkData.labels,
    datasets: [
      {
        label: "Your Portfolio",
        data: mockData.benchmarkData.portfolio,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        tension: 0.3
      },
      {
        label: "Nifty 50",
        data: mockData.benchmarkData.nifty.map(v => v / 7),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.1)",
        tension: 0.3
      },
      {
        label: "Sensex",
        data: mockData.benchmarkData.sensex.map(v => v / 20),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
        tension: 0.3
      }
    ]
  };

  // Sector-wise Allocation
  const doughnutData = {
    labels: mockData.sectorAllocation.labels,
    datasets: [
      {
        data: mockData.sectorAllocation.data,
        backgroundColor: softPalette,
        borderWidth: 2
      }
    ]
  };

  // Chart options with theme-aware colors
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      tooltip: { enabled: true },
      legend: { 
        position: "bottom",
        labels: {
          color: theme === 'dark' ? '#f8fafc' : '#1e293b',
          usePointStyle: true,
          padding: 20
        }
      }
    },
    scales: { 
      x: { 
        grid: { color: theme === 'dark' ? '#334155' : '#f3f4f6' },
        ticks: { color: theme === 'dark' ? '#cbd5e1' : '#64748b' }
      }, 
      y: { 
        grid: { color: theme === 'dark' ? '#334155' : '#f3f4f6' },
        ticks: { color: theme === 'dark' ? '#cbd5e1' : '#64748b' }
      } 
    }
  };

  // Calculate portfolio summary
  const portfolioSummary = {
    totalValue: userHoldings?.reduce((sum, stock) => sum + stock.price * stock.qty, 0) || 0,
    totalInvestment: userHoldings?.reduce((sum, stock) => sum + stock.avg * stock.qty, 0) || 0,
    totalPnL: 0,
    totalPnLPercent: 0
  };

  if (portfolioSummary.totalInvestment > 0) {
    portfolioSummary.totalPnL = portfolioSummary.totalValue - portfolioSummary.totalInvestment;
    portfolioSummary.totalPnLPercent = (portfolioSummary.totalPnL / portfolioSummary.totalInvestment) * 100;
  }

  // Calculate top gainers/losers in user's portfolio
  const sortedHoldings = (userHoldings || []).map(h => {
    const invested = h.avg * h.qty;
    const current = h.price * h.qty;
    const percent = invested > 0 ? ((current - invested) / invested) * 100 : 0;
    return { ...h, percent, current };
  });
  const topPortfolioGainers = [...sortedHoldings].sort((a, b) => b.percent - a.percent).slice(0, 3);
  const topPortfolioLosers = [...sortedHoldings].sort((a, b) => a.percent - b.percent).slice(0, 3);

  // Market movers (top 2 gainers/losers from mockData)
  const marketGainers = mockData.topGainers.slice(0, 2);
  const marketLosers = mockData.topLosers.slice(0, 2);

  // Drag handlers
  const onWidgetMouseDown = (e) => {
    isDragging = true;
    const rect = widgetRef.current.getBoundingClientRect();
    dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    document.addEventListener('mousemove', onWidgetMouseMove);
    document.addEventListener('mouseup', onWidgetMouseUp);
  };
  const onWidgetMouseMove = (e) => {
    if (!isDragging) return;
    setWidgetPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };
  const onWidgetMouseUp = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onWidgetMouseMove);
    document.removeEventListener('mouseup', onWidgetMouseUp);
  };

  // Touch support
  const onWidgetTouchStart = (e) => {
    isDragging = true;
    const touch = e.touches[0];
    const rect = widgetRef.current.getBoundingClientRect();
    dragOffset = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    document.addEventListener('touchmove', onWidgetTouchMove);
    document.addEventListener('touchend', onWidgetTouchEnd);
  };
  const onWidgetTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setWidgetPos({ x: touch.clientX - dragOffset.x, y: touch.clientY - dragOffset.y });
  };
  const onWidgetTouchEnd = () => {
    isDragging = false;
    document.removeEventListener('touchmove', onWidgetTouchMove);
    document.removeEventListener('touchend', onWidgetTouchEnd);
  };

  // Loading state
  if (holdingsLoading || isLoading) {
    return (
      <div className="portfolio-analytics-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading portfolio analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-analytics-container">
      <h1 className="pa-title">Portfolio Analytics</h1>
      <div className="pa-summary-grid">
        <div className="pa-summary-card">
          <div className="pa-label">Total Value</div>
          <div className="pa-value">₹{portfolioSummary.totalValue.toLocaleString()}</div>
        </div>
        <div className="pa-summary-card">
          <div className="pa-label">Total P&L</div>
          <div className="pa-value pa-green">
            ₹{portfolioSummary.totalPnL.toLocaleString()} ({portfolioSummary.totalPnLPercent.toFixed(2)}%)
          </div>
        </div>
        <div className="pa-summary-card">
          <div className="pa-label">Total Return</div>
          <div className="pa-value pa-green">+{mockData.performanceMetrics.totalReturn}%</div>
        </div>
      </div>

      {/* Top Gainers/Losers in Portfolio */}
      <div className="pa-top-movers-row">
        <div className="pa-top-movers-card">
          <div className="pa-section-title">Top Gainers in Your Portfolio</div>
          <div className="pa-movers-list">
            {topPortfolioGainers.map((h, idx) => (
              <div className="pa-mover-pill pa-mover-gain" key={idx}>
                <span className="pa-mover-icon">▲</span>
                <span className="pa-mover-symbol">{h.name}</span>
                <span className="pa-mover-pct">+{h.percent.toFixed(2)}%</span>
                <span className="pa-mover-price">₹{h.price.toFixed(2)}</span>
              </div>
            ))}
            {topPortfolioGainers.length === 0 && <div className="pa-mover-empty">No gainers</div>}
          </div>
        </div>
        <div className="pa-top-movers-card">
          <div className="pa-section-title">Top Losers in Your Portfolio</div>
          <div className="pa-movers-list">
            {topPortfolioLosers.map((h, idx) => (
              <div className="pa-mover-pill pa-mover-loss" key={idx}>
                <span className="pa-mover-icon">▼</span>
                <span className="pa-mover-symbol">{h.name}</span>
                <span className="pa-mover-pct">{h.percent.toFixed(2)}%</span>
                <span className="pa-mover-price">₹{h.price.toFixed(2)}</span>
              </div>
            ))}
            {topPortfolioLosers.length === 0 && <div className="pa-mover-empty">No losers</div>}
          </div>
        </div>
      </div>

      <div className="pa-main-grid">
        <div className="pa-chart-card">
          <div className="pa-chart-title">Portfolio Value Over Time</div>
          <div className="pa-chart-container">
            <Line data={lineData} options={chartOptions} />
          </div>
          <div className="pa-time-filters">
            {timeOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setTime(opt)}
                className={`pa-time-btn ${time === opt ? 'active' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="pa-chart-card pa-sector-card">
          <div className="pa-chart-title">Sector Allocation</div>
          <div className="pa-chart-container">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="pa-metrics-grid">
        <div className="pa-metric">
          <div className="pa-metric-label">Sharpe Ratio</div>
          <div className="pa-metric-value">{mockData.performanceMetrics.sharpeRatio}</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Beta</div>
          <div className="pa-metric-value">{mockData.performanceMetrics.beta}</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Volatility</div>
          <div className="pa-metric-value">{mockData.performanceMetrics.volatility}%</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Max Drawdown</div>
          <div className="pa-metric-value pa-red">{mockData.performanceMetrics.maxDrawdown}%</div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="chart-card full-width">
        <h4>Portfolio vs Benchmark</h4>
        <div className="chart-container">
          <Line data={benchmarkData} options={chartOptions} />
        </div>
      </div>
      
      {/* Top Gainers and Losers */}
      <div className="pa-gainers-losers-grid">
        <div className="pa-gainers-card pa-card">
          <div className="pa-section-title">Top Gainers Today</div>
          <ul className="pa-gainers-list">
            {mockData.topGainers.map((stock, idx) => (
              <li key={idx} className="pa-gainer-item">
                <div className="pa-gain-main">
                  <span className="pa-gain-symbol">{stock.stock}</span>
                  <span className="pa-gain-price">₹{stock.price}</span>
                </div>
                <div className="pa-gain-meta">
                  <span className="pa-gain-arrow pa-green">▲</span>
                  <span className="pa-gain-change pa-green">{stock.change}</span>
                  <span className="pa-gain-volume">{stock.volume}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="pa-losers-card pa-card">
          <div className="pa-section-title">Top Losers Today</div>
          <ul className="pa-losers-list">
            {mockData.topLosers.map((stock, idx) => (
              <li key={idx} className="pa-loser-item">
                <div className="pa-gain-main">
                  <span className="pa-gain-symbol">{stock.stock}</span>
                  <span className="pa-gain-price">₹{stock.price}</span>
                </div>
                <div className="pa-gain-meta">
                  <span className="pa-gain-arrow pa-red">▼</span>
                  <span className="pa-gain-change pa-red">{stock.change}</span>
                  <span className="pa-gain-volume">{stock.volume}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pa-section-title pa-rt-title">Recent Transactions</div>
      <div className="pa-rt-table-outer">
        <table className="pa-rt-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Stock</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {mockData.recentTransactions.map((tx, idx) => (
              <tr key={idx}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td className="pa-rt-stock">{tx.stock}</td>
                <td>
                  <span className={`pa-rt-type-badge ${tx.type.toLowerCase()}`}>{tx.type}</span>
                </td>
                <td>{tx.quantity}</td>
                <td>₹{tx.price.toFixed(2)}</td>
                <td>₹{tx.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Holdings Summary and News Feed */}
      <div className="analytics-grid">
        <div className="card">
          <h4>Current Holdings</h4>
          <div className="holdings-summary">
            {userHoldings?.slice(0, 5).map((holding, index) => {
              const currentValue = holding.price * holding.qty;
              const investedValue = holding.avg * holding.qty;
              const pnl = currentValue - investedValue;
              const pnlPercent = (pnl / investedValue) * 100;
              
              return (
                <div key={index} className="holding-item">
                  <div className="holding-symbol">{holding.name}</div>
                  <div className="holding-details">
                    <span className="holding-qty">{holding.qty} shares</span>
                    <span className={`holding-pnl ${pnl >= 0 ? 'positive' : 'negative'}`}>
                      {pnlPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="holding-value">₹{currentValue.toFixed(0)}</div>
                </div>
              );
            })}
            {(!userHoldings || userHoldings.length === 0) && (
              <div className="empty-state">
                <p>No holdings found</p>
                <span>Start trading to see your holdings here</span>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <h4>Financial News</h4>
          <div className="news-feed">
            {mockData.newsFeed.map((news, index) => (
              <div key={index} className="news-item">
                <div className="news-category">{news.category}</div>
                <div className="news-title">{news.title}</div>
                <div className="news-time">{news.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Movers Widget */}
      <div
        className="pa-market-movers-widget draggable"
        ref={widgetRef}
        style={{
          position: widgetPos.x !== null && widgetPos.y !== null ? 'fixed' : '',
          left: widgetPos.x !== null ? widgetPos.x : '',
          top: widgetPos.y !== null ? widgetPos.y : '',
          cursor: 'grab',
          zIndex: 100
        }}
        onMouseDown={onWidgetMouseDown}
        onTouchStart={onWidgetTouchStart}
      >
        <div className="pa-market-movers-title">Market Movers</div>
        <div className="pa-market-movers-list">
          {marketGainers.map((m, idx) => (
            <div className="pa-market-mover-pill pa-mover-gain" key={"mg"+idx}>
              <span className="pa-mover-icon">▲</span>
              <span className="pa-mover-symbol">{m.stock}</span>
              <span className="pa-mover-pct">{m.change}</span>
            </div>
          ))}
          {marketLosers.map((m, idx) => (
            <div className="pa-market-mover-pill pa-mover-loss" key={"ml"+idx}>
              <span className="pa-mover-icon">▼</span>
              <span className="pa-mover-symbol">{m.stock}</span>
              <span className="pa-mover-pct">{m.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics; 