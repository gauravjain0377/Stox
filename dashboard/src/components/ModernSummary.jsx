import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Eye,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeneralContext } from "./GeneralContext";
import { stockService } from "../services/stockService";

const ModernSummary = () => {
  const { holdings = [], user } = useGeneralContext();
  const [mostTraded, setMostTraded] = useState([]);
  const [watchlistSummary, setWatchlistSummary] = useState({ count: 0, items: [], totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Calculate summary values
  const totalInvestment = holdings.reduce((sum, h) => sum + (h.avg || 0) * (h.qty || 0), 0);
  const currentValue = holdings.reduce((sum, h) => sum + (h.price || 0) * (h.qty || 0), 0);
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
    <div className="p-6 space-y-6">
      {/* Investment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Investment */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Total Investment</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              ₹{totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-gray-500">Your total invested amount</p>
          </div>
        </div>

        {/* Current Value */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <BarChart3 size={20} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Current Value</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              ₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-gray-500">Current portfolio value</p>
          </div>
        </div>

        {/* Returns */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${pnl >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              {pnl >= 0 ? (
                <TrendingUp size={20} className="text-green-600" />
              ) : (
                <TrendingDown size={20} className="text-red-600" />
              )}
            </div>
            <span className="text-xs text-gray-500">Total Returns</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className={`text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Traded Stocks */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Most Traded Stocks</h3>
              <button 
                onClick={handleViewAll}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight size={14} />
              </button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mostTraded.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    className="stock-card group cursor-pointer bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 hover:bg-blue-50/30 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1"
                    onClick={() => handleStockClick(stock)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                        <span className="font-semibold text-sm text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                          {stock.symbol.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-900 transition-colors duration-300">
                          {stock.symbol}
                        </p>
                        <p className="text-xs text-gray-500 truncate group-hover:text-blue-600 transition-colors duration-300">
                          {stock.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                          ₹{(stock.price || 0).toLocaleString()}
                        </p>
                        <div className={`flex items-center space-x-1 text-xs ${
                          (stock.percent || 0) >= 0 ? 'text-success-600' : 'text-danger-600'
                        }`}>
                          {(stock.percent || 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          <span>{(stock.percent || 0) >= 0 ? '+' : ''}{(stock.percent || 0).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Watchlist & Products */}
        <div className="space-y-6">
          {/* Watchlist */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Watchlists</h3>
            </div>
            
            <div className="space-y-3">
              {/* Show all user watchlists */}
              {watchlistSummary.watchlists && watchlistSummary.watchlists.length > 0 ? (
                watchlistSummary.watchlists.map((watchlist, index) => (
                  <div 
                    key={watchlist.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={handleWatchlistClick}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {watchlist.name}
                        </p>
                        <p className="text-xs text-gray-500">{watchlist.stocks.length} items</p>
                      </div>
                      <button className="p-1 rounded hover:bg-gray-200 transition-colors duration-200">
                        <Eye size={14} className="text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Show first few stocks from this watchlist */}
                    {watchlist.stocks.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {watchlist.stocks.slice(0, 2).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 font-medium">{item.symbol}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">₹{(item.price || 0).toLocaleString()}</span>
                              <span className={`${(item.percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(item.percent || 0) >= 0 ? '+' : ''}{(item.percent || 0).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        ))}
                        {watchlist.stocks.length > 2 && (
                          <div className="text-xs text-gray-500 text-center pt-1">
                            +{watchlist.stocks.length - 2} more items
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
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Create Your First Watchlist
                      </p>
                      <p className="text-xs text-gray-500">No watchlists yet</p>
                    </div>
                    <button className="p-1 rounded hover:bg-gray-200 transition-colors duration-200">
                      <Plus size={14} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500 text-center">
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

          {/* Products & Tools */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products & Tools</h3>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <button
                  key={product.label}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${product.color}`}>
                    <span className="text-lg">{product.icon}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-900">{product.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSummary; 