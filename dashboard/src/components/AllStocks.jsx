import React, { useState, useEffect, useRef } from 'react';
import { stockService } from '../services/stockService';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { WS_URL } from '../config/api';
import { useGeneralContext } from './GeneralContext';

const AllStocks = () => {
  const { setSelectedStock } = useGeneralContext();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const allStocks = await stockService.getAllStocksWithData();
        
        // Normalize stock data format
        const normalizedStocks = allStocks.map(stock => ({
          ...stock,
          name: stock.name || stock.fullName || stock.symbol,
          symbol: stock.symbol || 'UNKNOWN',
          previousClose: stock.previousClose || (stock.price ? stock.price / (1 + (stock.percent || 0) / 100) : 0),
          change: stock.change || (stock.previousClose ? stock.price - stock.previousClose : 0)
        }));
        
        setStocks(normalizedStocks);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (stocks.length === 0) return;

    console.log('AllStocks: Setting up WebSocket connection');
    
    socketRef.current = io(WS_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('AllStocks: WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('AllStocks: WebSocket disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('AllStocks: WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Listen for individual stock updates
    socket.on('stockUpdate', (stock) => {
      setStocks(prevStocks => {
        return prevStocks.map(prevStock => {
          if (prevStock.symbol === stock.symbol) {
            const change = prevStock.previousClose ? stock.price - prevStock.previousClose : (prevStock.change || 0);
            const percent = prevStock.previousClose ? ((change / prevStock.previousClose) * 100) : (stock.percentChange || prevStock.percent || 0);
            
            return {
              ...prevStock,
              price: stock.price,
              change: change,
              percent: percent,
              volume: stock.volume ? stock.volume.toLocaleString() : prevStock.volume,
              previousClose: stock.previousClose || prevStock.previousClose
            };
          }
          return prevStock;
        });
      });
    });

    // Listen for bulk updates
    socket.on('bulkStockUpdate', (updatedStocks) => {
      if (updatedStocks && updatedStocks.length > 0) {
        const stockMap = {};
        updatedStocks.forEach(stock => {
          stockMap[stock.symbol] = stock;
        });
        
        setStocks(prevStocks => {
          return prevStocks.map(prevStock => {
            const updatedStock = stockMap[prevStock.symbol];
            if (updatedStock) {
              const change = prevStock.previousClose ? updatedStock.price - prevStock.previousClose : (prevStock.change || 0);
              const percent = prevStock.previousClose ? ((change / prevStock.previousClose) * 100) : (updatedStock.percentChange || prevStock.percent || 0);
              
              return {
                ...prevStock,
                price: updatedStock.price,
                change: change,
                percent: percent,
                volume: updatedStock.volume ? updatedStock.volume.toLocaleString() : prevStock.volume,
                previousClose: updatedStock.previousClose || prevStock.previousClose
              };
            }
            return prevStock;
          });
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [stocks.length]); // Only re-run when stocks are loaded

  const filteredStocks = stocks.filter(stock =>
    stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stock.fullName && stock.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'price' || sortBy === 'change' || sortBy === 'percent') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else {
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getSectorFromSymbol = (symbol) => {
    const sectorMap = {
      'RELIANCE': 'Oil & Gas',
      'HDFCBANK': 'Banking',
      'ICICIBANK': 'Banking',
      'TCS': 'IT',
      'BHARTIARTL': 'Telecom',
      'INFY': 'IT',
      'ITC': 'FMCG',
      'KOTAKBANK': 'Banking',
      'LT': 'Construction',
      'SBIN': 'Banking',
      'AXISBANK': 'Banking',
      'HINDUNILVR': 'FMCG',
      'BAJFINANCE': 'Finance',
      'HCLTECH': 'IT',
      'MARUTI': 'Automobile',
      'ASIANPAINT': 'Paints',
      'SUNPHARMA': 'Pharmaceuticals',
      'TITAN': 'Consumer Goods',
      'ULTRACEMCO': 'Cement',
      'NTPC': 'Power',
      'TATAMOTORS': 'Automobile',
      'POWERGRID': 'Power',
      'TATASTEEL': 'Steel',
      'JSWSTEEL': 'Steel',
      'NESTLEIND': 'FMCG',
      'HDFCLIFE': 'Insurance',
      'TECHM': 'IT',
      'WIPRO': 'IT',
      'BAJAJFINSV': 'Finance',
      'GRASIM': 'Cement',
      'ADANIGREEN': 'Renewable Energy',
      'ADANIPORTS': 'Ports',
      'COALINDIA': 'Mining',
      'BPCL': 'Oil & Gas',
      'UPL': 'Agro Chemicals',
      'HINDALCO': 'Aluminium',
      'EICHERMOT': 'Automobile',
      'DIVISLAB': 'Pharmaceuticals',
      'CIPLA': 'Pharmaceuticals',
      'BRITANNIA': 'FMCG',
      'M&M': 'Automobile',
      'BAJAJ_AUTO': 'Automobile',
      'HERO': 'Automobile',
      'DRREDDY': 'Pharmaceuticals',
      'DABUR': 'FMCG',
      'APOLLOHOSP': 'Healthcare',
      'TATACONSUM': 'FMCG',
      'ONGC': 'Oil & Gas',
      'INDUSINDBK': 'Banking',
      'HDFC': 'Finance'
    };
    return sectorMap[symbol] || 'Others';
  };

  const handleStockClick = (stock) => {
    // Set selectedStock in context before navigating for instant display
    setSelectedStock(stock);
    navigate(`/stock/${encodeURIComponent(stock.symbol)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Stocks</h1>
          <p className="text-gray-600">Browse all available stocks in the market</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search stocks by symbol or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    Company {getSortIcon('name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>
                    Price {getSortIcon('price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('change')}>
                    Change {getSortIcon('change')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('percent')}>
                    % Change {getSortIcon('percent')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('volume')}>
                    Volume {getSortIcon('volume')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStocks.map((stock, index) => (
                  <tr 
                    key={stock.symbol || index}
                    onClick={() => handleStockClick(stock)}
                    className="hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-500 cursor-pointer transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                        {stock.name || stock.fullName || stock.symbol}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getSectorFromSymbol(stock.symbol)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{parseFloat(stock.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${parseFloat(stock.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(stock.change || 0) >= 0 ? '+' : ''}₹{parseFloat(stock.change || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${parseFloat(stock.percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(stock.percent || 0) >= 0 ? '+' : ''}{parseFloat(stock.percent || 0).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{stock.volume || '-'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sortedStocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No stocks found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStocks; 