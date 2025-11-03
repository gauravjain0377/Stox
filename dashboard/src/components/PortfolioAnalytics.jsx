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
  const { holdings: userHoldings, holdingsLoading, realTimePrices = {}, orders } = useGeneralContext();
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
      
      // Build realistic index series so the chart isn't empty for brand new users
      const base = 100000;
      let nifty = base * 0.98;
      let sensex = base * 1.02;
      const niftySeries = [];
      const sensexSeries = [];
      for (let i = 0; i < 6; i++) {
        const nChange = (Math.random() - 0.5) * 0.06; // ±3%
        const sChange = nChange + (Math.random() - 0.5) * 0.02; // small variation
        nifty = Math.max(0, nifty * (1 + nChange));
        sensex = Math.max(0, sensex * (1 + sChange));
        niftySeries.push(nifty);
        sensexSeries.push(sensex);
      }
      setBenchmarkData({
        labels: benchmarkLabels,
        portfolio: Array(6).fill(0),
        nifty: niftySeries,
        sensex: sensexSeries
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
      
      // If computed series are all zeros, synthesize from holdings so charts aren't flat
      const allZeros = (arr) => !arr || arr.every(v => !v || v === 0);
      const investedNow = (userHoldings || []).reduce((s, h) => s + (h.avg || 0) * (h.qty || 0), 0);
      const currentNow = (userHoldings || []).reduce((s, h) => {
        const curPrice = (realTimePrices && realTimePrices[h.name]) || h.price || 0;
        return s + curPrice * (h.qty || 0);
      }, 0);

      const generateHistoryFromHoldings = (len, startValue, endValue) => {
        const series = [];
        const drift = len > 1 ? (endValue - startValue) / (len - 1) : 0;
        for (let i = 0; i < len; i++) {
          const base = startValue + drift * i;
          const noise = base * 0.005 * (Math.sin(i * 1.7) + (Math.random() - 0.5));
          series.push(Math.max(0, base + noise));
        }
        return series;
      };

      const filledWeek = allZeros(weekData) && currentNow > 0
        ? generateHistoryFromHoldings(7, Math.max(0, currentNow * 0.98), currentNow)
        : weekData;
      const filledMonth = allZeros(monthData) && currentNow > 0
        ? generateHistoryFromHoldings(10, Math.max(0, currentNow * 0.95), currentNow)
        : monthData;
      const filledYear = allZeros(yearData) && investedNow > 0
        ? generateHistoryFromHoldings(12, investedNow, currentNow || investedNow * 1.04)
        : yearData;

      setPortfolioHistory({
        Week: filledWeek,
        Month: filledMonth,
        Year: filledYear
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
          // IT & Technology
          "TCS": "IT",
          "INFY": "IT",
          "WIPRO": "IT",
          "HCLTECH": "IT",
          "TECHM": "IT",
          "LTIM": "IT",
          "MINDTREE": "IT",
          "OFSS": "IT",
          
          // Energy
          "RELIANCE": "Energy",
          "ONGC": "Energy",
          "BPCL": "Energy",
          "IOC": "Energy",
          "GAIL": "Energy",
          "NTPC": "Energy",
          "POWERGRID": "Energy",
          "ADANIENSOL": "Energy",
          "COALINDIA": "Energy",
          
          // Finance
          "HDFCBANK": "Finance",
          "ICICIBANK": "Finance",
          "SBIN": "Finance",
          "KOTAKBANK": "Finance",
          "AXISBANK": "Finance",
          "BAJFINANCE": "Finance",
          "INDUSINDBK": "Finance",
          "HDFC": "Finance",
          "ICICIGI": "Finance",
          
          // Pharma
          "SUNPHARMA": "Pharma",
          "DRREDDY": "Pharma",
          "CIPLA": "Pharma",
          "DIVISLAB": "Pharma",
          "LUPIN": "Pharma",
          "AUROPHARMA": "Pharma",
          
          // Automotive
          "TATAMOTORS": "Auto",
          "M&M": "Auto",
          "MARUTI": "Auto",
          "HEROMOTOCO": "Auto",
          "BAJAJ-AUTO": "Auto",
          "EICHERMOT": "Auto",
          "ASHOKLEY": "Auto",
          
          // FMCG
          "ITC": "FMCG",
          "HINDUNILVR": "FMCG",
          "NESTLEIND": "FMCG",
          "BRITANNIA": "FMCG",
          "DABUR": "FMCG",
          "COLPAL": "FMCG",
          "UBL": "FMCG",
          "MCDOWELL-N": "FMCG",
          
          // Telecom
          "BHARTIARTL": "Telecom",
          "TELENOR": "Telecom",
          
          // Construction & Infrastructure
          "LT": "Construction",
          "ULTRACEMCO": "Construction",
          "SHREECEM": "Construction",
          
          // Consumer Goods
          "ASIANPAINT": "Consumer",
          "TITAN": "Consumer",
          "TATACONSUM": "Consumer",
          
          // Metals & Mining
          "JSWSTEEL": "Metals",
          "HINDALCO": "Metals",
          "TATASTEEL": "Metals",
          "COALINDIA": "Metals",
          
          // Chemicals
          "UPL": "Chemicals",
          "PIIND": "Chemicals",
          
          // Logistics & Transportation
          "ADANIPORTS": "Logistics",
          "VEDL": "Logistics",
          
          // Cement
          "GRASIM": "Cement",
          "ULTRACEMCO": "Cement",
          "SHREECEM": "Cement",
          
          // Healthcare
          "APOLLOHOSP": "Healthcare",
          "FORTIS": "Healthcare",
          
          // Media & Entertainment
          "ZEEL": "Media",
          "SUNTV": "Media",
          
          // Retail
          "DMART": "Retail",
          "RELAXO": "Retail"
        };

        const inferSector = (name = "") => {
          const upper = name.toUpperCase();
          
          // Finance
          if (upper.includes("BANK") || upper.includes("FINANCE") || upper.includes("NBFC") || 
              upper.includes("FINANCIAL") || upper.includes("PAYMENT")) return "Finance";
          
          // Pharma
          if (upper.includes("PHARMA") || upper.includes("PHARMACEUTICAL") || 
              upper.includes("HOSPITAL") || upper.includes("LIFE")) return "Pharma";
          
          // Energy
          if (upper.includes("OIL") || upper.includes("GAS") || upper.includes("ENERGY") || 
              upper.includes("PETROLEUM") || upper.includes("POWER")) return "Energy";
          
          // Auto
          if (upper.includes("AUTO") || upper.includes("MOTOR") || upper.includes("TRACTOR") || 
              upper.includes("VEHICLE")) return "Auto";
          
          // IT
          if (upper.includes("TECH") || upper.includes("INFOSYS") || upper.includes("IT") || 
              upper.includes("SOFTWARE") || upper.includes("SYSTEMS")) return "IT";
          
          // FMCG
          if (upper.includes("FMCG") || upper.includes("FOODS") || upper.includes("BEVERAGES") || 
              upper.includes("CONSUMER") || upper.includes("PERSONAL CARE")) return "FMCG";
          
          // Industrial
          if (upper.includes("STEEL") || upper.includes("CEMENT") || upper.includes("INFRA") || 
              upper.includes("INDUSTRIAL") || upper.includes("MANUFACTURING")) return "Industrial";
          
          // Telecom
          if (upper.includes("TELECOM") || upper.includes("AIRTEL") || upper.includes("COMMUNICATION")) return "Telecom";
          
          // Consumer
          if (upper.includes("PAINT") || upper.includes("ASIAN") || upper.includes("RETAIL") || 
              upper.includes("APPAREL")) return "Consumer";
          
          // Logistics
          if (upper.includes("PORTS") || upper.includes("LOGISTICS") || upper.includes("TRANSPORT")) return "Logistics";
          
          // Mining
          if (upper.includes("COAL") || upper.includes("MINING") || upper.includes("METALS")) return "Metals";
          
          // Chemicals
          if (upper.includes("CHEMICAL") || upper.includes("UPL") || upper.includes("FERTILIZER")) return "Chemicals";
          
          // Cement
          if (upper.includes("CEMENT") || upper.includes("ULTRA") || upper.includes("GRASIM")) return "Cement";
          
          // Construction
          if (upper.includes("CONSTRUCTION") || upper.includes("LT") || upper.includes("BUILDING")) return "Construction";
          
          // Healthcare
          if (upper.includes("HEALTH") || upper.includes("HOSPITAL") || upper.includes("MEDICAL")) return "Healthcare";
          
          // Media
          if (upper.includes("MEDIA") || upper.includes("ENTERTAINMENT") || upper.includes("BROADCAST")) return "Media";
          
          return "Other";
        };
        
        // Group holdings by sector
        const sectorValues = {};
        
        userHoldings.forEach(holding => {
          const sector = stockSectors[holding.name] || inferSector(holding.name);
          
          if (!sectorValues[sector]) {
            sectorValues[sector] = 0;
          }
          
          // Use real-time prices for current value calculation
          const currentPrice = (realTimePrices && realTimePrices[holding.name]) || holding.price || 0;
          sectorValues[sector] += currentPrice * (holding.qty || 0);
        });
        
        // Convert to arrays for chart
        const sectorLabels = Object.keys(sectorValues);
        const sectorData = Object.values(sectorValues);
        
        // Calculate percentages
        const totalValue = sectorData.reduce((sum, value) => sum + value, 0);
        const sectorPercentages = totalValue > 0 ? sectorData.map(value => (value / totalValue) * 100) : [];
        
        // Filter out sectors with less than 1% allocation to reduce clutter
        const filteredSectors = sectorLabels
          .map((label, index) => ({ label, percentage: sectorPercentages[index], value: sectorData[index] }))
          .filter(s => s.percentage >= 1.0) // Only show sectors with 1% or more allocation
          .sort((a, b) => b.percentage - a.percentage);
        
        // If we have sectors less than 1%, group them as "Other"
        const smallSectors = sectorLabels
          .map((label, index) => ({ label, percentage: sectorPercentages[index], value: sectorData[index] }))
          .filter(s => s.percentage < 1.0);
        
        if (smallSectors.length > 0) {
          const otherPercentage = smallSectors.reduce((sum, s) => sum + s.percentage, 0);
          const otherValue = smallSectors.reduce((sum, s) => sum + s.value, 0);
          if (otherPercentage >= 0.5) { // Only add "Other" if it's significant
            filteredSectors.push({ label: "Other", percentage: otherPercentage, value: otherValue });
          }
        }
        
        const filteredLabels = filteredSectors.map(s => s.label);
        const filteredPercentages = filteredSectors.map(s => s.percentage);
        
        setSectorAllocation({
          labels: filteredLabels,
          data: filteredPercentages
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
      
      // Generate more realistic benchmark data
      // Start with a base value and apply realistic market fluctuations
      const basePortfolioValue = yearData.length > 0 ? yearData[0] : 100000;
      let currentNifty = basePortfolioValue * 0.95; // Start slightly lower
      let currentSensex = basePortfolioValue * 1.05; // Start slightly higher
      
      for (let i = 0; i < 6; i++) {
        // Get portfolio value for this period
        const index = Math.min(Math.floor(i * (yearData.length / 6)), yearData.length - 1);
        const portfolioValue = yearData[index] || (basePortfolioValue * (1 + (i * 0.05))); // Fallback growth
        portfolioData.push(portfolioValue);
        
        // Apply realistic market fluctuations to indices
        // Nifty typically has lower volatility than individual stocks
        const niftyChange = (Math.random() - 0.5) * 0.08; // ±4% monthly change
        currentNifty = currentNifty * (1 + niftyChange);
        niftyData.push(currentNifty);
        
        // Sensex typically correlates with Nifty but with slight differences
        const sensexChange = niftyChange + (Math.random() - 0.5) * 0.03; // Slight variation from Nifty
        currentSensex = currentSensex * (1 + sensexChange);
        sensexData.push(currentSensex);
      }
      
      setBenchmarkData({
        labels: benchmarkLabels,
        portfolio: portfolioData,
        nifty: niftyData,
        sensex: sensexData
      });
      
      // Calculate top gainers and losers from holdings using real-time prices
      if (userHoldings && userHoldings.length > 0) {
        // Calculate percent change for each holding using real-time prices
        const holdingsWithChange = userHoldings.map(holding => {
          const currentPrice = (realTimePrices && realTimePrices[holding.name]) || holding.price || 0;
          const currentValue = currentPrice * (holding.qty || 0);
          const investedValue = (holding.avg || 0) * (holding.qty || 0);
          const percentChange = investedValue > 0 ? ((currentValue - investedValue) / investedValue) * 100 : 0;
          
          return {
            stock: holding.name,
            change: percentChange > 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`,
            price: currentPrice,
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
      const perfSeries = (filledYear && filledYear.length ? filledYear : yearData);
      if (perfSeries.length > 0 && perfSeries[0] > 0) {
        const startValue = perfSeries[0];
        const endValue = perfSeries[perfSeries.length - 1];
        const totalReturn = ((endValue - startValue) / startValue) * 100;
        
        // Simple annualized return calculation
        const annualizedReturn = totalReturn;
        
        // Calculate volatility (standard deviation of returns)
        const returns = [];
        for (let i = 1; i < perfSeries.length; i++) {
          if (perfSeries[i-1] > 0) {
            returns.push((perfSeries[i] - perfSeries[i-1]) / perfSeries[i-1]);
          }
        }
        
        if (returns.length > 0) {
          const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
          const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length) * 100;
          
          // Approximate Sharpe ratio (assuming risk-free rate of 4%)
          const sharpeRatio = volatility > 0 ? (annualizedReturn - 4) / volatility : 0;
          
          // Calculate maximum drawdown
          let maxDrawdown = 0;
          let peak = perfSeries[0];
          
          for (const value of perfSeries) {
            if (value > peak) {
              peak = value;
            }
            
            if (peak > 0) {
              const drawdown = (peak - value) / peak * 100;
              if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
              }
            }
          }
          
          // Estimate Beta using covariance with simulated Nifty data (from benchmarkData above)
          let beta = 0;
          if (portfolioData.length > 1 && niftyData.length > 1) {
            const pRet = [];
            const mRet = [];
            for (let i = 1; i < portfolioData.length; i++) {
              if (portfolioData[i-1] > 0 && niftyData[i-1] > 0) {
                pRet.push((portfolioData[i] - portfolioData[i-1]) / portfolioData[i-1]);
                mRet.push((niftyData[i] - niftyData[i-1]) / niftyData[i-1]);
              }
            }
            if (pRet.length > 1) {
              const meanP = pRet.reduce((a,b)=>a+b,0)/pRet.length;
              const meanM = mRet.reduce((a,b)=>a+b,0)/mRet.length;
              const cov = pRet.reduce((sum, pr, i) => sum + (pr - meanP) * (mRet[i] - meanM), 0) / (pRet.length - 1);
              const varM = mRet.reduce((sum, mr) => sum + Math.pow(mr - meanM, 2), 0) / (mRet.length - 1);
              beta = varM > 0 ? cov / varM : 0;
                      
              // Ensure beta is a reasonable value
              beta = Math.max(-2, Math.min(2, beta)); // Cap between -2 and 2
            }
          }

          setPerformanceMetrics({
            totalReturn: totalReturn,
            annualizedReturn: annualizedReturn,
            sharpeRatio: isNaN(sharpeRatio) ? 0 : sharpeRatio,
            maxDrawdown: -maxDrawdown,
            volatility: isNaN(volatility) ? 0 : volatility,
            beta: isNaN(beta) ? 0 : beta
          });
        } else {
          setPerformanceMetrics({
            totalReturn: totalReturn,
            annualizedReturn: annualizedReturn,
            sharpeRatio: 0,
            maxDrawdown: 0,
            volatility: 0,
            beta: 0
          });
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating portfolio history:", error);
      setIsLoading(false);
    }
  }, [orders, holdingsLoading, userHoldings, realTimePrices]);
  
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
        holdings[name] = { qty: 0, avgPrice: 0 };
      }
      
      const quantity = parseInt(qty);
      
      if (mode === "BUY") {
        // Calculate new average price
        const totalValue = holdings[name].avgPrice * holdings[name].qty + price * quantity;
        const totalQty = holdings[name].qty + quantity;
        holdings[name].avgPrice = totalQty > 0 ? totalValue / totalQty : 0;
        holdings[name].qty = totalQty;
      } else if (mode === "SELL") {
        holdings[name].qty -= quantity;
        // Keep the same average price for remaining shares
        if (holdings[name].qty <= 0) {
          delete holdings[name];
        }
      }
    });
    
    // Calculate total portfolio value using real-time prices if available
    let totalValue = 0;
    Object.keys(holdings).forEach(stockName => {
      const holding = holdings[stockName];
      const currentPrice = (realTimePrices && realTimePrices[stockName]) || holding.avgPrice || 0;
      totalValue += currentPrice * holding.qty;
    });
    
    return totalValue;
  };

  // Build readable time labels for charts
  const buildTimeLabels = () => {
    const now = new Date();
    if (time === "Week") {
      const labels = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }));
      }
      return labels;
    }
    if (time === "Month") {
      const labels = [];
      for (let i = 29; i >= 0; i -= 3) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }));
      }
      return labels;
    }
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const labels = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      labels.push(months[d.getMonth()]);
    }
    return labels;
  };

  // Portfolio Value Over Time
  const lineData = {
    labels: buildTimeLabels(),
    datasets: [
      {
        label: "Portfolio Value",
        data: portfolioHistory[time] || [],
        borderColor: theme === 'dark' ? "#3b82f6" : "#2563eb",
        backgroundColor: theme === 'dark' ? "rgba(59,130,246,0.1)" : "rgba(37,99,235,0.08)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: theme === 'dark' ? "#3b82f6" : "#2563eb",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        borderWidth: 3,
        pointStyle: 'circle',
        pointHoverBackgroundColor: theme === 'dark' ? "#60a5fa" : "#3b82f6"
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
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
        hidden: !((benchmarkData.portfolio || []).some(v => v && v > 0))
      },
      {
        label: "Nifty 50",
        data: benchmarkData.nifty || [],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        borderDash: [5, 5]
      },
      {
        label: "Sensex",
        data: benchmarkData.sensex || [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }
    ]
  };

  // Sector-wise Allocation
  const doughnutData = {
    labels: sectorAllocation.labels || [],
    datasets: [
      {
        data: sectorAllocation.data || [],
        backgroundColor: [
          '#3b82f6', '#60a5fa', '#a5b4fc', '#fbbf24', '#34d399', 
          '#f87171', '#f472b6', '#a78bfa', '#67e8f9', '#86efac',
          '#fdba74', '#c084fc', '#fda4af', '#93c5fd', '#a5f3fc'
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 10
      }
    ]
  };

  // Chart options with theme-aware colors
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      tooltip: { 
        enabled: true,
        backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#f8fafc' : '#1e293b',
        bodyColor: theme === 'dark' ? '#cbd5e1' : '#64748b',
        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const value = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
              // Calculate profit/loss if we have previous data point
              let profitLoss = '';
              if (context.dataIndex > 0 && context.dataset.data[context.dataIndex - 1]) {
                const prevValue = context.dataset.data[context.dataIndex - 1];
                const diff = context.parsed.y - prevValue;
                const percent = prevValue > 0 ? (diff / prevValue * 100).toFixed(2) : '0.00';
                const diffFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Math.abs(diff));
                profitLoss = ` (${diff >= 0 ? '+' : '-'}${diffFormatted}, ${diff >= 0 ? '+' : ''}${percent}%)`;
              }
              label += value + profitLoss;
            }
            return label;
          },
          title: function(context) {
            return `Date: ${context[0].label}`;
          }
        }
      },
      legend: { display: false }
    },
    scales: { 
      x: { 
        grid: { 
          color: theme === 'dark' ? '#334155' : '#f3f4f6',
          drawBorder: false
        },
        ticks: { 
          color: theme === 'dark' ? '#cbd5e1' : '#64748b',
          font: {
            size: 11
          }
        }
      }, 
      y: { 
        grid: { 
          color: theme === 'dark' ? '#334155' : '#f3f4f6',
          drawBorder: false
        },
        ticks: { 
          color: theme === 'dark' ? '#cbd5e1' : '#64748b',
          font: {
            size: 11
          },
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      } 
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };
  
  // Doughnut chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#f8fafc' : '#1e293b',
        bodyColor: theme === 'dark' ? '#cbd5e1' : '#64748b',
        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            // Calculate the actual value in rupees for this sector
            const totalPortfolioValue = userHoldings?.reduce((sum, stock) => {
              const currentPrice = (realTimePrices && realTimePrices[stock.name]) || stock.price || 0;
              return sum + currentPrice * (stock.qty || 0);
            }, 0) || 0;
            
            const sectorValue = totalPortfolioValue * (context.raw / 100);
            const valueFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sectorValue);
            
            return `${context.label}: ${context.raw.toFixed(2)}% (${valueFormatted})`;
          }
        }
      }
    },
    cutout: '65%',
    animation: {
      animateRotate: true,
      animateScale: false
    }
  };
  
  const benchmarkChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      tooltip: { 
        enabled: true,
        backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#f8fafc' : '#1e293b',
        bodyColor: theme === 'dark' ? '#cbd5e1' : '#64748b',
        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const value = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
              // Calculate performance compared to first data point
              if (context.dataset.data && context.dataset.data.length > 0 && context.dataset.data[0] > 0) {
                const firstValue = context.dataset.data[0];
                const diff = context.parsed.y - firstValue;
                const percent = ((diff / firstValue) * 100).toFixed(2);
                const diffFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Math.abs(diff));
                label += `${value} (${diff >= 0 ? '+' : '-'}${diffFormatted}, ${diff >= 0 ? '+' : ''}${percent}%)`;
              } else {
                label += value;
              }
            }
            return label;
          },
          title: function(context) {
            return `Period: ${context[0].label}`;
          }
        }
      },
      legend: { 
        position: "bottom",
        labels: {
          color: theme === 'dark' ? '#f8fafc' : '#1e293b',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    scales: { 
      x: { 
        grid: { 
          color: theme === 'dark' ? '#334155' : '#f3f4f6',
          drawBorder: false
        },
        ticks: { 
          color: theme === 'dark' ? '#cbd5e1' : '#64748b',
          font: {
            size: 11
          }
        }
      }, 
      y: { 
        grid: { 
          color: theme === 'dark' ? '#334155' : '#f3f4f6',
          drawBorder: false
        },
        ticks: { 
          color: theme === 'dark' ? '#cbd5e1' : '#64748b',
          font: {
            size: 11
          },
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      } 
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  // Calculate portfolio summary with real-time prices using the same logic as Holdings page
  const portfolioSummary = {
    totalValue: userHoldings?.reduce((sum, stock) => {
      const currentPrice = (realTimePrices && realTimePrices[stock.name]) || stock.price || 0;
      return sum + currentPrice * (stock.qty || 0);
    }, 0) || 0,
    totalInvestment: userHoldings?.reduce((sum, stock) => sum + (stock.avg || 0) * (stock.qty || 0), 0) || 0,
    totalPnL: 0,
    totalPnLPercent: 0
  };

  if (portfolioSummary.totalInvestment > 0) {
    portfolioSummary.totalPnL = portfolioSummary.totalValue - portfolioSummary.totalInvestment;
    portfolioSummary.totalPnLPercent = (portfolioSummary.totalPnL / portfolioSummary.totalInvestment) * 100;
  }

  // Calculate top gainers/losers in user's portfolio with real-time prices
  const sortedHoldings = (userHoldings || []).map(h => {
    const currentPrice = (realTimePrices && realTimePrices[h.name]) || h.price || 0;
    const invested = (h.avg || 0) * (h.qty || 0);
    const current = currentPrice * (h.qty || 0);
    const percent = invested > 0 ? ((current - invested) / invested) * 100 : 0;
    return { ...h, percent, current, currentPrice };
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
          <div className="pa-value">₹{portfolioSummary.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
        <div className="pa-summary-card">
          <div className="pa-label">Total Investment</div>
          <div className="pa-value">₹{portfolioSummary.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
        <div className="pa-summary-card">
          <div className="pa-label">Total P&L</div>
          <div className={`pa-value ${portfolioSummary.totalPnL >= 0 ? 'pa-green' : 'pa-red'}`}>
            {portfolioSummary.totalPnL >= 0 ? '+' : ''}₹{Math.abs(portfolioSummary.totalPnL).toLocaleString(undefined, { maximumFractionDigits: 2 })} ({portfolioSummary.totalPnLPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Top Gainers/Losers in Portfolio */}
      <div className="pa-top-movers-row">
        <div className="pa-top-movers-card">
          <div className="pa-section-title">Top Gainers in Your Portfolio</div>
          <div className="pa-movers-list">
            {topPortfolioGainers.length > 0 ? (
              topPortfolioGainers.map((h, idx) => (
                <div className="pa-mover-pill pa-mover-gain" key={idx}>
                  <div className="pa-mover-main">
                    <span className="pa-mover-icon">▲</span>
                    <span className="pa-mover-symbol">{h.name}</span>
                  </div>
                  <div className="pa-mover-details">
                    <span className="pa-mover-pct">{h.percent > 0 ? '+' : ''}{h.percent.toFixed(2)}%</span>
                    <span className="pa-mover-price">₹{h.currentPrice.toFixed(2)}</span>
                  </div>
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
            {topPortfolioLosers.length > 0 ? (
              topPortfolioLosers.map((h, idx) => (
                <div className="pa-mover-pill pa-mover-loss" key={idx}>
                  <div className="pa-mover-main">
                    <span className="pa-mover-icon">▼</span>
                    <span className="pa-mover-symbol">{h.name}</span>
                  </div>
                  <div className="pa-mover-details">
                    <span className="pa-mover-pct">{h.percent > 0 ? '+' : ''}{h.percent.toFixed(2)}%</span>
                    <span className="pa-mover-price">₹{h.currentPrice.toFixed(2)}</span>
                  </div>
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
          <div className="pa-legend" aria-label="Portfolio Value Legend">
            <div className="pa-legend-item">
              <span className="pa-legend-dot" style={{ background: theme === 'dark' ? '#3b82f6' : '#2563eb' }} />
              <span>Portfolio Value</span>
            </div>
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
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="pa-legend" aria-label="Sector Allocation Legend">
            {(doughnutData.labels || []).slice(0, 6).map((label, i) => (
              <div key={label+"-legend"} className="pa-legend-item">
                <span className="pa-legend-dot" style={{ background: doughnutData.datasets[0].backgroundColor[i % doughnutData.datasets[0].backgroundColor.length] }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pa-metrics-grid">
        <div className="pa-metric">
          <div className="pa-metric-label">Sharpe Ratio</div>
          <div className="pa-metric-value">{performanceMetrics.sharpeRatio.toFixed(2)}</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Beta</div>
          <div className="pa-metric-value">{performanceMetrics.beta.toFixed(2)}</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Volatility</div>
          <div className="pa-metric-value">{performanceMetrics.volatility.toFixed(2)}%</div>
        </div>
        <div className="pa-metric">
          <div className="pa-metric-label">Max Drawdown</div>
          <div className="pa-metric-value pa-red">{performanceMetrics.maxDrawdown.toFixed(2)}%</div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="chart-card full-width">
        <h4>Portfolio vs Benchmark</h4>
        <div className="chart-container">
          <Line data={benchmarkChartData} options={benchmarkChartOptions} />
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
                  <span className="pa-gain-price">₹{stock.price?.toFixed(2)}</span>
                </div>
                <div className="pa-gain-meta">
                  <span className="pa-gain-arrow pa-green">▲</span>
                  <span className="pa-gain-change pa-green">{stock.percent > 0 ? '+' : ''}{stock.percent?.toFixed(2)}%</span>
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
                  <span className="pa-gain-price">₹{stock.price?.toFixed(2)}</span>
                </div>
                <div className="pa-gain-meta">
                  <span className="pa-gain-arrow pa-red">▼</span>
                  <span className="pa-gain-change pa-red">{stock.percent > 0 ? '+' : ''}{stock.percent?.toFixed(2)}%</span>
                  <span className="pa-gain-volume">{stock.volume}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pa-section-title pa-rt-title">Recent Transactions</div>
      <div className="pa-rt-table-outer">
        {/* Desktop Table */}
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
                  <td>₹{tx.price?.toFixed(2)}</td>
                  <td>₹{tx.total?.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No recent transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Mobile Cards */}
        <div className="pa-rt-mobile-cards">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx, idx) => (
              <div key={idx} className="pa-rt-mobile-card">
                <div className="pa-rt-mobile-card-header">
                  <span className="pa-rt-mobile-stock">{tx.stock}</span>
                  <span className="pa-rt-mobile-date">{new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="pa-rt-mobile-body">
                  <div className="pa-rt-mobile-item">
                    <span className="pa-rt-mobile-label">Type</span>
                    <span className={`pa-rt-mobile-value`}>
                      <span className={`pa-rt-type-badge ${tx.type.toLowerCase()}`}>{tx.type}</span>
                    </span>
                  </div>
                  <div className="pa-rt-mobile-item">
                    <span className="pa-rt-mobile-label">Quantity</span>
                    <span className="pa-rt-mobile-value">{tx.quantity}</span>
                  </div>
                  <div className="pa-rt-mobile-item">
                    <span className="pa-rt-mobile-label">Price</span>
                    <span className="pa-rt-mobile-value">₹{tx.price?.toFixed(2)}</span>
                  </div>
                  <div className="pa-rt-mobile-item">
                    <span className="pa-rt-mobile-label">Total</span>
                    <span className="pa-rt-mobile-value">₹{tx.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="pa-rt-mobile-card text-center py-4">
              <p className="text-gray-500">No recent transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Holdings Summary and News Feed */}
      <div className="analytics-grid">
        <div className="card">
          <h4>Current Holdings</h4>
          <div className="holdings-summary">
            {userHoldings && userHoldings.length > 0 ? (
              <>
                {/* Desktop Table */}
                <table className="holdings-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Qty</th>
                      <th>Avg. Cost</th>
                      <th>Current Price</th>
                      <th>Value</th>
                      <th>P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userHoldings.map((holding, index) => {
                      const currentPrice = (realTimePrices && realTimePrices[holding.name]) || holding.price || 0;
                      const currentValue = currentPrice * (holding.qty || 0);
                      const investedValue = (holding.avg || 0) * (holding.qty || 0);
                      const pnl = currentValue - investedValue;
                      const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;
                      
                      return (
                        <tr key={index}>
                          <td className="holding-symbol">{holding.name}</td>
                          <td className="holding-qty">{holding.qty}</td>
                          <td className="holding-avg">₹{holding.avg?.toFixed(2)}</td>
                          <td className="holding-price">₹{currentPrice.toFixed(2)}</td>
                          <td className="holding-value">₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          <td className={`holding-pnl ${pnl >= 0 ? 'positive' : 'negative'}`}>
                            {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toFixed(2)}
                            <br />
                            <span>({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {/* Mobile Cards */}
                <div className="holdings-mobile-cards">
                  {userHoldings.map((holding, index) => {
                    const currentPrice = (realTimePrices && realTimePrices[holding.name]) || holding.price || 0;
                    const currentValue = currentPrice * (holding.qty || 0);
                    const investedValue = (holding.avg || 0) * (holding.qty || 0);
                    const pnl = currentValue - investedValue;
                    const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;
                    
                    return (
                      <div key={index} className="holdings-mobile-card">
                        <div className="holdings-mobile-header">
                          <span className="holdings-mobile-symbol">{holding.name}</span>
                          <span className="holdings-mobile-qty">Qty: {holding.qty}</span>
                        </div>
                        <div className="holdings-mobile-body">
                          <div className="holdings-mobile-item">
                            <span className="holdings-mobile-label">Avg Cost</span>
                            <span className="holdings-mobile-value">₹{holding.avg?.toFixed(2)}</span>
                          </div>
                          <div className="holdings-mobile-item">
                            <span className="holdings-mobile-label">Current Price</span>
                            <span className="holdings-mobile-value">₹{currentPrice.toFixed(2)}</span>
                          </div>
                          <div className="holdings-mobile-item">
                            <span className="holdings-mobile-label">Value</span>
                            <span className="holdings-mobile-value">₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className={`holdings-mobile-item holdings-mobile-pnl ${pnl >= 0 ? 'positive' : 'negative'}`}>
                            <span className="holdings-mobile-label">P&L</span>
                            <span className="holdings-mobile-value">
                              {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toFixed(2)} ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
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
              <div className="pa-mover-main">
                <span className="pa-mover-icon">▲</span>
                <span className="pa-mover-symbol">{m.symbol}</span>
              </div>
              <div className="pa-mover-details">
                <span className="pa-mover-pct">{m.percent > 0 ? '+' : ''}{m.percent?.toFixed(2)}%</span>
              </div>
            </div>
          ))}
          {marketLosers.map((m, idx) => (
            <div className="pa-market-mover-pill pa-mover-loss" key={"ml"+idx}>
              <div className="pa-mover-main">
                <span className="pa-mover-icon">▼</span>
                <span className="pa-mover-symbol">{m.symbol}</span>
              </div>
              <div className="pa-mover-details">
                <span className="pa-mover-pct">{m.percent > 0 ? '+' : ''}{m.percent?.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;