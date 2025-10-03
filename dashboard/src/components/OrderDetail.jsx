import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details from backend
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Get authentication data
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        const headers = {};
        
        // Add authentication headers
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        if (userData) {
          headers['x-user-data'] = encodeURIComponent(userData);
        }
        
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
          credentials: 'include',
          headers
        });
        
        const data = await response.json();
        
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <button className="mb-8 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition" onClick={() => navigate(-1)}>
          <span className="text-lg">&larr;</span> Back
        </button>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 md:p-10">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 md:p-10">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <button className="mb-8 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition" onClick={() => navigate(-1)}>
          <span className="text-lg">&larr;</span> Back
        </button>
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 md:p-10 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Order Details</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show message if no order found
  if (!order) {
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <button className="mb-8 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition" onClick={() => navigate(-1)}>
          <span className="text-lg">&larr;</span> Back
        </button>
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 md:p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">The requested order could not be found.</p>
        </div>
      </div>
    );
  }

  // Use the order's statusSteps for the timeline
  const statusSteps = order.statusSteps ? order.statusSteps.map(step => ({
    label: step.label,
    completed: step.completed || true,
    time: step.time,
  })) : [];

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <button className="mb-8 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition" onClick={() => navigate(-1)}>
        <span className="text-lg">&larr;</span> Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 md:p-10 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-1">
            <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${order.mode === 'BUY' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{order.mode === 'BUY' ? 'BUY' : 'SELL'}</span>
            <span className="text-xs text-gray-400 ml-auto">Qty <span className="text-gray-700 font-medium">{order.qty}</span></span>
          </div>
          <div className="text-xl md:text-2xl font-medium text-gray-900 mb-1 tracking-tight">{order.name}</div>
          <div className="border-b border-dashed border-gray-200 mb-2"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-[15px] text-gray-700 mb-2">
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Order Type</div>
              <div>{order.type}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Market</div>
              <div>{order.market}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Exchange</div>
              <div>{order.exchange}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Order Price</div>
              <div>₹{order.price?.toLocaleString() || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Avg Price</div>
              <div>₹{(order.avgPrice || order.price)?.toLocaleString() || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Mkt Price</div>
              <div>₹{(order.mktPrice || order.price)?.toLocaleString() || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Subtype</div>
              <div>{order.subtype}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Duration</div>
              <div>{order.duration}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">{new Date(order.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-right text-base text-gray-700 font-medium mt-1">Order Value <span className="text-gray-900">₹{(order.orderValue || (order.price * order.qty)).toLocaleString()}</span></div>
        </div>
        {/* Order Status Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-10 flex flex-col gap-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-medium text-gray-800 tracking-tight">Order Status</span>
            <span className={`ml-auto font-medium flex items-center gap-1 ${
              order.status === 'Executed' ? 'text-green-600' : 
              order.status === 'Pending' ? 'text-yellow-600' : 
              order.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {order.status || 'Executed'}
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill={order.status === 'Executed' ? '#34D399' : '#9CA3AF'}/>
                <path d="M8 12.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          <div className="relative pl-12 py-8 h-full">
            {/* Vertical line: starts at center of first tick, ends at center of last */}
            <div
              className="absolute left-0 w-0.5 bg-gray-200 z-0"
              style={{
                top: '12px', // half of tick height
                bottom: '12px', // half of tick height
                height: 'auto',
              }}
            />
            <div className="flex flex-col justify-between h-full relative z-10">
              {statusSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-6 mb-10 last:mb-0">
                  {/* Timeline circle */}
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                      step.completed
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-gray-300'
                    }`}
                    style={{ marginLeft: '-12px' }}
                  >
                    {step.completed ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                        <path d="M8 12.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="w-3 h-3 rounded-full border-2 bg-white border-gray-300" />
                    )}
                  </span>
                  <div className="pl-8">
                    <div className="font-medium text-gray-800 text-sm mb-0.5">{step.label}</div>
                    {step.time && <div className="text-xs text-gray-500 mb-1">{step.time}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* List of Trades */}
      <div className="mt-12">
        <div className="font-medium text-base text-gray-800 mb-3">List of Trades</div>
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trade Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(order.trades && order.trades.length > 0) ? order.trades.map((trade, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-3 text-sm text-gray-700">{trade.time}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">₹{trade.price?.toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{trade.qty}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">₹{trade.amount?.toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No trades available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 