import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create the context
const SidebarContext = createContext();

// 2. Create the provider component
export const SidebarProvider = ({ children }) => {
  // Initialize state from localStorage, defaulting to 'true' (collapsed)
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    // If a value is saved in localStorage, use it; otherwise, default to true.
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  // Effect to save the state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // The value that will be supplied to any consuming components
  const value = { collapsed, toggleSidebar };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// 3. Custom hook to easily use the SidebarContext
export const useSidebar = () => useContext(SidebarContext);