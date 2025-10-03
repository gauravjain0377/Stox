import React, { useState, useEffect, useRef } from "react";
import { useGeneralContext } from "./GeneralContext";
import { VerticalGraph } from "./VerticalGraph";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/Holdings.css';

const Holdings = () => {
  const { holdings: allHoldings, holdingsLoading, openSellWindow, usingFallbackData, setSelectedStock } = useGeneralContext();
  const navigate = useNavigate();
  const [realTimePrices, setRealTimePrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const socketRef = useRef(null);
  const priceUpdateTimeoutRef = useRef({});
  const smoothUpdateIntervalRef = useRef(null);
  
  // Function for smooth price transitions
  const updatePricesSmoothly = (stockName, newPrice) => {
    const currentPrice = realTimePrices[stockName];
    
    // Only update if price actually changed significantly (avoid micro-fluctuations)
    if (currentPrice && Math.abs(newPrice - currentPrice) < 0.01) {
      return; // Skip tiny changes
    }
    
    // Clear any existing timeout for this stock
    if (priceUpdateTimeoutRef.current[stockName]) {
      clearTimeout(priceUpdateTimeoutRef.current[stockName]);
    }
    
    // Smooth transition with debouncing
    priceUpdateTimeoutRef.current[stockName] = setTimeout(() => {
      setRealTimePrices(prev => {
        const updated = { ...prev, [stockName]: newPrice };
        return updated;
      });
      
      // Show subtle change indicator
      if (currentPrice && newPrice !== currentPrice) {
        setPriceChanges(prev => ({
          ...prev,
          [stockName]: newPrice > currentPrice ? 'up' : 'down'
        }));
        
        // Remove change indicator after 3 seconds (longer for smoother feel)
        setTimeout(() => {
          setPriceChanges(prev => {
            const updated = { ...prev };
            delete updated[stockName];
            return updated;
          });
        }, 3000);
      }
      
      setLastUpdateTime(new Date());
    }, 500); // 500ms delay for smoother updates
  };
  
  // WebSocket connection for real-time price updates
  useEffect(() => {
    if (!allHoldings || allHoldings.length === 0) return;
    
    console.log('Holdings: Setting up WebSocket connection for real-time prices');
    
    // Initialize socket connection
    socketRef.current = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
    
    const socket = socketRef.current;
    
    // Connection events
    socket.on('connect', () => {
      console.log('Holdings: WebSocket connected');
      setIsConnected(true);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Holdings: WebSocket disconnected:', reason);
      setIsConnected(false);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Holdings: WebSocket connection error:', error);
      setIsConnected(false);
    });
    
    // Listen for stock updates (individual updates)
    socket.on('stockUpdate', (stock) => {
      const holdingStock = allHoldings.find(h => h.name === stock.symbol || h.name === stock.name);
      if (holdingStock) {
        // Use smooth update function
        updatePricesSmoothly(holdingStock.name, stock.price);
      }
    });
    
    // Listen for bulk updates (smoother batch processing)
    socket.on('bulkStockUpdate', (stocks) => {
      // Process bulk updates with staggered timing to avoid jarring changes
      stocks.forEach((stock, index) => {
        const holdingStock = allHoldings.find(h => h.name === stock.symbol || h.name === stock.name);
        if (holdingStock) {
          // Stagger updates by 100ms each for smoother bulk updates
          setTimeout(() => {
            updatePricesSmoothly(holdingStock.name, stock.price);
          }, index * 100);
        }
      });
    });
    
    // Request initial data
    setTimeout(() => {
      socket.emit('requestStockUpdate');
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      
      // Clear all price update timeouts
      Object.values(priceUpdateTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      priceUpdateTimeoutRef.current = {};
      
      if (smoothUpdateIntervalRef.current) {
        clearInterval(smoothUpdateIntervalRef.current);
      }
    };
  }, [allHoldings, realTimePrices]);

  // Show loading message while fetching holdings
  if (holdingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show message when no holdings are found
  if (!allHoldings || allHoldings.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        textAlign: 'center'
      }}>
        <h3 className="title">Holdings (0)</h3>
        <p style={{ fontSize: '16px', color: '#666', marginTop: '20px' }}>
          You don't have any holdings yet.
        </p>
        <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
          Start trading to see your holdings here.
        </p>
      </div>
    );
  }

  // Function to handle stock navigation
  const handleStockClick = (stock) => {
    // Set the selected stock in context for the detail page
    const stockData = {
      symbol: stock.name,
      name: stock.name,
      price: realTimePrices[stock.name] || stock.price,
      percent: 0, // Calculate if needed
      volume: 'N/A',
      previousClose: stock.price,
      marketCap: null
    };
    
    setSelectedStock(stockData);
    navigate(`/stock/${stock.name}`);
  };

  // Calculate total portfolio value using real-time prices
  const totalPortfolioValue = allHoldings.reduce((sum, stock) => {
    const currentPrice = realTimePrices[stock.name] || stock.price;
    return sum + currentPrice * stock.qty;
  }, 0);

  // Dummy sparkline data (replace with real price history if available)
  const getSparklineData = (stock) => {
    // If you have price history, use it here. For now, use random walk for demo.
    const base = stock.price;
    let arr = [base];
    for (let i = 1; i < 10; i++) {
      arr.push(arr[i-1] + (Math.random() - 0.5) * base * 0.01);
    }
    return arr;
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      {usingFallbackData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Using Demo Data
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Backend server is not running. Showing demo holdings data. 
                  Start the backend with: <code className="bg-yellow-100 px-1 rounded">cd backend && npm start</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h3 className="title" style={{ marginBottom: 0 }}>Holdings ({allHoldings.length})</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`} style={{
            animation: isConnected ? 'gentle-pulse 3s ease-in-out infinite' : 'none'
          }}></div>
          <span className={`text-sm transition-colors duration-500 ${
            isConnected ? 'text-green-600' : 'text-gray-500'
          }`}>
            {isConnected ? 'Live Market' : 'Offline'}
          </span>
          {lastUpdateTime && isConnected && (
            <span className="text-xs text-gray-400">
              Updated {lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #0001', padding: 24, marginBottom: 32 }}>
        <div className="order-table" style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Avg. Buy</th>
                <th>LTP</th>
                <th>Current Value</th>
                <th>P&L (₹)</th>
                <th>P&L (%)</th>
                <th>Trend</th>
                <th>Sell</th>
              </tr>
            </thead>
            <tbody>
              {allHoldings.map((stock, index) => {
                // Use real-time price if available, otherwise use stored price
                const currentPrice = realTimePrices[stock.name] || stock.price;
                const curValue = currentPrice * stock.qty;
                const profit = curValue - stock.avg * stock.qty;
                const profitPercent = stock.avg > 0 ? (profit / (stock.avg * stock.qty)) * 100 : 0;
                const profClass = profit >= 0 ? "profit" : "loss";
                const priceChange = priceChanges[stock.name];
                
                return (
                  <tr 
                    key={index}
                    className="holdings-row cursor-pointer"
                    onClick={() => handleStockClick(stock)}
                  >
                    <td>
                      <div className="flex items-center space-x-2">
                        <span className="stock-link-text font-semibold text-blue-600 hover:text-blue-800">
                          {stock.name}
                        </span>
                        {priceChange && (
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
                            priceChange === 'up' ? 'bg-green-400' : 'bg-red-400'
                          }`} style={{
                            animation: 'subtle-pulse 2s ease-in-out infinite'
                          }}></div>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-medium">{stock.qty}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="text-gray-600">₹{stock.avg.toFixed(2)}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={`font-semibold transition-all duration-1000 ease-out ${
                        priceChange === 'up' ? 'text-green-700' : 
                        priceChange === 'down' ? 'text-red-700' : 
                        'text-gray-900'
                      }`} style={{
                        backgroundColor: priceChange === 'up' ? 'rgba(34, 197, 94, 0.08)' : 
                                        priceChange === 'down' ? 'rgba(239, 68, 68, 0.08)' : 
                                        'transparent',
                        padding: priceChange ? '4px 8px' : '0',
                        borderRadius: priceChange ? '6px' : '0',
                        transform: priceChange ? 'scale(1.02)' : 'scale(1)',
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}>
                        ₹{currentPrice.toFixed(2)}
                        {isConnected && (
                          <span className="ml-1 text-xs opacity-60" style={{
                            color: '#10b981',
                            fontSize: '8px'
                          }}>●</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-medium">₹{curValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </td>
                    <td style={{ textAlign: 'right', color: profit >= 0 ? '#2ecc40' : '#e74c3c', fontWeight: 600 }}>
                      {profit >= 0 ? '+' : ''}₹{profit.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', color: profitPercent >= 0 ? '#2ecc40' : '#e74c3c', fontWeight: 600 }}>
                      {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Sparklines data={getSparklineData(stock)} width={60} height={20} margin={4}>
                        <SparklinesLine color={profit >= 0 ? '#2ecc40' : '#e74c3c'} style={{ fill: "none" }} />
                      </Sparklines>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-red sell-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click when selling
                          openSellWindow({
                            ...stock,
                            price: currentPrice // Use current real-time price for selling
                          });
                        }}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>
            Total Portfolio Value: <span style={{ color: '#007bff' }}>₹{totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      {/* Real-time Portfolio Summary */}
      <div className="row" style={{ marginTop: 32 }}>
        <div className="col">
          <h5>
            {(() => {
              const totalInvestment = allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
              const [whole, decimal] = totalInvestment.toFixed(2).split('.');
              return (
                <>
                  {Number(whole).toLocaleString()}.<span>{decimal}</span>
                </>
              );
            })()} 
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {(() => {
              const [whole, decimal] = totalPortfolioValue.toFixed(2).split('.');
              return (
                <>
                  {Number(whole).toLocaleString()}.<span>{decimal}</span>
                </>
              );
            })()} 
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 style={{ 
            color: (() => {
              const totalInvestment = allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
              const totalPnL = totalPortfolioValue - totalInvestment;
              return totalPnL >= 0 ? '#2ecc40' : '#e74c3c';
            })()
          }}>
            {(() => {
              const totalInvestment = allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
              const totalPnL = totalPortfolioValue - totalInvestment;
              const totalPnLPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
              return `${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} (${totalPnLPercent >= 0 ? '+' : ''}${totalPnLPercent.toFixed(2)}%)`;
            })()} 
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={{
        labels: allHoldings.map((stock) => stock.name),
        datasets: [
          {
            label: "Stock Price (Live)",
            data: allHoldings.map((stock) => realTimePrices[stock.name] || stock.price),
            backgroundColor: allHoldings.map((stock) => {
              const currentPrice = realTimePrices[stock.name] || stock.price;
              const profit = (currentPrice - stock.avg) * stock.qty;
              return profit >= 0 ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)";
            }),
            borderColor: allHoldings.map((stock) => {
              const currentPrice = realTimePrices[stock.name] || stock.price;
              const profit = (currentPrice - stock.avg) * stock.qty;
              return profit >= 0 ? "rgba(34, 197, 94, 1)" : "rgba(239, 68, 68, 1)";
            }),
            borderWidth: 2,
          },
        ],
      }} />
    </div>
  );
};

export default Holdings;
