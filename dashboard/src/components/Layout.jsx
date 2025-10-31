import React from "react";
import SidebarWatchlist from "./SidebarWatchlist";
import TopNavbar from "./TopNavbar";
import { useSidebar } from '../context/SidebarContext';
import { Eye } from "lucide-react";

const Layout = ({ children }) => {
  const { collapsed, toggleSidebar } = useSidebar();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile bottom navigation - only visible on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">
          <a href="/" className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-blue-600">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span>Dashboard</span>
          </a>
          <a href="/orders" className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-blue-600">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span>Orders</span>
          </a>
          <a href="/holdings" className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-blue-600">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Holdings</span>
          </a>
          <a href="/positions" className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-blue-600">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span>Positions</span>
          </a>
          <a href="/portfolio" className="flex flex-col items-center px-3 py-1 text-xs text-gray-600 hover:text-blue-600">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span>Analytics</span>
          </a>
        </div>
      </div>

      {/* Floating Watchlist Button for Mobile */}
      <button 
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white z-40"
        onClick={toggleSidebar}
      >
        <Eye size={24} />
      </button>

      {/* Left: Collapsible Watchlist Sidebar */}
      {/* On mobile, sidebar is hidden by default and shown when toggled */}
      <div className={`${collapsed ? 'hidden md:block' : 'block fixed inset-0 z-50 md:static md:z-auto'} md:block`}>
        <SidebarWatchlist />
      </div>

      {/* Main Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${collapsed ? 'ml-0' : ''}`}>
        {/* Top Navbar */}
        <TopNavbar />
        {/* Main Content - with padding bottom for mobile navigation */}
        <main className="flex-1 overflow-hidden pb-16 md:pb-0">
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;