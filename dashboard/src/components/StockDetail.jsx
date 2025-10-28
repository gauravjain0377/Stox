import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Minus, Wifi, WifiOff } from 'lucide-react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { useGeneralContext } from './GeneralContext';
import StockInfoTabs from './StockInfoTabs';
import TradeConfirmModal from './TradeConfirmModal';
import TradeNotification from './TradeNotification';
import { stockService } from '../services/stockService';
import { io } from 'socket.io-client';
import { WS_URL, getApiUrl } from '../config/api';
import LightweightStockChart from './LightweightStockChart';
import { shouldShowLiveStatus } from '../lib/utils';

// Simple seeded pseudo-random generator
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getSeedFromSymbol(symbol) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

  // Generate realistic chart data based on range
  const generateChartData = (range, basePrice, symbol, percent) => {
    const now = new Date();
    const data = [];
    let points = 0;
    const seed = getSeedFromSymbol(symbol || "");
    const rand = (i) => seededRandom(seed + i);
    
    switch (range) {
      case '1D':
        points = 390; // Market hours: 9:15 AM to 3:30 PM = 375 minutes
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setHours(9, 15, 0, 0);
          date.setMinutes(date.getMinutes() + i);
          
          const volatility = 0.001;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          
          data.push({
            time: Math.floor(date.getTime() / 1000),
            value: Number(value.toFixed(2))
          });
        }
        break;
        
      case '1W':
        points = 7;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          date.setHours(15, 30, 0, 0);
          
          const volatility = 0.015;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          
          data.push({
            time: date.toISOString().split('T')[0],
            value: Number(value.toFixed(2))
          });
        }
        break;
        
      case '1M':
        points = 30;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - (29 - i));
          
          const volatility = 0.02;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          
          data.push({
            time: date.toISOString().split('T')[0],
            value: Number(value.toFixed(2))
          });
        }
        break;
        
      case '1Y':
        points = 252; // Trading days in a year
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - (251 - i));
          
          const volatility = 0.03;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          
          data.push({
            time: date.toISOString().split('T')[0],
            value: Number(value.toFixed(2))
          });
        }
        break;
        
      case '5Y':
        points = 60; // Monthly data points
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (59 - i));
          
          const volatility = 0.1;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          
          data.push({
            time: date.toISOString().split('T')[0],
            value: Number(value.toFixed(2))
          });
        }
        break;
        
      default:
        points = 100;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (99 - i));
          
          const volatility = 0.15;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          
          data.push({
            time: date.toISOString().split('T')[0],
            value: Number(value.toFixed(2))
          });
        }
    }
    
    return data;
  };
  
  // Generate candlestick data
  const generateCandlestickData = (range, basePrice, symbol, percent) => {
    const now = new Date();
    const data = [];
    let points = 0;
    const seed = getSeedFromSymbol(symbol || "");
    const rand = (i) => seededRandom(seed + i);
    
    switch (range) {
      case '1W': points = 7; break;
      case '1M': points = 30; break;
      case '1Y': points = 252; break;
      case '5Y': points = 60; break;
      default: points = 30;
    }
    
    let prevClose = basePrice;
    
    for (let i = 0; i < points; i++) {
      const date = new Date(now);
      
      if (range === '1W') {
        date.setDate(now.getDate() - (points - i - 1));
      } else if (range === '1M' || range === '1Y') {
        date.setDate(now.getDate() - (points - i - 1));
      } else {
        date.setMonth(now.getMonth() - (points - i - 1));
      }
      
      const open = prevClose;
      const volatility = 0.02;
      const trend = (percent / 100) * (i / points) * basePrice;
      const close = open + trend + (rand(i) - 0.5) * 2 * open * volatility;
      const high = Math.max(open, close) * (1 + rand(i + 1) * 0.01);
      const low = Math.min(open, close) * (1 - rand(i + 2) * 0.01);
      
      data.push({
        time: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2))
      });
      
      prevClose = close;
    }
    
    return data;
  };

