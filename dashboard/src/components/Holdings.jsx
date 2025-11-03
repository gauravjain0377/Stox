import React, { useState, useEffect } from "react";
import { useGeneralContext } from "./GeneralContext";
import { VerticalGraph } from "./VerticalGraph";
import { Link, useNavigate } from 'react-router-dom';
import TradeConfirmModal from "./TradeConfirmModal";
import TradeNotification from "./TradeNotification";
import { getApiUrl } from '../config/api';
import '../styles/Holdings.css';

const Holdings = () => {
  const { holdings: allHoldings, holdingsLoading, openSellWindow, usingFallbackData, setSelectedStock, refreshHoldings, refreshOrders, realTimePrices, isSocketConnected } = useGeneralContext();
  const navigate = useNavigate();
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // Trade confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStock, setSelectedSellStock] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  
  // Trade notification state
  const [tradeNotification, setTradeNotification] = useState(null);
  
  // Update time when real-time prices change
  useEffect(() => {
    if (realTimePrices && Object.keys(realTimePrices).length > 0) {
      setLastUpdateTime(new Date());
    }
  }, [realTimePrices]);

  // Toggle row expansion for mobile view
  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

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
      price: stock.currentPrice || stock.price, // Use precomputed current price
      percent: stock.profitPercent || 0,
      volume: 'N/A',
      previousClose: stock.avg,
      marketCap: null
    };
    
    setSelectedStock(stockData);
    navigate(`/stock/${stock.name}`);
  };

  // Calculate total portfolio value using precomputed values
  const totalPortfolioValue = allHoldings.reduce((sum, stock) => {
    return sum + (stock.curValue || (stock.currentPrice || stock.price) * stock.qty);
  }, 0);

  return (
    <>
      {tradeNotification && (
        <TradeNotification
          message={tradeNotification.message}
          type={tradeNotification.type}
          onClose={() => setTradeNotification(null)}
        />
      )}
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6" style={{ 
        maxWidth: 1100, 
        margin: '0 auto', 
        padding: '1rem',
        boxSizing: 'border-box',
        width: '100%'
      }}>
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
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Holdings</h1>
          <p className="text-sm sm:text-base text-gray-600">Your current stock holdings ({allHoldings.length})</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #0001', padding: '1rem', marginBottom: '1.5rem', boxSizing: 'border-box', width: '100%' }}>
          {/* Mobile-friendly card view for holdings */}
          <div className="md:hidden space-y-4">
            {allHoldings.map((stock, index) => {
              // Use precomputed values from context (instant, no calculation needed)
              const currentPrice = stock.currentPrice || stock.price;
              const curValue = stock.curValue || (currentPrice * stock.qty);
              const profit = stock.profit !== undefined ? stock.profit : (curValue - stock.avg * stock.qty);
              const profitPercent = stock.profitPercent !== undefined ? stock.profitPercent : (stock.avg > 0 ? (profit / (stock.avg * stock.qty)) * 100 : 0);
              const isExpanded = expandedRows.has(index);
              
              return (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  {/* Main row with essential info */}
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleRowExpansion(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-blue-600">{stock.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{currentPrice.toFixed(2)}</div>
                      <div className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-500">Quantity</div>
                          <div className="font-medium">{stock.qty}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Avg. Buy</div>
                          <div className="font-medium">₹{stock.avg.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Current Value</div>
                          <div className="font-medium">₹{curValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">P&L</div>
                          <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {profit >= 0 ? '+' : ''}₹{profit.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button 
                          className="w-full py-2 px-4 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row expansion toggle
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
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Desktop table view */}
          <div className="hidden md:block">
            <div className="order-table" style={{ overflowX: 'auto' }}>
              <table className="premium-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>Symbol</th>
                    <th style={{ width: '10%', textAlign: 'right' }}>Qty</th>
                    <th style={{ width: '15%', textAlign: 'right' }}>Avg. Buy</th>
                    <th style={{ width: '15%', textAlign: 'right' }}>LTP</th>
                    <th style={{ width: '15%', textAlign: 'right' }}>Current Value</th>
                    <th style={{ width: '10%', textAlign: 'right' }}>P&L (₹)</th>
                    <th style={{ width: '10%', textAlign: 'right' }}>P&L (%)</th>
                    <th style={{ width: '5%', textAlign: 'center' }}>Sell</th>
                  </tr>
                </thead>
                <tbody>
                  {allHoldings.map((stock, index) => {
                    // Use precomputed values from context (instant, no calculation needed)
                    const currentPrice = stock.currentPrice || stock.price;
                    const curValue = stock.curValue || (currentPrice * stock.qty);
                    const profit = stock.profit !== undefined ? stock.profit : (curValue - stock.avg * stock.qty);
                    const profitPercent = stock.profitPercent !== undefined ? stock.profitPercent : (stock.avg > 0 ? (profit / (stock.avg * stock.qty)) * 100 : 0);
                    const profClass = profit >= 0 ? "profit" : "loss";
                    
                    return (
                      <tr 
                        key={index}
                        className="holdings-row cursor-pointer"
                        onClick={() => handleStockClick(stock)}
                      >
                        <td style={{ width: '20%' }}>
                          <div className="flex items-center space-x-2">
                            <span className="stock-link-text font-semibold text-blue-600 hover:text-blue-800">
                              {stock.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ width: '10%', textAlign: 'right' }}>
                          <span className="font-medium">{stock.qty}</span>
                        </td>
                        <td style={{ width: '15%', textAlign: 'right' }}>
                          <span className="text-gray-600">₹{stock.avg.toFixed(2)}</span>
                        </td>
                        <td style={{ width: '15%', textAlign: 'right' }}>
                          <div className="font-semibold text-gray-900">
                            ₹{currentPrice.toFixed(2)}
                            {isSocketConnected && (
                              <span className="ml-1 text-xs opacity-60" style={{
                                color: '#10b981',
                                fontSize: '8px'
                              }}>●</span>
                            )}
                          </div>
                        </td>
                        <td style={{ width: '15%', textAlign: 'right' }}>
                          <span className="font-medium">₹{curValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </td>
                        <td style={{ width: '10%', textAlign: 'right', color: profit >= 0 ? '#2ecc40' : '#e74c3c', fontWeight: 600 }}>
                          {profit >= 0 ? '+' : ''}₹{profit.toFixed(2)}
                        </td>
                        <td style={{ width: '10%', textAlign: 'right', color: profitPercent >= 0 ? '#2ecc40' : '#e74c3c', fontWeight: 600 }}>
                          {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                        </td>
                        <td style={{ width: '5%', textAlign: 'center' }}>
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
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>
              Total Portfolio Value: <span style={{ color: '#007bff' }}>₹{totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        {/* Real-time Portfolio Summary */}
        <div className="row" style={{ marginTop: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
          <div className="col" style={{ flexBasis: 'calc(33.333% - 0.5rem)', textAlign: 'center' }}>
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
          <div className="col" style={{ flexBasis: 'calc(33.333% - 0.5rem)', textAlign: 'center' }}>
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
          <div className="col" style={{ flexBasis: 'calc(33.333% - 0.5rem)', textAlign: 'center' }}>
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
        <div className="w-full mt-8">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="holdings-chart-container" style={{ height: '450px', position: 'relative' }}>
              <VerticalGraph data={{
                labels: allHoldings.map((stock) => stock.name),
                datasets: [
                  {
                    label: "Stock Price (Live)",
                    data: allHoldings.map((stock) => stock.currentPrice || stock.price),
                    backgroundColor: allHoldings.map((stock) => {
                      const profit = stock.profit !== undefined ? stock.profit : ((stock.currentPrice || stock.price) - stock.avg) * stock.qty;
                      return profit >= 0 ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)";
                    }),
                    borderColor: allHoldings.map((stock) => {
                      const profit = stock.profit !== undefined ? stock.profit : ((stock.currentPrice || stock.price) - stock.avg) * stock.qty;
                      return profit >= 0 ? "rgba(34, 197, 94, 1)" : "rgba(239, 68, 68, 1)";
                    }),
                    borderWidth: 2,
                  },
                ],
              }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Trade Confirmation Modal */}
      <TradeConfirmModal
        isOpen={showConfirmModal}
        type="sell"
        name={selectedStock?.name}
        symbol={selectedStock?.symbol || selectedStock?.name}
        price={selectedStock?.price}
        quantity={sellQuantity}
        isConnected={isSocketConnected}
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
              // Show success notification
              setTradeNotification({
                message: `Successfully sold ${finalQuantity} shares of ${selectedStock.name}!`,
                type: 'success'
              });
              
              // Refresh holdings and orders data
              refreshHoldings && refreshHoldings();
              refreshOrders && refreshOrders();
            } else {
              // Show error notification
              setTradeNotification({
                message: `Error: ${data.message || 'Failed to execute sell order'}`,
                type: 'error'
              });
              console.error('Error executing sell trade:', data.message);
            }
          } catch (error) {
            // Show error notification
            setTradeNotification({
              message: `Error: Failed to execute sell order. Please try again.`,
              type: 'error'
            });
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