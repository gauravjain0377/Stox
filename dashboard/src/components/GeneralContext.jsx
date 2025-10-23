import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { holdings as fallbackHoldings } from "../data/data.jsx";
import { getApiUrl, FRONTEND_URL, WS_URL } from '../config/api';
import { io } from 'socket.io-client';

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = createContext();

export const useGeneralContext = () => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error("useGeneralContext must be used within a GeneralContextProvider");
  }
  return context;
};

export const GeneralContextProvider = ({ children }) => {
  const { user, logout, setUser } = useAuth();
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedSellStock, setSelectedSellStock] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [holdingsLoading, setHoldingsLoading] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  // Real-time price tracking for instant P&L calculation
  const [realTimePrices, setRealTimePrices] = useState({});
  const [holdingsWithPnL, setHoldingsWithPnL] = useState([]);
  const socketRef = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Functions to open and close the buy window
  const handleOpenBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  // Functions to open and close the sell window
  const handleOpenSellWindow = (stock) => {
    setIsSellWindowOpen(true);
    setSelectedSellStock(stock);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedSellStock(null);
  };

  // Function to refresh holdings
  const refreshHoldings = () => {
    console.log("🔄 Refreshing holdings for user:", user?.userId);
    setHoldingsLoading(true);
    
    // Get authentication data
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    const headers = {};
    
    // Add authentication headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userData) {
      headers['x-user-data'] = encodeURIComponent(userData);
    }
    
    // Use the new API endpoint with credentials
    fetch(getApiUrl('/api/holdings'), {
      credentials: 'include',
      headers
    })
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ Holdings fetched successfully:", data.holdings);
          setHoldings(data.holdings || []);
          setUsingFallbackData(false);
        } else {
          console.error("❌ API returned error:", data.message);
          // Fallback to mock data
          setHoldings(fallbackHoldings);
          setUsingFallbackData(true);
        }
        setHoldingsLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch holdings:", err);
        console.error("Error details:", {
          message: err.message,
          code: err.code
        });
        
        // Check if it's a network error (backend not running)
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          console.error("🔌 Network Error: Backend server is not running");
          console.error("💡 Please start the backend server with: cd backend && npm start");
          setUsingFallbackData(true);
        }
        
        // Set fallback data if API fails
        setHoldings(fallbackHoldings);
        setHoldingsLoading(false);
      });
  };

  // Function to refresh orders
  const refreshOrders = () => {
    console.log("🔄 Refreshing orders for user:", user?.userId);
    setOrdersLoading(true);
    
    // Get authentication data
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    const headers = {};
    
    // Add authentication headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userData) {
      headers['x-user-data'] = encodeURIComponent(userData);
    }
    
    // Use the API endpoint with credentials
    fetch(getApiUrl('/api/orders'), {
      credentials: 'include',
      headers
    })
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ Orders fetched successfully:", data.orders);
          setOrders(data.orders || []);
        } else {
          console.error("❌ API returned error:", data.message);
          // Fallback to mock data
          setOrders([
            { name: "TCS", qty: 10, price: 3194.8, mode: "BUY", timestamp: new Date().toISOString() },
            { name: "RELIANCE", qty: 5, price: 2112.4, mode: "SELL", timestamp: new Date(Date.now() - 3600000).toISOString() },
          ]);
        }
        setOrdersLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch orders:", err);
        // Set fallback data if API fails
        setOrders([
          { name: "TCS", qty: 10, price: 3194.8, mode: "BUY", timestamp: new Date().toISOString() },
          { name: "RELIANCE", qty: 5, price: 2112.4, mode: "SELL", timestamp: new Date(Date.now() - 3600000).toISOString() },
        ]);
        setOrdersLoading(false);
      });
  };

  // Mock data for components that still use this context
  const mockData = {
    user: user || { username: "User", email: "user@example.com", userId: "default" },
    logout,
    collapsed,
    setCollapsed,
    currentPage,
    setCurrentPage,
    holdings: holdings,
    holdingsLoading: holdingsLoading,
    usingFallbackData: usingFallbackData,
    refreshHoldings: refreshHoldings,
    refreshOrders: refreshOrders,
    orders: orders,
    ordersLoading: ordersLoading,
    openBuyWindow: handleOpenBuyWindow,
    closeBuyWindow: handleCloseBuyWindow,
    openSellWindow: handleOpenSellWindow,
    closeSellWindow: handleCloseSellWindow,
    selectedStock,
    setSelectedStock,
  };

  // Check authentication on mount
  useEffect(() => {
    console.log("�� Dashboard mounting - checking authentication...");
    
    // Monitor localStorage changes
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
      console.log(`🔍 localStorage.setItem called: ${key} = ${value ? value.substring(0, 20) + "..." : "null"}`);
      originalSetItem.apply(this, arguments);
    };
    
    localStorage.removeItem = function(key) {
      console.log(`🔍 localStorage.removeItem called: ${key}`);
      originalRemoveItem.apply(this, arguments);
    };
    
    // Add a longer delay to ensure localStorage is properly set
    const checkAuth = () => {
      // First check URL parameters for auth data
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const urlUser = urlParams.get('user');
      const urlIsLoggedIn = urlParams.get('isLoggedIn');
      
      console.log("🔍 URL Parameters Check:", {
        token: urlToken ? "EXISTS" : "MISSING",
        tokenValue: urlToken ? urlToken.substring(0, 20) + "..." : "N/A",
        userData: urlUser ? "EXISTS" : "MISSING",
        isLoggedIn: urlIsLoggedIn
      });
      
      let token, userData, isLoggedIn;
      
      // If auth data is in URL, store it in localStorage and clean URL
      if (urlToken && urlUser && urlIsLoggedIn === 'true') {
        console.log("✅ Found auth data in URL, storing in localStorage...");
        localStorage.setItem('token', urlToken);
        localStorage.setItem('user', urlUser);
        localStorage.setItem('isLoggedIn', urlIsLoggedIn);
        
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Use the URL data
        token = urlToken;
        userData = urlUser;
        isLoggedIn = urlIsLoggedIn;
      } else {
        // Fall back to localStorage
        token = localStorage.getItem('token');
        userData = localStorage.getItem('user');
        isLoggedIn = localStorage.getItem('isLoggedIn');
        
        console.log("🔍 localStorage Check:", { 
          token: token ? "EXISTS" : "MISSING", 
          tokenValue: token ? token.substring(0, 20) + "..." : "N/A",
          userData: userData ? "EXISTS" : "MISSING", 
          isLoggedIn 
        });
      }
      
      if (token && userData && isLoggedIn === 'true') {
        try {
          const user = JSON.parse(userData);
          console.log("✅ Parsed user data:", user);
          
          // Check if user has required fields
          if (!user.id || !user.name) {
            throw new Error("User data missing required fields");
          }
          
          mockData.user = { 
            userId: user.id, 
            username: user.name,
            email: user.email,
            clientCode: user.clientCode,
            id: user.id // Keep both for compatibility
          };
          console.log("✅ User authenticated and set:", { 
            userId: user.id, 
            username: user.name,
            email: user.email 
          });
          
          // Update the actual user state
          setUser({
            userId: user.id, 
            username: user.name,
            email: user.email,
            clientCode: user.clientCode,
            id: user.id
          });
        } catch (error) {
          console.error("❌ Error parsing user data:", error);
          // Clear invalid data and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          setTimeout(() => {
            console.log("🔄 Redirecting to frontend due to parsing error");
            window.location.href = "http://localhost:5173";
          }, 2000);
        }
      } else {
        console.log("❌ No valid authentication found, redirecting to frontend");
        console.log("Missing:", {
          token: !token,
          userData: !userData,
          isLoggedIn: isLoggedIn !== 'true'
        });
        // Redirect to frontend if not logged in
        setTimeout(() => {
          console.log("🔄 Redirecting to frontend due to missing auth");
          window.location.href = FRONTEND_URL;
        }, 2000);
      }
    };

    // Check auth after a longer delay to ensure localStorage is set
    setTimeout(checkAuth, 1000);
  }, []);

  // Fetch holdings and orders on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshHoldings();
      refreshOrders();
    }
  }, [user]);
  
  // Precompute holdings with P&L whenever holdings or real-time prices change
  useEffect(() => {
    if (!holdings || holdings.length === 0) {
      setHoldingsWithPnL([]);
      return;
    }
    
    const enrichedHoldings = holdings.map(stock => {
      // Use real-time price if available, otherwise use stored price
      const currentPrice = realTimePrices[stock.name] || stock.price;
      const curValue = currentPrice * stock.qty;
      const investedValue = stock.avg * stock.qty;
      const profit = curValue - investedValue;
      const profitPercent = investedValue > 0 ? (profit / investedValue) * 100 : 0;
      
      return {
        ...stock,
        currentPrice,
        curValue,
        profit,
        profitPercent
      };
    });
    
    setHoldingsWithPnL(enrichedHoldings);
  }, [holdings, realTimePrices]);
  
  // WebSocket connection for real-time price updates
  useEffect(() => {
    if (!holdings || holdings.length === 0) return;
    
    console.log('GeneralContext: Setting up WebSocket for real-time prices');
    
    // Initialize socket connection
    socketRef.current = io(WS_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
    
    const socket = socketRef.current;
    
    // Connection events
    socket.on('connect', () => {
      console.log('GeneralContext: WebSocket connected');
      setIsSocketConnected(true);
      
      // Request initial data
      setTimeout(() => {
        socket.emit('requestStockUpdate');
      }, 1000);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('GeneralContext: WebSocket disconnected:', reason);
      setIsSocketConnected(false);
    });
    
    socket.on('connect_error', (error) => {
      console.error('GeneralContext: WebSocket connection error:', error);
      setIsSocketConnected(false);
    });
    
    // Listen for individual stock updates
    socket.on('stockUpdate', (stock) => {
      const holdingStock = holdings.find(h => h.name === stock.symbol || h.name === stock.name);
      if (holdingStock) {
        setRealTimePrices(prev => ({
          ...prev,
          [holdingStock.name]: stock.price
        }));
      }
    });
    
    // Listen for bulk updates
    socket.on('bulkStockUpdate', (stocks) => {
      const updates = {};
      stocks.forEach(stock => {
        const holdingStock = holdings.find(h => h.name === stock.symbol || h.name === stock.name);
        if (holdingStock) {
          updates[holdingStock.name] = stock.price;
        }
      });
      
      if (Object.keys(updates).length > 0) {
        setRealTimePrices(prev => ({ ...prev, ...updates }));
      }
    });
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [holdings]);

  // Show loading screen while checking authentication
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        🔐 Checking authentication...
      </div>
    );
  }

  return (
    <GeneralContext.Provider value={{
      user,
      holdings: holdingsWithPnL.length > 0 ? holdingsWithPnL : holdings, // Use enriched holdings if available
      rawHoldings: holdings, // Provide original holdings as well
      holdingsLoading,
      orders,
      ordersLoading,
      refreshHoldings,
      refreshOrders,
      openBuyWindow: handleOpenBuyWindow,
      closeBuyWindow: handleCloseBuyWindow,
      openSellWindow: handleOpenSellWindow,
      closeSellWindow: handleCloseSellWindow,
      selectedStock,
      setSelectedStock,
      realTimePrices,
      isSocketConnected,
      usingFallbackData,
    }}>
      {children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
      {isSellWindowOpen && selectedSellStock && (
        <SellActionWindow stock={selectedSellStock} />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
