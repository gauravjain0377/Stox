import React, { useState, useEffect, useRef } from "react";
import { Line, Doughnut, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useTheme } from "../context/ThemeContext";
import { useGeneralContext } from "./GeneralContext";
import { stockService } from "../services/stockService";
import { isMarketOpen } from "../lib/utils";
import "../styles/PortfolioAnalytics.css";

// Mock data for news (keeping this as it's not related to real-time stock data)
const mockData = {
  newsFeed: [
    { category: "Markets", title: "Sensex, Nifty close at record highs", time: "2 hours ago" },
    { category: "Economy", title: "RBI keeps repo rate unchanged at 4%", time: "5 hours ago" },
    { category: "Corporate", title: "TCS announces share buyback worth ₹18,000 crore", time: "1 day ago" },
    { category: "Global", title: "US markets rally on Fed comments", time: "1 day ago" }
  ]
};

const timeOptions = ["Week", "Month", "Year"];

const PortfolioAnalytics = () => {
  const [time, setTime] = useState("Month");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { holdings: userHoldings, holdingsLoading, orders } = useGeneralContext();
  const [widgetPos, setWidgetPos] = useState({ x: null, y: null });
  const widgetRef = useRef(null);
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  // State for real-time data
  const [portfolioHistory, setPortfolioHistory] = useState({
    Week: [],
    Month: [],
    Year: []
  });
  const [sectorAllocation, setSectorAllocation] = useState({ labels: [], data: [] });
  const [benchmarkData, setBenchmarkData] = useState({ labels: [], portfolio: [], nifty: [], sensex: [] });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [marketMovers, setMarketMovers] = useState({ topGainers: [], topLosers: [] });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalReturn: 0,
    annualizedReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    volatility: 0,
    beta: 0
  });

  // Dynamic color palette based on theme
  const softPalette = theme === 'dark' 
    ? ["#3b82f6", "#60a5fa", "#a5b4fc", "#fbbf24", "#34d399", "#f87171", "#f472b6"]
    : ["#2563eb", "#60a5fa", "#a5b4fc", "#fbbf24", "#34d399", "#f87171", "#f472b6"];
    
  // Generate portfolio history data based on orders
  useEffect(() => {
    if (holdingsLoading) return;
    
    setIsLoading(true);
    
    // Handle new users with no orders - show zero state with proper structure
    if (!orders || orders.length === 0) {
      // Initialize with zero data for new users
      const weekData = Array(7).fill(0);
      const monthData = Array(10).fill(0);
      const yearData = Array(12).fill(0);
      
      setPortfolioHistory({
        Week: weekData,
        Month: monthData,
        Year: yearData
      });
      
      setRecentTransactions([]);
      setSectorAllocation({ labels: [], data: [] });
      
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const now = new Date();
      const currentMonth = now.getMonth();
      const benchmarkLabels = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        benchmarkLabels.push(months[monthIndex]);
      }
      
      setBenchmarkData({
        labels: benchmarkLabels,
        portfolio: Array(6).fill(0),
        nifty: Array(6).fill(0),
        sensex: Array(6).fill(0)
      });
      
      setTopGainers([]);
      setTopLosers([]);
      
      setPerformanceMetrics({
        totalReturn: 0,
        annualizedReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        volatility: 0,
        beta: 0
      });
      
      setIsLoading(false);
      return;
    }
    
    try {
      // Sort orders by timestamp
      const sortedOrders = [...orders].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      // Generate portfolio value over time
      const now = new Date();
      
      // Week data - last 7 days
      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Calculate portfolio value on this date
        const value = calculatePortfolioValueOnDate(sortedOrders, date);
        weekData.push(value);
      }
      
      // Month data - last 30 days
      const monthData = [];
      for (let i = 29; i >= 0; i -= 3) { // Sample every 3 days for month view
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Calculate portfolio value on this date
        const value = calculatePortfolioValueOnDate(sortedOrders, date);
        monthData.push(value);
      }
      
      // Year data - last 12 months
      const yearData = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        
        // Calculate portfolio value on this date
        const value = calculatePortfolioValueOnDate(sortedOrders, date);
        yearData.push(value);
      }
      
      setPortfolioHistory({
        Week: weekData,
        Month: monthData,
        Year: yearData
      });
      
      // Generate recent transactions from orders
      const transactions = sortedOrders.slice(-5).reverse().map(order => ({
        date: new Date(order.timestamp).toISOString().split('T')[0],
        stock: order.name,
        type: order.mode,
        quantity: order.qty,
        price: order.price,
        total: order.price * order.qty
      }));
      
      setRecentTransactions(transactions);
      
      // Calculate sector allocation based on current holdings
      if (userHoldings && userHoldings.length > 0) {
        // Define sectors for common stocks (in a real app, this would come from an API)
        const stockSectors = {
          "TCS": "IT",
          "INFY": "IT",
          "WIPRO": "IT",
          "HCLTECH": "IT",
          "TECHM": "IT",
          "RELIANCE": "Energy",
          "ONGC": "Energy",
          "BPCL": "Energy",
          "IOC": "Energy",
          "GAIL": "Energy",
          "HDFCBANK": "Finance",
          "ICICIBANK": "Finance",
          "SBIN": "Finance",
          "KOTAKBANK": "Finance",
          "AXISBANK": "Finance",
          "SUNPHARMA": "Pharma",
          "DRREDDY": "Pharma",
          "CIPLA": "Pharma",
          "DIVISLAB": "Pharma",
          "TATAMOTORS": "Auto",
          "M&M": "Auto",
          "MARUTI": "Auto",
          "HEROMOTOCO": "Auto",
          "BAJAJ-AUTO": "Auto",
          "ITC": "FMCG",
          "HINDUNILVR": "FMCG",
          "NESTLEIND": "FMCG",
          "BRITANNIA": "FMCG",
          "DABUR": "FMCG"
        };
        
        // Group holdings by sector
        const sectorValues = {};
        
        userHoldings.forEach(holding => {
          const sector = stockSectors[holding.name] || "Other";
          
          if (!sectorValues[sector]) {
            sectorValues[sector] = 0;
          }
          
          sectorValues[sector] += holding.price * holding.qty;
        });
        
        // Convert to arrays for chart
        const sectorLabels = Object.keys(sectorValues);
        const sectorData = Object.values(sectorValues);
        
        // Calculate percentages
        const totalValue = sectorData.reduce((sum, value) => sum + value, 0);
        const sectorPercentages = sectorData.map(value => (value / totalValue) * 100);
        
        setSectorAllocation({
          labels: sectorLabels,
          data: sectorPercentages
        });
      }
      
      // Generate benchmark comparison data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentMonth = now.getMonth();
      
      // Get last 6 months
      const benchmarkLabels = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        benchmarkLabels.push(months[monthIndex]);
      }
      
      // Use portfolio data for benchmark comparison
      // In a real app, this would fetch actual market index data
      const portfolioData = [];
      const niftyData = [];
      const sensexData = [];
      
      // Sample every other month from year data
      for (let i = 0; i < 6; i++) {
        const index = Math.floor(i * (yearData.length / 6));
        if (index < yearData.length) {
          portfolioData.push(yearData[index]);
          
          // Simulate market indices (in a real app, these would come from an API)
          // Using portfolio value with some variation to simulate correlation
          const baseValue = yearData[index];
          niftyData.push(baseValue * 7 * (0.9 + Math.random() * 0.2));
          sensexData.push(baseValue * 20 * (0.9 + Math.random() * 0.2));
        }
      }
      
      setBenchmarkData({
        labels: benchmarkLabels,
        portfolio: portfolioData,
        nifty: niftyData,
        sensex: sensexData
      });
      
      // Calculate top gainers and losers from holdings
      if (userHoldings && userHoldings.length > 0) {
        // Calculate percent change for each holding
        const holdingsWithChange = userHoldings.map(holding => {
          const currentValue = holding.price * holding.qty;
          const investedValue = holding.avg * holding.qty;
          const percentChange = ((currentValue - investedValue) / investedValue) * 100;
          
          return {
            stock: holding.name,
            change: percentChange > 0 ? `+${percentChange.toFixed(1)}%` : `${percentChange.toFixed(1)}%`,
            price: holding.price,
            volume: `${holding.qty} shares`
          };
        });
        
        // Sort by percent change
        const sortedHoldings = [...holdingsWithChange].sort((a, b) => {
          const aChange = parseFloat(a.change.replace('%', ''));
          const bChange = parseFloat(b.change.replace('%', ''));
          return bChange - aChange;
        });
        
        // Get top gainers and losers
        const gainers = sortedHoldings.filter(h => parseFloat(h.change) > 0).slice(0, 5);
        const losers = sortedHoldings.filter(h => parseFloat(h.change) < 0).slice(0, 5);
        
        setTopGainers(gainers);
        setTopLosers(losers);
      }
      
      // Calculate performance metrics
      if (yearData.length > 0) {
        const startValue = yearData[0];
        const endValue = yearData[yearData.length - 1];
        const totalReturn = ((endValue - startValue) / startValue) * 100;
        
        // Simple annualized return calculation
        const annualizedReturn = totalReturn;
        
        // Calculate volatility (standard deviation of returns)
        const returns = [];
        for (let i = 1; i < yearData.length; i++) {
          returns.push((yearData[i] - yearData[i-1]) / yearData[i-1]);
        }
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length) * 100;
        
        // Approximate Sharpe ratio (assuming risk-free rate of 4%)
        const sharpeRatio = (annualizedReturn - 4) / volatility;
        
        // Calculate maximum drawdown
        let maxDrawdown = 0;
        let peak = yearData[0];
        
        for (const value of yearData) {
          if (value > peak) {
            peak = value;
          }
          
          const drawdown = (peak - value) / peak * 100;
          if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
          }
        }
        
        setPerformanceMetrics({
          totalReturn: totalReturn,
          annualizedReturn: annualizedReturn,
          sharpeRatio: sharpeRatio,
          maxDrawdown: -maxDrawdown,
          volatility: volatility,
          beta: 0.95 // Placeholder - would need market data to calculate
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating portfolio history:", error);
      setIsLoading(false);
    }
  }, [orders, holdingsLoading, userHoldings]);
  
  // Fetch real-time market movers data
  useEffect(() => {
    const fetchMarketMovers = async () => {
      try {
        const movers = await stockService.getMarketMovers();
        setMarketMovers(movers);
      } catch (error) {
        console.error("Error fetching market movers:", error);
      }
    };

    // Fetch immediately
    fetchMarketMovers();

    // Set up interval for real-time updates during market hours
    let interval;
    if (isMarketOpen()) {
      interval = setInterval(fetchMarketMovers, 60000); // Update every minute
    }

    // Clean up interval
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Helper function to calculate portfolio value on a specific date
  const calculatePortfolioValueOnDate = (orders, targetDate) => {
    // Filter orders that occurred before or on the target date
    const relevantOrders = orders.filter(order => new Date(order.timestamp) <= targetDate);
    
    // Calculate holdings based on these orders
    const holdings = {};
    
    relevantOrders.forEach(order => {
      const { name, qty, price, mode } = order;
      
      if (!holdings[name]) {
        holdings[name] = { qty: 0, value: 0 };
      }
      
      if (mode === "BUY") {
        holdings[name].qty += parseInt(qty);
        holdings[name].value = holdings[name].qty * price;
      } else if (mode === "SELL") {
        holdings[name].qty -= parseInt(qty);
        holdings[name].value = holdings[name].qty * price;
      }
      
      // Remove stocks with zero quantity
      if (holdings[name].qty <= 0) {
        delete holdings[name];
      }
    });
    
    // Calculate total portfolio value
    return Object.values(holdings).reduce((total, stock) => total + stock.value, 0);
  };

  // Portfolio Value Over Time
  const lineData = {
    labels: Array(portfolioHistory[time]?.length || 0)
      .fill(0)
      .map((_, i) => `${time} ${i + 1}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: portfolioHistory[time] || [],
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
  const benchmarkChartData = {
    labels: benchmarkData.labels || [],
    datasets: [
      {
        label: "Your Portfolio",
        data: benchmarkData.portfolio || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        tension: 0.3
      },
      {
        label: "Nifty 50",
        data: benchmarkData.nifty || [],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.1)",
        tension: 0.3
      },
      {
        label: "Sensex",
        data: benchmarkData.sensex || [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
        tension: 0.3
      }
    ]
  };

  // Sector-wise Allocation
  const doughnutData = {
    labels: sectorAllocation.labels || [],
    datasets: [
      {
        data: sectorAllocation.data || [],
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

  // Market movers (top 2 gainers/losers from real-time data)
  const marketGainers = marketMovers.topGainers.slice(0, 2);
  const marketLosers = marketMovers.topLosers.slice(0, 2);

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

  // Loading state - only show loading if actually fetching data
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
  
  // Check if user is truly new with no data at all
  const isNewUser = (!orders || orders.length === 0) && (!userHoldings || userHoldings.length === 0);

  return (
    <div className="portfolio-analytics-container">
      <h1 className="pa-title">Portfolio Analytics</h1>
      
      {/* New User Welcome Message */}
      {isNewUser && (
        <div className="pa-welcome-banner" style={{
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: theme === 'dark' ? '#1e293b' : '#e0f2fe',
          borderRadius: '8px',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #bae6fd',
          textAlign: 'center'
        }}>
          <h3 style={{ color: theme === 'dark' ? '#3b82f6' : '#0369a1', marginBottom: '8px' }}>Welcome to Your Portfolio Analytics!</h3>
          <p style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>
            You haven't made any trades yet. Start trading to see your portfolio performance, analytics, and insights here.
          </p>
        </div>
      )}
      
      <div className="pa-summary-grid">
        <div className="pa-summary-card">
          <div className="pa-label">Total Value</div>
          <div className="pa-value">₹{portfolioSummary.totalValue.toLocaleString()}</div>
        </div>
        <div className="pa-summary-card">
          <div className="pa-label">Total P&L</div>
          <div className={`pa-value ${portfolioSummary.totalPnL >= 0 ? 'pa-green' : 'pa-red'}`}>
            {portfolioSummary.totalPnL >= 0 ? '+' : ''}₹{Math.abs(portfolioSummary.totalPnL).toLocaleString()} ({portfolioSummary.totalPnLPercent.toFixed(2)}%)
          </div>
        </div>
        <div className="pa-summary-card">
          <div className="pa-label">Total Return</div>
          <div className={`pa-value ${performanceMetrics.totalReturn >= 0 ? 'pa-green' : 'pa-red'}`}>
            {performanceMetrics.totalReturn >= 0 ? '+' : ''}{performanceMetrics.totalReturn.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Top Gainers/Losers in Portfolio */}
      <div className="pa-top-movers-row">
        <div className="pa-top-movers-card">
          <div className="pa-section-title">Top Gainers in Your Portfolio</div>
          <div className="pa-movers-list">
            {topGainers.length > 0 ? (
              topGainers.map((h, idx) => (
                <div className="pa-mover-pill pa-mover-gain" key={idx}>
                  <span className="pa-mover-icon">▲</span>
                  <span className="pa-mover-symbol">{h.stock}</span>
                  <span className="pa-mover-pct">{h.change}</span>
                  <span className="pa-mover-price">₹{h.price}</span>
                </div>
              ))
            ) : (
              <div className="pa-mover-empty">No gainers found in your portfolio</div>
            )}
          </div>
        </div>
        <div className="pa-top-movers-card">
          <div className="pa-section-title">Top Losers in Your Portfolio</div>
          <div className="pa-movers-list">
            {topLosers.length > 0 ? (
              topLosers.map((h, idx) => (
                <div className="pa-mover-pill pa-mover-loss" key={idx}>
                  <span className="pa-mover-icon">▼</span>
                  <span className="pa-mover-symbol">{h.stock}</span>
                  <span className="pa-mover-pct">{h.change}</span>
                  <span className="pa-mover-price">₹{h.price}</span>
                </div>
              ))
            ) : (
              <div className="pa-mover-empty">No losers found in your portfolio</div>
            )}
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
          <div className="pa-metric-value">{performanceMetrics.sharpeRatio}</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Beta</div>
          <div className="pa-metric-value">{performanceMetrics.beta}</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Volatility</div>
          <div className="pa-metric-value">{performanceMetrics.volatility}%</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Max Drawdown</div>
          <div className="pa-metric-value pa-red">{performanceMetrics.maxDrawdown}%</div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="chart-card full-width">
        <h4>Portfolio vs Benchmark</h4>
        <div className="chart-container">
          <Line data={benchmarkChartData} options={chartOptions} />
        </div>
      </div>
      
      {/* Top Gainers and Losers */}
      <div className="pa-gainers-losers-grid">
        <div className="pa-gainers-card pa-card">
          <div className="pa-section-title">Top Gainers Today</div>
          <ul className="pa-gainers-list">
            {marketMovers.topGainers.map((stock, idx) => (
              <li key={idx} className="pa-gainer-item">
                <div className="pa-gain-main">
                  <span className="pa-gain-symbol">{stock.symbol}</span>
                  <span className="pa-gain-price">₹{stock.price}</span>
                </div>
                <div className="pa-gain-meta">
                  <span className="pa-gain-arrow pa-green">▲</span>
                  <span className="pa-gain-change pa-green">{stock.percent > 0 ? '+' : ''}{stock.percent.toFixed(2)}%</span>
                  <span className="pa-gain-volume">{stock.volume}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="pa-losers-card pa-card">
          <div className="pa-section-title">Top Losers Today</div>
          <ul className="pa-losers-list">
            {marketMovers.topLosers.map((stock, idx) => (
              <li key={idx} className="pa-loser-item">
                <div className="pa-gain-main">
                  <span className="pa-gain-symbol">{stock.symbol}</span>
                  <span className="pa-gain-price">₹{stock.price}</span>
                </div>
                <div className="pa-gain-meta">
                  <span className="pa-gain-arrow pa-red">▼</span>
                  <span className="pa-gain-change pa-red">{stock.percent > 0 ? '+' : ''}{stock.percent.toFixed(2)}%</span>
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
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx, idx) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No recent transactions found</td>
              </tr>
            )}
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
              <span className="pa-mover-symbol">{m.symbol}</span>
              <span className="pa-mover-pct">{m.percent > 0 ? '+' : ''}{m.percent.toFixed(2)}%</span>
            </div>
          ))}
          {marketLosers.map((m, idx) => (
            <div className="pa-market-mover-pill pa-mover-loss" key={"ml"+idx}>
              <span className="pa-mover-icon">▼</span>
              <span className="pa-mover-symbol">{m.symbol}</span>
              <span className="pa-mover-pct">{m.percent > 0 ? '+' : ''}{m.percent.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;