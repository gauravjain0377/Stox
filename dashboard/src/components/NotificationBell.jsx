import React, { useState, useRef, useEffect } from "react";
import { Bell, TrendingUp, TrendingDown, Star, X } from "lucide-react";

// Example stock market notifications
const mockNotifications = [
  {
    id: 1,
    title: "INFY up 2.1%",
    message: "Infosys surged after strong Q1 results.",
    type: "up",
    time: "2m ago",
  },
  {
    id: 2,
    title: "TCS hits 52-week high",
    message: "TCS stock reached a new 52-week high today.",
    type: "star",
    time: "10m ago",
  },
  {
    id: 3,
    title: "ONGC down 1.2%",
    message: "ONGC slipped amid global oil price drop.",
    type: "down",
    time: "30m ago",
  },
  {
    id: 4,
    title: "WIPRO dividend announced",
    message: "Wipro declared a final dividend of ₹1/share.",
    type: "star",
    time: "1h ago",
  },
];

const iconMap = {
  up: <TrendingUp className="text-green-500" size={20} />,
  down: <TrendingDown className="text-red-500" size={20} />,
  star: <Star className="text-yellow-400" size={20} />,
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const bellRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={bellRef}>
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={() => setOpen((o) => !o)}
        aria-label="Show notifications"
      >
        <Bell className="text-gray-700" size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
            {unreadCount}
          </span>
        )}
      </button>
      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-xs bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-lg text-gray-900">Notifications</span>
            <button
              className="p-1 rounded hover:bg-gray-100"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Star size={36} className="mb-2 text-yellow-200" />
                <p className="font-medium">You're all caught up!</p>
                <p className="text-xs mt-1">No new stock notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-all">
                  <div className="flex-shrink-0 mt-1">
                    {iconMap[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-sm">{n.title}</span>
                      <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 