const StockDetail = () => {
  const { selectedStock, setSelectedStock, refreshHoldings, refreshOrders, holdings } = useGeneralContext();
  const { symbol: symbolParam } = useParams();
  const navigate = useNavigate();
  const [tradeAlert, setTradeAlert] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTradeType, setPendingTradeType] = useState(null);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  const [tradeNotification, setTradeNotification] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const socketRef = useRef(null);
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  
  // WebSocket connection setup for real-time updates
  useEffect(() => {
    console.log('StockDetail: Setting up WebSocket connection for', symbolParam);
    
    // Initialize socket connection
    socketRef.current = io(WS_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('StockDetail: WebSocket connected');
      setIsConnected(true);
      setConnectionStatus('connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('StockDetail: WebSocket disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('StockDetail: WebSocket connection error:', error);
      setConnectionStatus('error');
    });

    // Listen for stock updates
    socket.on('stockUpdate', (stock) => {
      if (stock.symbol === symbolParam) {
        console.log('StockDetail: Received update for', stock.symbol);
        
        // Show price change animation
        const currentPrice = stockData?.price;
        const newPrice = stock.price;
        if (currentPrice && newPrice !== currentPrice) {
          setPriceChange(newPrice > currentPrice ? 'up' : 'down');
          
          // Clear animation after 2 seconds
          setTimeout(() => {
            setPriceChange(null);
          }, 2000);
        }
        
        // Update stock data
        const updatedStock = {
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          percent: stock.percentChange,
          volume: stock.volume ? stock.volume.toLocaleString() : '-',
          previousClose: stock.previousClose,
          marketCap: stock.marketCap,
          lastUpdate: stock.lastUpdate
        };
        
        setStockData(updatedStock);
        setSelectedStock(updatedStock);
        setLastUpdateTime(new Date());
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [symbolParam, stockData?.price, setSelectedStock]);

  // Fetch stock data if not available in context
  useEffect(() => {
    const fetchStockData = async () => {
      console.log('StockDetail: Fetching stock data', { selectedStock, symbolParam });
      if (!selectedStock && symbolParam) {
        setLoading(true);
        try {
          // Fetch stock data from the service
          const stocks = await stockService.getAllStocksWithData();
          console.log('StockDetail: Fetched stocks', stocks.length);
          const stock = stocks.find(s => s.symbol === symbolParam);
          console.log('StockDetail: Found stock', stock);
          if (stock) {
            setStockData(stock);
            setSelectedStock(stock);
          } else {
            // If not found in service, create a fallback stock object
            const fallbackStock = {
              symbol: symbolParam,
              name: `${symbolParam} Ltd`,
              price: 1000,
              change: 0,
              percent: 0,
              volume: "1M",
              marketCap: "1T"
            };
            console.log('StockDetail: Using fallback stock', fallbackStock);
            setStockData(fallbackStock);
            setSelectedStock(fallbackStock);
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
          // Create fallback stock object
          const fallbackStock = {
            symbol: symbolParam,
            name: `${symbolParam} Ltd`,
            price: 1000,
            change: 0,
            percent: 0,
            volume: "1M",
            marketCap: "1T"
          };
          setStockData(fallbackStock);
          setSelectedStock(fallbackStock);
        } finally {
          setLoading(false);
        }
      } else if (selectedStock) {
        console.log('StockDetail: Using selectedStock from context', selectedStock);
        setStockData(selectedStock);
      }
    };

    fetchStockData();
  }, [selectedStock, symbolParam, setSelectedStock]);

  // Use stockData instead of selectedStock for rendering
  const currentStock = stockData || selectedStock;

  // Time range options
  const timeRanges = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '1Y', value: '1Y' },
    { label: '5Y', value: '5Y' },
    { label: 'All', value: 'All' },
  ];
  const [selectedRange, setSelectedRange] = useState('1D');
  const [chartType, setChartType] = useState('area'); // 'area' or 'candlestick'

  // Show trade confirmation modal
  const handleTradeClick = (type) => {
    // Validation
    if (!quantity || quantity <= 0) {
      setTradeAlert('Please enter a valid quantity (greater than 0)');
      setTimeout(() => setTradeAlert(null), 3000);
      return;
    }
    
    if (!realPrice || realPrice <= 0) {
      setTradeAlert('Stock price is not available. Please try again later.');
      setTimeout(() => setTradeAlert(null), 3000);
      return;
    }
    
    // For sell orders, check if user has enough shares
    if (type === 'sell') {
      // We'll proceed with the trade and let the backend handle validation
      // The confirmation modal will show the current quantity being sold
      // and the backend will validate if the user has enough shares
    }
    
    setPendingTradeType(type);
    setShowConfirmModal(true);
  };

  // Execute the actual trade after confirmation
  const executeTradeOrder = async (adjustedQuantity) => {
    if (!pendingTradeType) return;
    
    setIsProcessingTrade(true);
    setShowConfirmModal(false);
    
    // Use the adjusted quantity from the confirmation modal if provided
    const finalQuantity = adjustedQuantity || quantity;
    
    try {
      setTradeAlert('Processing your order...');
      
      const endpoint = pendingTradeType === 'buy' ? '/api/orders/buy' : '/api/orders/sell';
      
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
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          symbol: currentStock.symbol,
          name: currentStock.name,
          quantity: finalQuantity,
          price: currentStock.price
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const message = `Successfully ${pendingTradeType === 'buy' ? 'bought' : 'sold'} ${finalQuantity} shares of ${currentStock.symbol}!`;
        setTradeNotification({
          message,
          type: 'success'
        });
        // Clear the processing message immediately
        setTradeAlert(null);
        
        // Refresh holdings and orders data
        refreshHoldings && refreshHoldings();
        refreshOrders && refreshOrders();
        
        // Reset quantity to 1 after successful trade
        setQuantity(1);
      } else {
        setTradeNotification({
          message: `Error: ${data.message || 'Failed to place order'}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error(`Error executing ${pendingTradeType} trade:`, error);
      setTradeNotification({
        message: `Error: Failed to place ${pendingTradeType} order. Please try again.`,
        type: 'error'
      });
    } finally {
      setIsProcessingTrade(false);
      setPendingTradeType(null);
    }
  };
  
  // Cancel trade confirmation
  const cancelTrade = () => {
    setShowConfirmModal(false);
    setPendingTradeType(null);
  };

  if (!currentStock) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stock data...</p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Stock Selected</h2>
            <p className="text-gray-600 mb-4">Please select a stock to view its details.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go back
            </button>
          </div>
        )}
      </div>
    );
  }

  const price = currentStock.price;
  const name = currentStock.name;
  const symbol = currentStock.symbol;
  const percent = currentStock.percent;



  // Use real-time price, previousClose, and percentChange from currentStock (as in sidebar)
  const realPrice = currentStock?.price;
  const realPrevClose = currentStock?.previousClose;
  const realPercent = currentStock?.percent;
  const realAbsChange = (typeof realPrice === 'number' && typeof realPrevClose === 'number') ? realPrice - realPrevClose : 0;
  const realIsDown = realPercent < 0;
  const realFormattedPercent = typeof realPercent === 'number' ? Math.abs(realPercent).toFixed(2) : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      {tradeNotification && (
        <TradeNotification
          message={tradeNotification.message}
          type={tradeNotification.type}
          onClose={() => setTradeNotification(null)}
        />
      )}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                &#8592;
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{name}</h1>
                    <p className="text-sm text-gray-500">{symbol}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <Wifi size={16} className="text-green-500" title="Real-time connection active" />
                    ) : (
                      <WifiOff size={16} className="text-red-500" title="Connection lost" />
                    )}
                    {lastUpdateTime && shouldShowLiveStatus() && (
                      <span className="text-xs text-gray-500">
                        Live • {lastUpdateTime.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className={`transition-all duration-300 ${priceChange === 'up' ? 'price-up' : priceChange === 'down' ? 'price-down' : ''}`}>
                    <h2 className="text-3xl font-bold text-gray-900">₹{realPrice ? realPrice.toLocaleString() : 'N/A'}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`flex items-center gap-1 text-lg font-semibold ${realIsDown ? 'text-red-600' : 'text-green-600'}`}
                        title={`${realIsDown ? 'Loss' : 'Profit'}: ${realAbsChange < 0 ? '' : '+'}${realAbsChange.toFixed(2)} (${realFormattedPercent}%)`}>
                        {realIsDown ? <TrendingDown size={18}/> : <TrendingUp size={18}/>}
                        {realAbsChange < 0 ? '' : '+'}{realAbsChange.toFixed(2)}
                        <span>({realFormattedPercent}%)</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs">Live</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs">Offline</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex gap-2 mb-4">
                  {timeRanges.map((r) => (
                    <button
                      key={r.value}
                      className={`px-3 py-1 rounded ${selectedRange === r.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setSelectedRange(r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {/* Professional Chart using Lightweight Charts or Candlestick based on selection */}
                <LightweightStockChart
                  symbol={currentStock?.symbol || ''}
                  price={currentStock?.price || 0}
                  percent={currentStock?.percent || 0}
                  range={selectedRange}
                  realTimePrice={realPrice}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <StockInfoTabs symbol={symbol + '.BSE'} />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade</h3>
              {tradeAlert && <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">{tradeAlert}</div>}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter quantity" />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Current Price</span>
                  <span className="font-semibold">₹{realPrice ? realPrice.toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Total Cost</span>
                  <span className="font-semibold">₹{realPrice && quantity ? (realPrice * quantity).toLocaleString() : '0'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={() => handleTradeClick('buy')}
                    disabled={isProcessingTrade}
                  >
                    <span>Buy</span>
                  </button>
                  <button 
                    className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={() => handleTradeClick('sell')}
                    disabled={isProcessingTrade}
                  >
                    <span>Sell</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Market Stats</h3>
                {isConnected && shouldShowLiveStatus() ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">Live</span>
                  </div>
                ) : isConnected ? (
                  <div className="flex items-center gap-1 text-gray-600">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span className="text-xs">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs">Offline</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Previous Close</span>
                  <span className="font-semibold">
                    {currentStock?.previousClose ? `₹${currentStock.previousClose.toLocaleString()}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-semibold">
                    {currentStock?.price ? `₹${currentStock.price.toLocaleString()}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Change</span>
                  <span className={`font-semibold ${realIsDown ? 'text-red-600' : 'text-green-600'}`}>
                    {realAbsChange !== 0 ? `${realAbsChange < 0 ? '' : '+'}${realAbsChange.toFixed(2)}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Change %</span>
                  <span className={`font-semibold ${realIsDown ? 'text-red-600' : 'text-green-600'}`}>
                    {realFormattedPercent !== 'N/A' ? `${realFormattedPercent}%` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lower Circuit</span>
                  <span className="font-semibold text-red-600">
                    {currentStock?.lowerCircuit ? `₹${currentStock.lowerCircuit.toLocaleString('en-IN', {maximumFractionDigits: 2})}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Upper Circuit</span>
                  <span className="font-semibold text-green-600">
                    {currentStock?.upperCircuit ? `₹${currentStock.upperCircuit.toLocaleString('en-IN', {maximumFractionDigits: 2})}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Volume</span>
                  <span className="font-semibold">
                    {currentStock?.volume || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Market Cap</span>
                  <span className="font-semibold">
                    {currentStock?.marketCap ? `₹${(currentStock.marketCap / 1000000000000).toFixed(2)}T` : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Unified Trade Confirmation Modal */}
      <TradeConfirmModal
        isOpen={showConfirmModal}
        type={pendingTradeType === 'buy' ? 'buy' : 'sell'}
        name={currentStock?.name}
        symbol={currentStock?.symbol}
        price={realPrice}
        quantity={quantity}
        isConnected={isConnected}
        changeAbs={realAbsChange}
        changePercent={realFormattedPercent === 'N/A' ? undefined : Number(realFormattedPercent)}
        isDown={realIsDown}
        processing={isProcessingTrade}
        onCancel={cancelTrade}
        onConfirm={executeTradeOrder}
        currentShares={(() => {
          // Find the holding that matches the current stock name
          const holding = holdings.find(h => h.name === currentStock?.name);
          
          // Return the quantity if found, otherwise 0
          return holding?.qty || 0;
        })()}
      />
    </div>
  );
};

export default StockDetail;