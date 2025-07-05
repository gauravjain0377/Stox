import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Plus,
  Eye,
  ArrowRight
} from "lucide-react";
import { useGeneralContext } from "./GeneralContext";

const ModernSummary = () => {
  const { holdings = [], user } = useGeneralContext();

  // Calculate summary values
  const totalInvestment = holdings.reduce((sum, h) => sum + (h.avg || 0) * (h.qty || 0), 0);
  const currentValue = holdings.reduce((sum, h) => sum + (h.price || 0) * (h.qty || 0), 0);
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;

  // Mock data for most traded stocks
  const mostTraded = [
    {
      logo: "https://assets-netstorage.groww.in/stock-assets/logos/BSE.png",
      name: "BSE",
      symbol: "BSE",
      price: 2635.2,
      change: -184.9,
      percent: -6.56,
    },
    {
      logo: "https://assets-netstorage.groww.in/stock-assets/logos/CPCL.png",
      name: "Chennai Petro Corp",
      symbol: "CPCL",
      price: 771.15,
      change: 58.75,
      percent: 8.25,
    },
    {
      logo: "https://assets-netstorage.groww.in/stock-assets/logos/HDB.png",
      name: "HDB Financial Services",
      symbol: "HDB",
      price: 845.45,
      change: -18.55,
      percent: -2.15,
    },
    {
      logo: "https://assets-netstorage.groww.in/stock-assets/logos/CREDITACCESS.png",
      name: "CreditAccess Grameen",
      symbol: "CREDITACCESS",
      price: 1290.5,
      change: 49.5,
      percent: 3.99,
    },
  ];

  // Mock data for products & tools
  const products = [
    { icon: "📢", label: "IPO", color: "bg-blue-50 text-blue-700" },
    { icon: "🧩", label: "MTF", color: "bg-green-50 text-green-700" },
    { icon: "📜", label: "Bonds", color: "bg-purple-50 text-purple-700" },
    { icon: "⏳", label: "Intraday", color: "bg-orange-50 text-orange-700" },
    { icon: "📅", label: "Events", color: "bg-pink-50 text-pink-700" },
    { icon: "🔎", label: "Screener", color: "bg-indigo-50 text-indigo-700" },
  ];

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
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1">
                <span>View all</span>
                <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mostTraded.map((stock) => (
                <div key={stock.symbol} className="stock-card group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="font-semibold text-sm text-gray-700">
                        {stock.symbol.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {stock.symbol}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {stock.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{stock.price.toLocaleString()}
                      </p>
                      <div className={`flex items-center space-x-1 text-xs ${
                        stock.change >= 0 ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                        <span>({stock.percent >= 0 ? '+' : ''}{stock.percent.toFixed(2)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Watchlist & Products */}
        <div className="space-y-6">
          {/* Watchlist */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Watchlists</h3>
              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.username || 'Gaurav'}'s Watchlist
                    </p>
                    <p className="text-xs text-gray-500">5 items</p>
                  </div>
                  <button className="p-1 rounded hover:bg-gray-200 transition-colors duration-200">
                    <Eye size={14} className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors duration-200">
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