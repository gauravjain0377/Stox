import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DoughnutChart } from "./DoughnoutChart";
import '../styles/WatchList.css';
import { useSidebar } from '../context/SidebarContext';
import { useGeneralContext } from './GeneralContext';

const indices = [
  { name: "NIFTY 50", value: 11504.95, change: -0.10, percent: -0.10 },
  { name: "SENSEX", value: 38845.82, change: -0.34, percent: -0.34 },
];

const NSE_SYMBOLS = [
  "ADANIPORTS.NS", "APOLLOHOSP.NS", "ASIANPAINT.NS", "AXISBANK.NS", "BAJAJ-AUTO.NS", "BAJFINANCE.NS", "BAJAJFINSV.NS", "BPCL.NS", "BHARTIARTL.NS", "BRITANNIA.NS", "CIPLA.NS", "COALINDIA.NS", "DIVISLAB.NS", "DRREDDY.NS", "EICHERMOT.NS", "GRASIM.NS", "HCLTECH.NS", "HDFCBANK.NS", "HDFCLIFE.NS", "HEROMOTOCO.NS", "HINDALCO.NS", "HINDUNILVR.NS", "ICICIBANK.NS", "ITC.NS", "INDUSINDBK.NS", "INFY.NS", "JSWSTEEL.NS", "KOTAKBANK.NS", "LTIM.NS", "LT.NS", "M&M.NS", "MARUTI.NS", "NTPC.NS", "NESTLEIND.NS", "ONGC.NS", "POWERGRID.NS", "RELIANCE.NS", "SBILIFE.NS", "SBIN.NS", "SUNPHARMA.NS", "TCS.NS", "TATACONSUM.NS", "TATAMOTORS.NS", "TATASTEEL.NS", "TECHM.NS", "TITAN.NS", "UPL.NS", "ULTRACEMCO.NS", "WIPRO.NS"
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

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        if (stocks.length === 0) {
          setLoading(true);
        }
        
        const symbolsParam = NSE_SYMBOLS.join(",");
        const response = await fetch(`http://localhost:3000/api/stocks/data?symbols=${symbolsParam}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }
        const result = await response.json();
        const data = Array.isArray(result.data)
          ? result.data.map(stock => ({
              symbol: stock.symbol ? stock.symbol.replace('.NS', '') : 'N/A',
              price: stock.price || 0,
              percent: stock.percentChange || 0,
              volume: stock.volume ? stock.volume.toLocaleString() : '-',
              marketCap: stock.marketCap ? stock.marketCap.toLocaleString() : '-',
              name: stock.name || stock.symbol,
            }))
          : [];

        const newPriceChanges = {};
        data.forEach((stock) => {
          const prev = previousStocks.find(s => s.symbol === stock.symbol);
          if (prev) {
            if (stock.price > prev.price) newPriceChanges[stock.symbol] = 'up';
            else if (stock.price < prev.price) newPriceChanges[stock.symbol] = 'down';
          }
        });

        setPriceChanges(newPriceChanges);
        setPreviousStocks(stocks);
        setStocks(data);

        Object.keys(newPriceChanges).forEach(symbol => {
          if (priceChangeTimeouts.current[symbol]) clearTimeout(priceChangeTimeouts.current[symbol]);
          priceChangeTimeouts.current[symbol] = setTimeout(() => {
            setPriceChanges(pc => {
              const updated = { ...pc };
              delete updated[symbol];
              return updated;
            });
          }, 1000);
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Data is now fetched only once when the component mounts.
    fetchStocks();

    // The cleanup function only needs to clear timeouts now.
    return () => {
      Object.values(priceChangeTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  const totalPages = Math.ceil(stocks.length / stocksPerPage);
  const currentStocks = stocks.slice(currentPage * stocksPerPage, (currentPage + 1) * stocksPerPage);

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 0));

  const fullNameMap = {
    "TCS": "Tata Consultancy Services Ltd.", "RELIANCE": "Reliance Industries Ltd.", "INFY": "Infosys Ltd.", "HDFCBANK": "HDFC Bank Ltd.", "ICICIBANK": "ICICI Bank Ltd.", "BHARTIARTL": "Bharti Airtel Ltd.", "HCLTECH": "HCL Technologies Ltd.", "WIPRO": "Wipro Ltd.", "AXISBANK": "Axis Bank Ltd.", "KOTAKBANK": "Kotak Mahindra Bank Ltd."
  };

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
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
 <aside className={`h-full bg-white shadow-lg rounded-xl flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-80'}`}>


      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">NIFTY 50</span>
          </div>
        )}
        <button onClick={toggleSidebar} className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${collapsed ? 'mx-auto' : ''}`}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 flex flex-col animate-fade-in">

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
                        const fullName = fullNameMap[stock.symbol] || stock.name;
                        const isDown = stock.percent < 0;
                        const formattedPercent = stock.percent.toFixed(2);

                        return (
                            <li
                                key={stock.symbol}
                                className="flex items-center justify-between px-4 py-3 group hover:bg-gray-50 transition-all cursor-pointer border-l-2 border-transparent hover:border-blue-200"
                                onClick={() => {
                                    setSelectedStock(stock);
                                    navigate(`/stock/${encodeURIComponent(stock.symbol)}`, { replace: true });
                                }}
                            >
                                <div className="flex-1 min-w-0">
                                    <Tooltip title={fullName} arrow>
                                        <span className="font-bold text-sm text-gray-900 tabular-nums block">{stock.symbol}</span>
                                    </Tooltip>
                                    <Tooltip title={`Volume: ${stock.volume} • Market Cap: ${stock.marketCap}`} arrow>
                                        <span className="text-xs text-gray-500 block cursor-pointer">{stock.volume} • {stock.marketCap}</span>
                                    </Tooltip>
                                </div>
                                <div className="flex flex-col items-end min-w-[80px]">
                                    <Tooltip title={`Price: ₹${stock.price.toLocaleString()}`} arrow>
                                        <span className={`font-bold text-lg text-black tabular-nums leading-tight ${priceChanges[stock.symbol] === 'up' ? 'price-up' : priceChanges[stock.symbol] === 'down' ? 'price-down' : ''}`}>
                                            ₹{stock.price.toLocaleString()}
                                        </span>
                                    </Tooltip>
                                    <Tooltip title={`${isDown ? 'Loss' : 'Profit'}: ${stock.percent > 0 ? '+' : ''}${formattedPercent}%`} arrow>
                                        <span className={`flex items-center gap-1 text-xs font-semibold ${isDown ? "text-red-500" : "text-green-600"}`}>
                                            {isDown ? <ArrowDownRight size={12}/> : <ArrowUpRight size={12}/>}
                                            {stock.percent > 0 ? '+' : ''}{formattedPercent}%
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
                    <DoughnutChart data={data} details={currentStocks} />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{currentStocks.length}</div>
                            <div className="text-sm text-gray-500">Stocks</div>
                        </div>
                    </div>
                </div>
                {currentStocks.length > 0 && (
                  <div className="mt-4 text-xs text-gray-500 text-center">
                      Showing {currentPage * stocksPerPage + 1}-{Math.min((currentPage + 1) * stocksPerPage, stocks.length)} of {stocks.length}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarWatchlist;