import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { holdings as fallbackHoldings } from "../data/data.jsx";

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
    
    // Use a fallback userId if user is not available
    const userId = user?.userId || user?.id || "default";
    console.log("🔍 Using userId:", userId);
    
    // First test the backend connection
    axios.get('http://localhost:3000/api/test')
      .then(() => {
        console.log("✅ Backend connection successful, testing database...");
        // Test database connection
        return axios.get('http://localhost:3000/api/test-db');
      })
      .then((dbRes) => {
        console.log("📊 Database status:", dbRes.data);
        if (!dbRes.data.connected) {
          throw new Error("Database not connected");
        }
        console.log("✅ Database connected, fetching holdings...");
        // Now fetch holdings
        return axios.get(`http://localhost:3000/allHoldings?userId=${userId}`);
      })
      .then((res) => {
        console.log("✅ Holdings fetched successfully:", res.data);
        setHoldings(res.data);
        setUsingFallbackData(false);
        setHoldingsLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch holdings:", err);
        console.error("Error details:", {
          message: err.message,
          code: err.code,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        });
        
        // Check if it's a network error (backend not running)
        if (err.code === 'ERR_NETWORK') {
          console.error("🔌 Network Error: Backend server is not running on http://localhost:3000");
          console.error("💡 Please start the backend server with: cd backend && npm start");
          setUsingFallbackData(true);
        } else if (err.response?.status === 500) {
          console.error("🔌 Server Error: Check if MongoDB is running");
          console.error("💡 Start MongoDB or check the database connection");
          setUsingFallbackData(true);
        }
        
        // Set fallback data if API fails
        setHoldings(fallbackHoldings);
        setHoldingsLoading(false);
      });
  };

  // Function to refresh orders (will be called by Orders component)
  const refreshOrders = () => {
    // This will be implemented by the Orders component
    console.log("Refresh orders called");
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
          window.location.href = "http://localhost:5173";
        }, 2000);
      }
    };

    // Check auth after a longer delay to ensure localStorage is set
    setTimeout(checkAuth, 1000);
  }, []);

  // Fetch holdings on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshHoldings();
    }
  }, [user]);

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
      holdings,
      holdingsLoading,
      openBuyWindow: handleOpenBuyWindow,
      closeBuyWindow: handleCloseBuyWindow,
      openSellWindow: handleOpenSellWindow,
      closeSellWindow: handleCloseSellWindow,
      selectedStock,
      setSelectedStock,
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
