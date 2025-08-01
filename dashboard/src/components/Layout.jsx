console.log('SidebarWatchlist mounted');
console.log('Layout mounted');

import React from "react";
import SidebarWatchlist from "./SidebarWatchlist";
import TopNavbar from "./TopNavbar";
import { useSidebar } from '../context/SidebarContext';

const Layout = ({ children }) => {
  const { collapsed } = useSidebar();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: Collapsible Watchlist Sidebar */}
      <SidebarWatchlist />

      {/* Main Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${collapsed ? 'ml-0' : ''}`}>
        {/* Top Navbar */}
        <TopNavbar />
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 