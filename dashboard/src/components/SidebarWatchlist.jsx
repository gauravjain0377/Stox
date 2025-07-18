console.log('SidebarWatchlist mounted');
console.log('Layout mounted');

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, ChevronUp, ChevronDown } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DoughnutChart } from "./DoughnoutChart";
import '../styles/WatchList.css';
import { useSidebar } from '../context/SidebarContext';

const indices = [
  { name: "NIFTY 50", value: 11504.95, change: -0.10, percent: -0.10 },
  { name: "SENSEX", value: 38845.82, change: -0.34, percent: -0.34 },
];

const NSE_SYMBOLS = [
  "ADANIPORTS.NS", "APOLLOHOSP.NS", "ASIANPAINT.NS", "AXISBANK.NS", "BAJAJ-AUTO.NS", "BAJFINANCE.NS", "BAJAJFINSV.NS", "BPCL.NS", "BHARTIARTL.NS", "BRITANNIA.NS", "CIPLA.NS", "COALINDIA.NS", "DIVISLAB.NS", "DRREDDY.NS", "EICHERMOT.NS", "GRASIM.NS", "HCLTECH.NS", "HDFCBANK.NS", "HDFCLIFE.NS", "HEROMOTOCO.NS", "HINDALCO.NS", "HINDUNILVR.NS", "ICICIBANK.NS", "ITC.NS", "INDUSINDBK.NS", "INFY.NS", "JSWSTEEL.NS", "KOTAKBANK.NS", "LTIM.NS", "LT.NS", "M&M.NS", "MARUTI.NS", "NTPC.NS", "NESTLEIND.NS", "ONGC.NS", "POWERGRID.NS", "RELIANCE.NS", "SBILIFE.NS", "SBIN.NS", "SUNPHARMA.NS", "TCS.NS", "TATACONSUM.NS", "TATAMOTORS.NS", "TATASTEEL.NS", "TECHM.NS", "TITAN.NS", "UPL.NS", "ULTRACEMCO.NS", "WIPRO.NS"];

