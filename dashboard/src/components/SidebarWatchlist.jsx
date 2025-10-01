import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DoughnutChart } from "./DoughnoutChart";
import '../styles/WatchList.css';
import { useSidebar } from '../context/SidebarContext';
import { useGeneralContext } from './GeneralContext';
import { stockService } from '../services/stockService';

const indices = [
  { name: "NIFTY 50", value: 11504.95, change: -0.10, percent: -0.10 },
  { name: "SENSEX", value: 38845.82, change: -0.34, percent: -0.34 },
];

const SidebarWatchlist = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  const { setSelectedStock } = useGeneralContext();
  const [currentPage, setCurrentPage] = useState(0);
  const stocksPerPage = 8;
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [previousStocks, setPreviousStocks] = useState([]);
  const [priceChanges, setPriceChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const priceChangeTimeouts = useRef({});
  const [companyInfoMap, setCompanyInfoMap] = useState({});

  // Fetch all company info on mount
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const companyData = await stockService.getCompanyInfo();
        
        const map = {};
        companyData.forEach(info => { 
          map[info.symbol] = info; 
        });
        setCompanyInfoMap(map);
      } catch (error) {
        console.error('SidebarWatchlist: Error fetching company info:', error);
      }
    };
    
    fetchCompanyInfo();
  }, []);

  // Fetch stocks only once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchStocks = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        console.log('SidebarWatchlist: Starting to fetch stocks...');
        
        // First try to get all stocks from the service
        const allStocks = await stockService.getAllStocks();
        
        console.log('SidebarWatchlist: Got stocks from service:', allStocks.length);
        
        if (!isMounted) return;
        
        // Process the stocks from service (which includes fallback if needed)
        const processedStocks = allStocks.map(stock => ({
          symbol: stock.symbol,
          price: stock.price,
          percent: stock.percent,
          volume: stock.volume,
          previousClose: stock.price * (1 + stock.percent / 100),
          name: stock.fullName,
        }));
        
        console.log('SidebarWatchlist: Setting stocks with processed data:', processedStocks.length);
        
        // Set stocks immediately
        setStocks(processedStocks);
        
        // Try to get live data in background (optional enhancement)
        try {
          if (!isMounted) return;
          
          const symbols = allStocks.map(stock => stock.symbol);
          const symbolsParam = symbols.join(",");
          
          const response = await fetch(`http://localhost:3000/api/stocks/data?symbols=${symbolsParam}`);
          if (response.ok && isMounted) {
            const result = await response.json();
            const liveData = Array.isArray(result.data) ? result.data : [];
            
            // Only update if we got ALL 50 stocks (not just 40+)
            if (liveData.length === 50 && isMounted) {
              const processedData = liveData.map(stock => ({
                symbol: stock.symbol ? stock.symbol.replace('.NS', '') : 'N/A',
                price: stock.price || 0,
                percent: stock.percentChange || 0,
                volume: stock.volume ? stock.volume.toLocaleString() : '-',
                previousClose: stock.previousClose || 0,
                name: stock.name || stock.symbol,
              }));
              setStocks(processedData);
            }
          }
        } catch (liveError) {
          // Live data fetch failed, using fallback data
        }
      } catch (error) {
        if (isMounted) {
          console.error('SidebarWatchlist: Error fetching stocks:', error);
          setError('Failed to load stocks');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchStocks();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Show all stocks, not just those with company info
  const filteredStocks = stocks;
  
  const totalPages = Math.ceil(filteredStocks.length / stocksPerPage);
  const currentStocks = filteredStocks.slice(currentPage * stocksPerPage, (currentPage + 1) * stocksPerPage);
  
  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 0));

  const handleStockClick = (stock) => {
    try {
      setSelectedStock(stock);
      navigate(`/stock/${encodeURIComponent(stock.symbol)}`, { replace: true });
    } catch (error) {
      console.error('Error navigating to stock:', error);
    }
  };

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }
  
  if (stocks.length === 0 && !loading) {
    return (
      <aside className={`h-full bg-white shadow-lg rounded-xl flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${collapsed ? 'sidebar-collapsed w-20' : 'w-80'}`}>
        <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 sidebar-toggle">
          {!collapsed && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">NIFTY 50</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-gray-600">No stocks loaded</p>
            <p className="text-xs text-gray-500 mt-1">Check console for debug info</p>
          </div>
        </div>
      </aside>
    );
  }
  
  if (loading) {
    return (
      <aside className={`h-full bg-white shadow-lg rounded-xl flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${collapsed ? 'sidebar-collapsed w-20' : 'w-80'}`}>
        <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 sidebar-toggle">
          {!collapsed && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">NIFTY 50</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading stocks...</p>
          </div>
        </div>
      </aside>
    );
  }
  
  const data = {
    labels: currentStocks.map(stock => stock.symbol),
    datasets: [{
        data: currentStocks.map(stock => stock.price),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'],
        borderWidth: 0,
    }],
  };
  
  return (
    <aside className={`h-full bg-white shadow-lg rounded-xl flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${collapsed ? 'sidebar-collapsed w-20' : 'w-80'}`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 sidebar-toggle">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">NIFTY 50</span>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? "Expand Watchlist" : "Collapse Watchlist"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      {!collapsed && (
        <div className="px-4 pt-2 pb-3 border-b border-gray-100 bg-white">
          <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>
              Trading hours: 9:00 AM to 3:30 PM IST (Monday to Friday, excluding holidays)
            </span>
          </div>
        </div>
      )}

      {/* Collapsed state - show stock symbols */}
      {collapsed && (
        <div className="flex-1 flex flex-col py-2">
          {/* Stock count indicator */}
          <div className="flex items-center justify-center py-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-700">{filteredStocks.length}</span>
            </div>
          </div>
          
          {currentStocks.slice(0, 8).map((stock, index) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-center py-3 px-2 cursor-pointer hover:bg-gray-100 transition-colors group"
              onClick={() => handleStockClick(stock)}
              title={`${stock.symbol} - ₹${stock.price.toLocaleString()}`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors border border-gray-200 group-hover:border-blue-300">
                <span className="font-bold text-lg text-gray-700 group-hover:text-blue-700">
                  {stock.symbol.charAt(0)}
                </span>
              </div>
            </div>
          ))}
          {currentStocks.length === 0 && (
            <div className="flex items-center justify-center py-3 px-2">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <span className="font-bold text-lg text-gray-500">-</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!collapsed && (
        <div className="flex-1 flex flex-col animate-fade-in sidebar-content">
          <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 bg-gray-50">
            {indices.map((idx) => (
              <div key={idx.name} className="flex flex-col items-start text-xs">
                <span className="font-semibold text-gray-700 tracking-tight">{idx.name}</span>
                <span className={`flex items-center gap-1 font-bold ${idx.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {idx.value.toLocaleString()}
                  <span className="ml-1 flex items-center">{idx.change >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {idx.percent}%</span>
                </span>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-medium text-gray-600">
                {totalPages > 0 ? `${currentPage + 1} of ${totalPages}` : '0 of 0'}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={prevPage} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50" disabled={currentPage === 0}>
                    <ChevronLeft size={16} />
                </button>
                <button onClick={nextPage} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50" disabled={totalPages === 0 || currentPage >= totalPages - 1}>
                    <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                  {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
              </div>
            ) : (
                <ul className="divide-y divide-gray-50">
                    {currentStocks.map((stock) => {
                        const fullName = companyInfoMap[stock.symbol]?.company_name || stock.name;
                        const isDown = stock.percent < 0;
                        const formattedPercent = typeof stock.percent === 'number' ? Math.abs(stock.percent).toFixed(2) : 'N/A';
                        // Use previousClose for accurate absolute change
                        const absChange = (typeof stock.price === 'number' && typeof stock.previousClose === 'number')
                          ? stock.price - stock.previousClose
                          : 0;
                        const tooltipText = `${isDown ? 'Loss' : 'Profit'}: ${absChange < 0 ? '' : '+'}${absChange.toFixed(2)} (${formattedPercent}%)`;
                        return (
                            <li
                                key={stock.symbol}
                                className="flex items-center justify-between px-4 py-3 group hover:bg-gray-50 transition-all cursor-pointer border-l-2 border-transparent hover:border-blue-200"
                                onClick={() => handleStockClick(stock)}
                            >
                                <div className="flex-1 min-w-0">
                                    <Tooltip title={fullName} arrow>
                                        <span className="font-bold text-sm text-gray-900 tabular-nums block">{stock.symbol}</span>
                                    </Tooltip>
                                    <Tooltip title={`Volume: ${stock.volume} `} arrow>
                                        <span className="text-xs text-gray-500 block cursor-pointer">{stock.volume} </span>
                                    </Tooltip>
                                </div>
                                <div className="flex flex-col items-end min-w-[100px]">
                                    <Tooltip title={`Price: ₹${stock.price.toLocaleString()}`} arrow>
                                        <span className={`font-bold text-lg text-black tabular-nums leading-tight ${priceChanges[stock.symbol] === 'up' ? 'price-up' : priceChanges[stock.symbol] === 'down' ? 'price-down' : ''}`}>₹{stock.price.toLocaleString()}</span>
                                    </Tooltip>
                                    <Tooltip title={tooltipText} arrow>
                                        <span className={`flex items-center gap-1 text-sm font-semibold ${isDown ? 'text-red-500' : 'text-green-600'}`} style={{ marginTop: 2 }}>
                                            {isDown ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>}
                                            {absChange < 0 ? '' : '+'}{absChange.toFixed(2)}
                                            <span>({formattedPercent}%)</span>
                                        </span>
                                    </Tooltip>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            <div className="flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
                <div className="font-semibold text-base text-gray-700 mb-4">Market Allocation</div>
                <div className="relative" style={{ width: '100%', maxWidth: 300, height: 300 }}>
                    <DoughnutChart data={data} />
                </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarWatchlist;