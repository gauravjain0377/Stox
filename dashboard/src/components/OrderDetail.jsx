import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock order data for demonstration
const mockOrders = [
  {
    _id: '1',
    name: 'Tata Power Company',
    qty: 1,
    price: 400.05,
    avgPrice: 400.05,
    mktPrice: 401.00,
    mode: 'BUY',
    type: 'Delivery',
    subtype: 'Regular',
    market: 'NSE',
    exchange: 'NSE',
    duration: 'Day',
    timestamp: '2024-02-05T11:34:00',
    status: 'Executed',
    statusSteps: [
      {
        label: 'Request Verified',
        time: '11:34 AM, 05 Feb',
        id: 'GMK240205113417B1BCFV38BQUC',
        copy: true
      },
      {
        label: 'Order Placed with NSE',
        time: '11:34 AM, 05 Feb',
        id: '1300000024858111',
        copy: true
      },
      {
        label: 'Order Executed',
        time: '11:34 AM, 05 Feb',
        id: '',
        copy: false
      }
    ],
    trades: [
      { time: '11:34:17 AM', price: 400.05, qty: 1, amount: 400.05 }
    ]
  },
  // Mock SELL order
  {
    _id: '2',
    name: 'Infosys Ltd',
    qty: 2,
    price: 1500.00,
    avgPrice: 1498.50,
    mktPrice: 1501.00,
    mode: 'SELL',
    type: 'Delivery',
    subtype: 'Regular',
    market: 'NSE',
    exchange: 'NSE',
    duration: 'Day',
    timestamp: '2024-02-06T10:15:00',
    status: 'Executed',
    statusSteps: [
      {
        label: 'Request Verified',
        time: '10:15 AM, 06 Feb',
        id: 'GMK240206101517B1BCFV38BQUC',
        copy: true
      },
      {
        label: 'Order Placed with NSE',
        time: '10:15 AM, 06 Feb',
        id: '1300000024858222',
        copy: true
      },
      {
        label: 'Order Executed',
        time: '10:15 AM, 06 Feb',
        id: '',
        copy: false
      }
    ],
    trades: [
      { time: '10:15:17 AM', price: 1500.00, qty: 2, amount: 3000.00 }
    ]
  }
];

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [copiedIdx, setCopiedIdx] = useState(null);
  // Select order by orderId from params
  const order = mockOrders.find(o => o._id === orderId) || mockOrders[0];

  // Use the selected order's statusSteps for the timeline
  const statusSteps = order.statusSteps.map(step => ({
    label: step.label,
    completed: true, // All steps are completed for demo; adjust if you want partial completion
    time: step.time,
  }));

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
              <div>₹{order.price}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Avg Price</div>
              <div>₹{order.avgPrice}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-0.5">Mkt Price</div>
              <div>₹{order.mktPrice}</div>
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
          <div className="text-right text-base text-gray-700 font-medium mt-1">Order Value <span className="text-gray-900">₹{order.price}</span></div>
        </div>
        {/* Order Status Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-10 flex flex-col gap-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-medium text-gray-800 tracking-tight">Order Status</span>
            <span className="ml-auto text-green-600 font-medium flex items-center gap-1">
              Executed
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#34D399"/><path d="M8 12.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
              {order.trades.map((trade, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-3 text-sm text-gray-700">{trade.time}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">₹{trade.price}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{trade.qty}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">₹{trade.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 