const SidebarWatchlist = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  const [currentPage, setCurrentPage] = useState(0);
  const stocksPerPage = 8;
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [previousStocks, setPreviousStocks] = useState([]);
  const [priceChanges, setPriceChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const priceChangeTimeouts = useRef({});

  // Only update collapsed state on user action
  // Replace handleCollapseToggle with toggleSidebar
  // const handleCollapseToggle = () => {
  //   setCollapsed((c) => {
  //     localStorage.setItem('sidebarCollapsed', JSON.stringify(!c));
  //     return !c;
  //   });
  // };

  // Fix: Only run fetch interval on mount
  useEffect(() => {
    let intervalId;
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const symbolsParam = NSE_SYMBOLS.join(",");
        const response = await fetch(`http://localhost:3000/api/stocks/data?symbols=${symbolsParam}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }
        const result = await response.json();
        console.log('Stock API result:', result); // Debug log
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
        // Detect price changes
        const newPriceChanges = {};
        data.forEach((stock, idx) => {
          const prev = previousStocks.find(s => s.symbol === stock.symbol);
          if (prev) {
            if (stock.price > prev.price) newPriceChanges[stock.symbol] = 'up';
            else if (stock.price < prev.price) newPriceChanges[stock.symbol] = 'down';
          }
        });
        setPriceChanges(newPriceChanges);
        setPreviousStocks(stocks); // Save current as previous for next fetch
        setStocks(data);
        // Remove highlight after 1s
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
    fetchStocks();
    intervalId = setInterval(fetchStocks, 15000); // Poll every 15 seconds
    return () => {
      clearInterval(intervalId);
      Object.values(priceChangeTimeouts.current).forEach(clearTimeout);
    };
  // Only run on mount/unmount
  }, []);

  const totalPages = Math.ceil(stocks.length / stocksPerPage);
  const currentStocks = stocks.slice(currentPage * stocksPerPage, (currentPage + 1) * stocksPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Add mapping from short name to full company name
  const fullNameMap = {
    "TCS": "Tata Consultancy Services Ltd.",
    "RELIANCE": "Reliance Industries Ltd.",
    "INFY": "Infosys Ltd.",
    "HDFCBANK": "HDFC Bank Ltd.",
    "ICICIBANK": "ICICI Bank Ltd.",
    "BHARTIARTL": "Bharti Airtel Ltd.",
    "HCLTECH": "HCL Technologies Ltd.",
    "WIPRO": "Wipro Ltd.",
    "AXISBANK": "Axis Bank Ltd.",
    "KOTAKBANK": "Kotak Mahindra Bank Ltd."
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center text-red-600">
          <p>Error loading stocks: {error}</p>
        </div>
      </div>
    );
  }

  // Prepare data for doughnut chart
  const data = {
    labels: currentStocks.map(stock => stock.symbol),
    datasets: [
      {
        data: currentStocks.map(stock => stock.price),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
          '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <aside
      className={`h-full bg-white shadow-lg rounded-xl flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-80"
      }`}
      style={{ minWidth: collapsed ? 64 : 320, maxWidth: collapsed ? 64 : 340 }}
    >
      {/* Header with Collapse Button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            {!collapsed && "NIFTY 50"}
          </span>
        </div>
        <button
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* NIFTY/SENSEX Ticker */}
      {!collapsed && (
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 bg-gray-50">
          {indices.map((idx) => (
            <div key={idx.name} className="flex flex-col items-start text-xs">
              <span className="font-semibold text-gray-700 tracking-tight">{idx.name}</span>
              <span className="flex items-center gap-1">
                <span className={`font-bold ${idx.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {idx.value.toLocaleString()}
                </span>
                <span className={`ml-1 ${idx.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {idx.change >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {idx.percent}%
                </span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Watchlist Content */}
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        {collapsed ? (
          // Collapsed view - just stock initials
          <div className="flex flex-col items-center mt-4 space-y-2 px-2">
            {currentStocks.map((stock, idx) => (
              <div key={stock.symbol + idx} className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-gray-700 font-bold text-sm border border-gray-200">
                {stock.symbol[0]}
              </div>
            ))}
          </div>
        ) : (
          // Expanded view with pagination
          <>
            {/* Page Indicator */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-medium text-gray-600">
                {currentPage + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={currentPage === 0}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextPage}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* 8 Stocks - No flex-1, no justify-center, just a normal list */}
            <ul className="divide-y divide-gray-50" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {currentStocks.map((stock, idx) => {
                const percent = typeof stock.percent === "string" ? parseFloat(stock.percent) : stock.percent;
                const isDown = percent < 0;
                const fullName = fullNameMap[stock.symbol] || stock.symbol;
                const isHovered = hoveredIdx === idx;
                return (
                  <li
                    key={stock.symbol + idx}
                    className={`flex items-center justify-between px-4 py-3 group hover:bg-gray-50 transition-all cursor-pointer border-l-2 border-transparent hover:border-blue-200 relative`}
                    style={{ fontFamily: 'Inter, Poppins, Roboto, sans-serif' }}
                    onClick={() => navigate(`/stock/${encodeURIComponent(stock.symbol)}`)}
                  >
                    {/* Left: Symbol, full name (on hover), and volume/cap */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`font-bold text-sm text-gray-900 tabular-nums block relative ${isHovered ? 'underline underline-offset-4 decoration-blue-600' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      >
                        {stock.symbol}
                        {/* Show full name only on hover over symbol */}
                        {isHovered && (
                          <span
                            className="absolute left-0 mt-1 z-10 px-3 py-1 rounded-md bg-gray-900 text-white text-xs font-medium shadow-lg animate-fade-in"
                            style={{ top: '100%', whiteSpace: 'nowrap', pointerEvents: 'none' }}
                          >
                            {fullName}
                          </span>
                        )}
                      </span>
                      <Tooltip title={`Volume: ${stock.volume} • Market Cap: ${stock.marketCap}`} arrow>
                        <span className="text-xs text-gray-500 block" style={{ cursor: 'pointer' }}>
                          {stock.volume} • {stock.marketCap}
                        </span>
                      </Tooltip>
                    </div>
                    {/* Right: Price and percent */}
                    <div className="flex flex-col items-end min-w-[80px]">
                      <Tooltip title={`Price: ₹${stock.price.toLocaleString()}`} arrow>
                        <span className={`font-bold text-lg text-black tabular-nums leading-tight ${
                          priceChanges[stock.symbol] === 'up' ? 'price-up' : priceChanges[stock.symbol] === 'down' ? 'price-down' : ''
                        }`} style={{ cursor: 'pointer' }}>
                          ₹{stock.price.toLocaleString()}
                        </span>
                      </Tooltip>
                      <Tooltip title={`${percent >= 0 ? 'Profit' : 'Loss'}: ${percent >= 0 ? '+' : ''}${percent}%`} arrow>
                        <span className={`flex items-center gap-1 text-xs font-semibold ${isDown ? "text-red-500" : "text-green-600"}`} style={{ cursor: 'pointer' }}>
                          {percent >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {percent > 0 ? '+' : ''}{percent}%
                        </span>
                      </Tooltip>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Chart for Current Page Stocks - always visible below stocks */}
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
              <div className="font-semibold text-base text-gray-700 mb-4">Market Allocation</div>
              <div className="relative" style={{ width: 300, height: 300 }}>
                <DoughnutChart data={data} details={currentStocks} />
                <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{currentStocks.length}</div>
                    <div className="text-sm text-gray-500">Stocks</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center">
                Showing {currentPage * stocksPerPage + 1}-{Math.min((currentPage + 1) * stocksPerPage, stocks.length)} of {stocks.length}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom gradient for depth */}
      <div className="h-1 bg-gradient-to-t from-gray-100 to-transparent w-full rounded-b-xl" />
    </aside>
  );
};

export default SidebarWatchlist; 