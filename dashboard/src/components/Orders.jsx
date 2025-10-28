import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGeneralContext } from "./GeneralContext";
import { useNavigate } from 'react-router-dom';

function groupOrdersByDate(orders) {
  return orders.reduce((acc, order) => {
    const date = order.timestamp ? new Date(order.timestamp).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }) : 'Unknown Date';
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});
}

const Orders = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const { user, orders, ordersLoading, refreshOrders, openSellWindow, holdings } = useGeneralContext();
  const navigate = useNavigate();



  // Filtering logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      String(order.price).includes(search) ||
      String(order.qty).includes(search);
    const matchesType = typeFilter === "All" || order.mode === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group by date
  const grouped = groupOrdersByDate(filteredOrders);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  // Unique types for dropdown
  const uniqueTypes = ["All", ...Array.from(new Set(orders.map(o => o.mode)))];

  if (ordersLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="relative">
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8 bg-white"
          >
            {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      {sortedDates.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No orders found.</div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{date}</div>
              <div className="space-y-2">
                {grouped[date].map((order, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-4 hover:bg-gray-50 transition group"
                  >
  
                    <div 
                      className="flex flex-col min-w-0 flex-1 cursor-pointer" 
                      onClick={() => navigate(`/orders/${order._id || idx}`)}
                    >
                      <span className="font-semibold text-base text-gray-900 truncate">{order.name}</span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {order.mode?.toUpperCase() === 'BUY' ? 'BUY' : 'SELL'} Order
                        {order.market ? ` · ${order.market}` : ' Market'}
                        {order.type ? ` · ${order.type}` : ' · Regular'}
                      </span>
                    </div>
                    {/* Center: Qty and Price */}
                    <div 
                      className="flex flex-col items-end min-w-[100px] mr-8 cursor-pointer"
                      onClick={() => navigate(`/orders/${order._id || idx}`)}
                    >
                      <span className="text-sm text-gray-900 font-medium">{order.qty} <span className="text-xs text-gray-500 font-normal">Qty</span></span>
                      <span className="text-sm text-gray-900 font-medium">₹{order.price} <span className="text-xs text-gray-500 font-normal">Avg Price</span></span>
                    </div>
                    {/* Right: Time, status dot, action buttons */}
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="text-xs text-gray-500 mb-1">
                        {order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${order.status === 'in-progress' ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                        
                      
                        
                        <span 
                          className="text-gray-300 group-hover:text-gray-500 transition cursor-pointer"
                          onClick={() => navigate(`/orders/${order._id || idx}`)}
                        >
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;