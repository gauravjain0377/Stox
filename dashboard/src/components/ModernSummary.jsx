import React, { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Eye,
  ArrowRight,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeneralContext } from "./GeneralContext";
import { stockService } from "../services/stockService";
import { io } from 'socket.io-client';
import { WS_URL } from '../config/api';

const ModernSummary = () => {
  const { holdings = [], realTimePrices = {}, isSocketConnected, user } = useGeneralContext();
  const [mostTraded, setMostTraded] = useState([]);
  const [watchlistSummary, setWatchlistSummary] = useState({ count: 0, items: [], totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Calculate summary values using the same logic as Holdings page
  // Total Investment: sum of (avg price * quantity) for all holdings
  const totalInvestment = holdings.reduce((sum, h) => sum + (h.avg || 0) * (h.qty || 0), 0);
  
  // Current Value: sum of (current price * quantity) for all holdings
  const currentValue = holdings.reduce((sum, h) => {
    const currentPrice = realTimePrices[h.name] || h.price || 0;
    return sum + currentPrice * (h.qty || 0);
  }, 0);
  
  // P&L calculations
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;

  // Fetch most traded stocks and watchlist summary
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = user?.id || user?.username || 'default';

        const stocks = await stockService.getMostTradedStocks();
        
        // Try to get watchlist summary, fallback if it fails
        let watchlist;
        try {
          watchlist = await stockService.getWatchlistSummary(userId);
        } catch (watchlistError) {
          console.error("Error getting watchlist summary:", watchlistError);
          watchlist = {
            count: 0,
            items: [],
            totalItems: 0,
            watchlists: []
          };
        }
        setMostTraded(stocks);
        setWatchlistSummary(watchlist);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to default stocks and empty watchlist
        setMostTraded([
          { symbol: "TCS", name: "Tata Consultancy Services Ltd.", price: 3194.80, change: -8.20, percent: -0.25, volume: "1.8M", marketCap: "11.7T" },
          { symbol: "RELIANCE", name: "Reliance Industries Ltd.", price: 2745.30, change: 11.50, percent: 0.42, volume: "3.2M", marketCap: "18.3T" },
          { symbol: "INFY", name: "Infosys Ltd.", price: 1567.90, change: -18.25, percent: -1.15, volume: "2.1M", marketCap: "6.7T" },
          { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1578.40, change: 11.75, percent: 0.75, volume: "2.9M", marketCap: "11.9T" }
        ]);
        setWatchlistSummary({
          count: 0,
          items: [],
          totalItems: 0,
          watchlists: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Mock data for products & tools
  const products = [
    { icon: "📢", label: "IPO", color: "bg-blue-50 text-blue-700" },
    { icon: "🧩", label: "MTF", color: "bg-green-50 text-green-700" },
    { icon: "📜", label: "Bonds", color: "bg-purple-50 text-purple-700" },
    { icon: "⏳", label: "Intraday", color: "bg-orange-50 text-orange-700" },
    { icon: "📅", label: "Events", color: "bg-pink-50 text-pink-700" },
    { icon: "🔎", label: "Screener", color: "bg-indigo-50 text-indigo-700" },
  ];

  const handleViewAll = () => {
    navigate('/all-stocks');
  };

  const handleStockClick = (stock) => {
    navigate(`/stock/${encodeURIComponent(stock.symbol)}`);
  };

  const handleWatchlistClick = () => {
    navigate('/watchlist');
  };

  return (
    <div className="w-full px-2 sm:px-3 md:px-6 space-y-4 md:space-y-6 max-w-full overflow-x-hidden mx-auto" style={{ boxSizing: 'border-box', width: '100%' }}>
      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full" style={{ boxSizing: 'border-box' }}>
        <div className="flex items-start justify-center md:justify-start">
          <div className="flex-shrink-0 hidden md:block">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left md:ml-3">
            <p className="text-xs md:text-sm text-blue-700 leading-relaxed">
              <span className="font-medium">Trading Availability:</span> Buy and sell stocks are available 24/7. Real-time stock prices are shown during market hours (Monday to Friday, 9:00 AM to 3:30 PM IST).
            </p>
          </div>
        </div>
      </div>

      {/* Investment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 w-full" style={{ boxSizing: 'border-box' }}>
        {/* Total Investment */}
        <div className="card-hover p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all duration-200 w-full" style={{ boxSizing: 'border-box' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <i className="fa-solid fa-indian-rupee-sign text-blue-600 text-xl"></i>
            </div>
            <span className="text-xs text-gray-500 text-right">Total Investment</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              ₹{totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500">Your total invested amount</p>
          </div>
        </div>

        {/* Current Value */}
        <div className="card-hover p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all duration-200 w-full" style={{ boxSizing: 'border-box' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <BarChart3 size={20} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-500 text-right">Current Value</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              ₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500">Current portfolio value</p>
          </div>
        </div>

        {/* Returns */}
        <div className="card-hover p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all duration-200 w-full" style={{ boxSizing: 'border-box' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${pnl >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              {pnl >= 0 ? (
                <TrendingUp size={20} className="text-green-600" />
              ) : (
                <TrendingDown size={20} className="text-red-600" />
              )}
            </div>
            <span className="text-xs text-gray-500 text-right">Total Returns</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className={`text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">
        {/* Most Traded Stocks */}
        <div className="lg:col-span-2 w-full order-1">
          <div className="card w-full overflow-hidden" style={{ boxSizing: 'border-box' }}>
            <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Most Traded Stocks</h3>
              <button 
                onClick={handleViewAll}
                className="text-xs md:text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 flex-shrink-0"
              >
                <span>View all</span>
                <ArrowRight size={12} className="md:w-3.5 md:h-3.5 flex-shrink-0" />
              </button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
                {mostTraded.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    className="stock-card group cursor-pointer bg-white border border-gray-200 rounded-xl p-3 md:p-4 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 hover:bg-blue-50/30 transition-all duration-300 ease-in-out w-full overflow-hidden"
                    onClick={() => handleStockClick(stock)}
                    style={{ boxSizing: 'border-box' }}
                  >
                    <div className="flex items-center space-x-2 md:space-x-3 w-full min-w-0">
                     
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate group-hover:text-blue-900 transition-colors duration-300">
                          {stock.symbol}
                        </p>
                        <p className="text-xs text-gray-500 truncate group-hover:text-blue-600 transition-colors duration-300">
                          {stock.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300 whitespace-nowrap">
                          ₹{(stock.price || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </p>
                        <div className={`flex items-center justify-end space-x-0.5 md:space-x-1 text-xs ${
                          (stock.percent || 0) >= 0 ? 'text-success-600' : 'text-danger-600'
                        }`}>
                          {(stock.percent || 0) >= 0 ? <TrendingUp size={10} className="md:w-3 md:h-3 flex-shrink-0" /> : <TrendingDown size={10} className="md:w-3 md:h-3 flex-shrink-0" />}
                          <span className="whitespace-nowrap">{(stock.percent || 0) >= 0 ? '+' : ''}{(stock.percent || 0).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Watchlist & Products - Desktop Sidebar */}
        <div className="hidden lg:block space-y-4 md:space-y-6 w-full order-2">
          {/* Watchlist */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Watchlists</h3>
              <button 
                onClick={handleWatchlistClick}
                className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </button>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              {/* Show all user watchlists */}
              {watchlistSummary.watchlists && watchlistSummary.watchlists.length > 0 ? (
                watchlistSummary.watchlists.slice(0, 2).map((watchlist, index) => (
                  <div 
                    key={watchlist.id}
                    className="p-2 md:p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={handleWatchlistClick}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                          {watchlist.name}
                        </p>
                        <p className="text-xs text-gray-500">{watchlist.stocks.length} items</p>
                      </div>
                      <button className="p-1 ml-2 rounded hover:bg-gray-200 transition-colors duration-200 flex-shrink-0">
                        <Eye size={12} className="md:w-3.5 md:h-3.5 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Show first few stocks from this watchlist */}
                    {watchlist.stocks.length > 0 && (
                      <div className="mt-2 md:mt-3 space-y-1.5 md:space-y-2">
                        {watchlist.stocks.slice(0, 2).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 font-medium truncate flex-1">{item.symbol}</span>
                            <div className="flex items-center space-x-1.5 md:space-x-2 ml-2 flex-shrink-0">
                              <span className="text-gray-600 text-xs">₹{(item.price || 0).toLocaleString()}</span>
                              <span className={`text-xs ${(item.percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(item.percent || 0) >= 0 ? '+' : ''}{(item.percent || 0).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        ))}
                        {watchlist.stocks.length > 2 && (
                          <div className="text-xs text-gray-500 text-center pt-1">
                            +{watchlist.stocks.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div 
                  className="p-2 md:p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleWatchlistClick}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-gray-900">
                        Create Your First Watchlist
                      </p>
                      <p className="text-xs text-gray-500">No watchlists yet</p>
                    </div>
                    <button className="p-1 ml-2 rounded hover:bg-gray-200 transition-colors duration-200 flex-shrink-0">
                      <Plus size={12} className="md:w-3.5 md:h-3.5 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Click to create your first watchlist
                  </div>
                </div>
              )}
              
              <button 
                className="w-full p-2 md:p-3 border-2 border-dashed border-gray-300 rounded-lg text-xs md:text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors duration-200"
                onClick={() => navigate('/watchlist?action=create')}
              >
                + Create new watchlist
              </button>
            </div>
          </div>

          {/* Products & Tools */}
          <div className="card">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Products & Tools</h3>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <button
                  key={product.label}
                  className="p-2 md:p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
                >
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center mb-1 md:mb-2 ${product.color}`}>
                    <span className="text-base md:text-lg">{product.icon}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-900">{product.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Watchlist Section - Mobile: Full Width Below Stocks */}
        <div className="lg:hidden w-full order-3 mt-4 md:mt-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Watchlists</h3>
              <button 
                onClick={handleWatchlistClick}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </button>
            </div>
            
            <div className="space-y-2">
              {watchlistSummary.watchlists && watchlistSummary.watchlists.length > 0 ? (
                watchlistSummary.watchlists.slice(0, 2).map((watchlist) => (
                  <div 
                    key={watchlist.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={handleWatchlistClick}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {watchlist.name}
                        </p>
                        <p className="text-xs text-gray-500">{watchlist.stocks.length} items</p>
                      </div>
                      <button className="p-1 ml-2 rounded hover:bg-gray-200 transition-colors duration-200 flex-shrink-0">
                        <Eye size={14} className="text-gray-600" />
                      </button>
                    </div>
                    
                    {watchlist.stocks.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {watchlist.stocks.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 font-medium truncate flex-1">{item.symbol}</span>
                            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                              <span className="text-gray-600">₹{(item.price || 0).toLocaleString()}</span>
                              <span className={`${(item.percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(item.percent || 0) >= 0 ? '+' : ''}{(item.percent || 0).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        ))}
                        {watchlist.stocks.length > 3 && (
                          <div className="text-xs text-gray-500 text-center pt-1">
                            +{watchlist.stocks.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div 
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleWatchlistClick}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Create Your First Watchlist
                      </p>
                      <p className="text-xs text-gray-500">No watchlists yet</p>
                    </div>
                    <button className="p-1 ml-2 rounded hover:bg-gray-200 transition-colors duration-200 flex-shrink-0">
                      <Plus size={14} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Click to create your first watchlist
                  </div>
                </div>
              )}
              
              <button 
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors duration-200"
                onClick={() => navigate('/watchlist?action=create')}
              >
                + Create new watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSummary;