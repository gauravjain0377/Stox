import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  // 1. Initialize state by reading directly from localStorage ONCE.
  const [collapsed, setCollapsed] = useState(() => {
    // localStorage stores strings, so we check for the string 'true'.
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  // 2. This effect runs ONLY when the `collapsed` state changes, syncing it TO localStorage.
  // This prevents the feedback loop.
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
  }, [collapsed]);

  // 3. The toggle function now only needs to update the React state.
  // The useEffect above will handle saving it.
  const toggleSidebar = useCallback(() => {
    setCollapsed(prevCollapsed => !prevCollapsed);
  }, []);

  // We provide the state and the toggle function to the rest of the app.
  // The 'setCollapsed' function is no longer needed in the value.
  const value = { collapsed, toggleSidebar };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// This hook remains the same.
export const useSidebar = () => useContext(SidebarContext);