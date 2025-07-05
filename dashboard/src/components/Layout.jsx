import React from "react";
import SidebarWatchlist from "./SidebarWatchlist";
import TopNavbar from "./TopNavbar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: Collapsible Watchlist Sidebar */}
      <SidebarWatchlist />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar />
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 