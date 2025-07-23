import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
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
import logo from '/public/images/logo.png'; // Use your logo path, or update if needed

const mainNav = [
  
];
const sectionNav = [
  { label: "Dashboard", to: "/" },
  { label: "Orders", to: "/orders" },
  { label: "Holdings", to: "/holdings" },
  { label: "Positions", to: "/positions" },
  { label: "Portfolio Analytics", to: "/portfolio" },
  { label: "Watchlist", to: "/watchlist" },
];

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    name: user?.username || user?.email || '',
    email: user?.email || ''
  });
  const [editProfileMsg, setEditProfileMsg] = useState('');
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

  const handleEditProfileOpen = () => {
    setEditProfileForm({
      name: user?.username || user?.email || '',
      email: user?.email || ''
    });
    setEditProfileMsg('');
    setShowEditProfile(true);
  };

  const handleEditProfileSave = (e) => {
    e.preventDefault();
    // Here you would call your backend API to update the profile
    setEditProfileMsg('Profile updated successfully!');
    setTimeout(() => setShowEditProfile(false), 1200);
  };

  return (
    <header className="bg-[#fafafa] border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      {/* Main nav row */}
      <div className="flex items-center justify-between px-8 py-3">
        {/* Left: Logo + Main Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full shadow-md object-cover" />
            <span className="font-display font-bold text-2xl text-[#222] tracking-tight">StockSathi</span>
          </div>
          {/* Removed duplicate nav links here */}
        </div>
        {/* Right: Search, Bell, Profile */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b] focus:border-[#00796b] transition-all duration-200 bg-[#f3f3f3] text-[#222]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 select-none">Ctrl+K</span>
          </div>
          {/* Notification Bell */}
          <NotificationBell />
          {/* Profile Avatar */}
          <div className="relative" ref={avatarRef}>
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#e0e7ef] transition-colors focus:outline-none"
              onClick={() => setSettingsOpen((o) => !o)}
              aria-label="Open profile settings"
            >
              <div className="w-9 h-9 rounded-full bg-[#e0e7ef] flex items-center justify-center text-[#00796b] font-bold text-lg border border-gray-200">
                {getInitials()}
              </div>
              <ChevronDown className="text-gray-400" size={18} />
            </button>
            {/* Settings Dropdown/Modal */}
            {settingsOpen && (
              <div className="profile-dropdown-card profile-dropdown-compact absolute right-0 mt-2 w-80 z-50 bg-white shadow-lg rounded-xl border border-gray-100">
                <div className="profile-dropdown-header-compact">
                  <div>
                    <Link to="/profile/overview" className="profile-dropdown-name text-left font-semibold text-base text-primary-900 hover:underline block" style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
                      {user?.username || user?.email || 'User'}
                    </Link>
                    <div className="profile-dropdown-email text-left text-xs text-gray-500 block" style={{background:'none',border:'none',padding:0}}>
                      {user?.email}
                    </div>
                  </div>
                  <button className="profile-dropdown-settings-btn" title="Profile Settings">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l2 2"/></svg>
                  </button>
                </div>
                <div className="profile-dropdown-divider"></div>
                <div className="profile-dropdown-links-compact">
                  <Link to="/orders" className="profile-dropdown-link-compact" onClick={() => setSettingsOpen(false)}>
                    <span className="profile-dropdown-link-icon">📄</span>
                    <span className="profile-dropdown-link-title">All Orders</span>
                    <span className="profile-dropdown-link-arrow">›</span>
                  </Link>
                  <Link to="/profile/edit" className="profile-dropdown-link-compact" onClick={() => setSettingsOpen(false)}>
                    <span className="profile-dropdown-link-icon">👤</span>
                    <span className="profile-dropdown-link-title">Edit Profile</span>
                    <span className="profile-dropdown-link-arrow">›</span>
                  </Link>
                  <Link to="/profile/settings?tab=privacy" className="profile-dropdown-link-compact" onClick={() => setSettingsOpen(false)}>
                    <span className="profile-dropdown-link-icon">🔒</span>
                    <span className="profile-dropdown-link-title">Privacy & Security</span>
                    <span className="profile-dropdown-link-arrow">›</span>
                  </Link>
                  <Link to="/profile/settings?tab=support" className="profile-dropdown-link-compact" onClick={() => setSettingsOpen(false)}>
                    <span className="profile-dropdown-link-icon">❓</span>
                    <span className="profile-dropdown-link-title">Help & Support</span>
                    <span className="profile-dropdown-link-arrow">›</span>
                  </Link>
                </div>
                <div className="profile-dropdown-footer-compact">
                  <button className="profile-dropdown-logout-compact" onClick={handleLogout}>Log out</button>
                </div>
              </div>
            )}
            {/* Edit Profile Modal */}
            {showEditProfile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowEditProfile(false)}>&times;</button>
                  <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
                  <form onSubmit={handleEditProfileSave} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={editProfileForm.name}
                        onChange={e => setEditProfileForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={editProfileForm.email}
                        onChange={e => setEditProfileForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-800 transition"
                    >
                      Save Changes
                    </button>
                    {editProfileMsg && <div className="text-green-600 text-center mt-2">{editProfileMsg}</div>}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Section nav row: Main app navigation */}
      <nav className="flex gap-8 px-8 pb-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {sectionNav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `text-base font-medium transition-all duration-200 px-3 py-1 rounded-lg ${
                isActive
                  ? "bg-[#e0e7ef] text-[#00796b] shadow-sm"
                  : "text-[#222] hover:text-[#00796b] hover:bg-[#e0e7ef]"
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