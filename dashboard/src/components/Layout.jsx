console.log('SidebarWatchlist mounted');
console.log('Layout mounted');

import React from "react";
import SidebarWatchlist from "./SidebarWatchlist";
import TopNavbar from "./TopNavbar";

function getInitialCollapsed() {
  const saved = localStorage.getItem('sidebarCollapsed');
  if (saved === null || saved === "undefined") return false;
  try {
    return JSON.parse(saved);
  } catch {
    return false;
  }
}

const Layout = ({ children }) => {
  // Remove local collapsed state if using SidebarContext globally
  // const [collapsed, setCollapsed] = useState(getInitialCollapsed);
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