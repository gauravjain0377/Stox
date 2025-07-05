import React, { useState, useContext } from "react";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal,
  BarChart3,
  Eye
} from "lucide-react";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";

const ModernWatchlist = () => {
  const [search, setSearch] = useState("");
  const [hoveredStock, setHoveredStock] = useState(null);
  const { user } = useContext(GeneralContext);

  const filteredStocks = watchlist.filter(
    (stock) =>
      stock.name.toLowerCase().includes(search.toLowerCase()) ||
      (stock.symbol && stock.symbol.toLowerCase().includes(search.toLowerCase()))
  );

  const getStockInitial = (stock) => {
    return stock.symbol ? stock.symbol[0] : stock.name[0];
  };

  const getStockColor = (stock) => {
    return stock.isDown ? 'bg-danger-50 text-danger-700' : 'bg-success-50 text-success-700';
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Watchlist</h2>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Plus size={18} className="text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {filteredStocks.length} of {watchlist.length} stocks
        </div>
      </div>

      {/* Stock List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredStocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Search size={48} className="mb-4 text-gray-300" />
            <p className="text-sm">No stocks found</p>
            <p className="text-xs">Try adjusting your search</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredStocks.map((stock, index) => (
              <div
                key={`${stock.name}-${index}`}
                className="group relative p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredStock(index)}
                onMouseLeave={() => setHoveredStock(null)}
              >
                <div className="flex items-center space-x-3">
                  {/* Stock Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStockColor(stock)}`}>
                    <span className="font-semibold text-sm">{getStockInitial(stock)}</span>
                  </div>
                  
                  {/* Stock Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {stock.symbol || stock.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {stock.name}
                        </p>
                      </div>
                      
                      {/* Price and Change */}
                      <div className="text-right ml-2">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{stock.price}
                        </p>
                        <div className={`flex items-center space-x-1 text-xs ${
                          stock.isDown ? 'text-danger-600' : 'text-success-600'
                        }`}>
                          {stock.isDown ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                          <span>{stock.percent}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Actions */}
                {hoveredStock === index && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1 animate-scale-in">
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors duration-200" title="View Details">
                      <Eye size={14} className="text-gray-600" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors duration-200" title="Analytics">
                      <BarChart3 size={14} className="text-gray-600" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors duration-200" title="More Options">
                      <MoreHorizontal size={14} className="text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-success text-xs py-2">
            Buy
          </button>
          <button className="btn-danger text-xs py-2">
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernWatchlist; 