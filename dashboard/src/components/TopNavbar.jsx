import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  Bell, 
  Search, 
  LogOut, 
  User,
  TrendingUp,
  TrendingDown,
  Menu,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import Settings from "./Settings";

const mainNav = [
  { label: "Stocks", href: "#" },
  { label: "F&O", href: "#" },
  { label: "Mutual Funds", href: "#" },
];
const sectionNav = [
  { label: "Dashboard", to: "/" },
  { label: "Orders", to: "/orders" },
  { label: "Holdings", to: "/holdings" },
  { label: "Positions", to: "/positions" },
  { label: "Portfolio Analytics", to: "/portfolio" },
  { label: "Watchlist", to: "/watchlist" },
  { label: "Settings", to: "/settings" },
];

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const avatarRef = useRef();

  // Close settings dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    }
    if (settingsOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [settingsOpen]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  // Mock market data
  const marketIndices = [
    { name: "NIFTY", value: "25,461.0", change: "+55.7", percent: "+0.22%", isPositive: true },
    { name: "SENSEX", value: "83,432.89", change: "+193.42", percent: "+0.23%", isPositive: true },
    { name: "BANKNIFTY", value: "57,031.9", change: "+239.95", percent: "+0.42%", isPositive: true },
  ];

  // Helper for avatar initials
  const getInitials = () => {
    if (user?.username) {
      return user.username.split(" ").map((n) => n[0]).join("").toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      {/* Main nav row */}
      <div className="flex items-center justify-between px-8 py-3">
        {/* Left: Logo + Main Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-display font-semibold text-xl text-gray-900">Stocks</span>
          </div>
          <nav className="hidden md:flex gap-6">
            {mainNav.map((item) => (
              <a key={item.label} href={item.href} className="text-gray-700 font-medium hover:text-primary-600 transition-colors">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        {/* Right: Search, Bell, Profile */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search Groww..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="5"/><path d="m15 15-3.5-3.5"/></svg>
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 select-none">Ctrl+K</span>
          </div>
          {/* Notification Bell */}
          <NotificationBell />
          {/* Profile Avatar */}
          <div className="relative" ref={avatarRef}>
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              onClick={() => setSettingsOpen((o) => !o)}
              aria-label="Open profile settings"
            >
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg border border-gray-200">
                {getInitials()}
              </div>
              <ChevronDown className="text-gray-400" size={18} />
            </button>
            {/* Settings Dropdown/Modal */}
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-[420px] max-w-xs bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
                <Settings />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Section nav row: Main app navigation */}
      <nav className="flex gap-8 px-8 pb-2 border-b border-gray-100">
        {sectionNav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `pb-2 text-base font-medium border-b-2 transition-all ${
                isActive
                  ? "border-primary-600 text-primary-700"
                  : "border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-300"
              }`
            }
            end={item.to === "/"}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default TopNavbar; 