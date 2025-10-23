import React, { useState, useEffect, useRef } from "react";
import { useGeneralContext } from "./GeneralContext";
import { VerticalGraph } from "./VerticalGraph";
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import TradeConfirmModal from "./TradeConfirmModal";
import { WS_URL, getApiUrl } from '../config/api';
import '../styles/Holdings.css';

const Holdings = () => {
  const { holdings: allHoldings, holdingsLoading, openSellWindow, usingFallbackData, setSelectedStock, refreshHoldings, refreshOrders } = useGeneralContext();
  const navigate = useNavigate();
  const [realTimePrices, setRealTimePrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const socketRef = useRef(null);
  const priceUpdateTimeoutRef = useRef({});
  const smoothUpdateIntervalRef = useRef(null);
  
  // Trade confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStock, setSelectedSellStock] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  
  // Function for smooth price transitions with better stability
  const updatePricesSmoothly = (stockName, newPrice) => {
    const currentPrice = realTimePrices[stockName];
    
    // Only update if price actually changed significantly (avoid micro-fluctuations)
    // Increase threshold to 0.50 (50 paise) for more stability
    if (currentPrice && Math.abs(newPrice - currentPrice) < 0.50) {
      return; // Skip tiny changes
    }
    
    // Clear any existing timeout for this stock
    if (priceUpdateTimeoutRef.current[stockName]) {
      clearTimeout(priceUpdateTimeoutRef.current[stockName]);
    }
    
    // Smooth transition with longer debouncing for stability
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
        
        // Remove change indicator after 5 seconds (longer for smoother feel)
        setTimeout(() => {
          setPriceChanges(prev => {
            const updated = { ...prev };
            delete updated[stockName];
            return updated;
          });
        }, 5000);
      }
      
      setLastUpdateTime(new Date());
    }, 2000); // 2000ms (2 seconds) delay for much smoother updates
  };
  
  // WebSocket connection for real-time price updates
  useEffect(() => {
    if (!allHoldings || allHoldings.length === 0) return;
    
    console.log('Holdings: Setting up WebSocket connection for real-time prices');
    
    // Initialize socket connection
    socketRef.current = io(WS_URL, {
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
      // Process bulk updates with longer staggered timing to avoid jarring changes
      stocks.forEach((stock, index) => {
        const holdingStock = allHoldings.find(h => h.name === stock.symbol || h.name === stock.name);
        if (holdingStock) {
          // Stagger updates by 500ms each for much smoother bulk updates
          setTimeout(() => {
            updatePricesSmoothly(holdingStock.name, stock.price);
          }, index * 500);
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



  return (
    <>
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
                        <button 
                          className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click when selling
                            setSelectedSellStock({
                              ...stock,
                              price: currentPrice, // Use current real-time price for selling
                              symbol: stock.name
                            });
                            setSellQuantity(1); // Default to 1 share
                            setShowConfirmModal(true);
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
      
      {/* Trade Confirmation Modal */}
      <TradeConfirmModal
        isOpen={showConfirmModal}
        type="sell"
        name={selectedStock?.name}
        symbol={selectedStock?.symbol || selectedStock?.name}
        price={selectedStock?.price}
        quantity={sellQuantity}
        isConnected={isConnected}
        processing={isProcessingTrade}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={async (adjustedQuantity) => {
          try {
            setIsProcessingTrade(true);
            
            // Get authentication data
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            const headers = {
              'Content-Type': 'application/json',
            };
            
            // Add authentication headers
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }
            if (userData) {
              headers['x-user-data'] = encodeURIComponent(userData);
            }
            
            // Use the adjusted quantity if provided
            const finalQuantity = adjustedQuantity || sellQuantity;
            
            const response = await fetch(getApiUrl('/api/orders/sell'), {
              method: 'POST',
              headers,
              body: JSON.stringify({
                symbol: selectedStock.name,
                name: selectedStock.name,
                quantity: finalQuantity,
                price: selectedStock.price
              }),
              credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success) {
              // Refresh holdings and orders data
              refreshHoldings && refreshHoldings();
              refreshOrders && refreshOrders();
            } else {
              console.error('Error executing sell trade:', data.message);
            }
          } catch (error) {
            console.error('Error executing sell trade:', error);
          } finally {
            setIsProcessingTrade(false);
            setShowConfirmModal(false);
          }
        }}
        currentShares={selectedStock?.qty || 0}
      />
    </>
  );
};

export default Holdings;
