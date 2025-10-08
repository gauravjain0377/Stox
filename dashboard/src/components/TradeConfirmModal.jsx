import React, { useState, useEffect } from 'react';

const TradeConfirmModal = ({
  isOpen,
  type = 'buy', // 'buy' | 'sell'
  name,
  symbol,
  price,
  quantity,
  isConnected,
  changeAbs, // number | undefined
  changePercent, // number | string | undefined
  isDown, // boolean | undefined
  note, // optional note/description paragraph
  processing = false,
  onCancel,
  onConfirm,
}) => {
  const [adjustedQuantity, setAdjustedQuantity] = useState(quantity);

  // Update adjusted quantity when the initial quantity changes
  useEffect(() => {
    setAdjustedQuantity(quantity);
  }, [quantity]);

  if (!isOpen) return null;

  const isBuy = type === 'buy';

  const headerGradient = isBuy
    ? 'bg-gradient-to-r from-green-500 to-green-600'
    : 'bg-gradient-to-r from-red-500 to-red-600';
  const total = (Number(price) || 0) * (Number(adjustedQuantity) || 0);
  const totalLabel = isBuy ? 'Total Cost' : 'Total Proceeds';
  
  const handleIncrement = () => {
    setAdjustedQuantity(prev => Number(prev) + 1);
  };
  
  const handleDecrement = () => {
    setAdjustedQuantity(prev => Math.max(1, Number(prev) - 1));
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setAdjustedQuantity(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className={`px-6 py-4 ${headerGradient} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isBuy ? 'bg-green-400' : 'bg-red-400'}`}>
                {isBuy ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {isBuy ? 'Confirm Purchase' : 'Confirm Sale'}
                </h3>
                <p className="text-sm opacity-90">
                  {isBuy ? 'Review your buy order' : 'Review your sell order'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          {/* Optional Note */}
          {note && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800">
              {note}
            </div>
          )}

          {/* Stock Information */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-lg text-gray-900">{name}</h4>
                <p className="text-sm text-gray-500">{symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">₹{Number(price || 0).toLocaleString()}</p>
                {(typeof changeAbs === 'number' && changePercent !== undefined) && (
                  <p className={`text-sm font-medium ${isDown ? 'text-red-600' : 'text-green-600'}`}>
                    {changeAbs !== 0 ? `${changeAbs < 0 ? '' : '+'}${changeAbs.toFixed(2)}` : '0.00'}{' '}
                    ({typeof changePercent === 'number' ? `${isDown ? '-' : '+'}${changePercent.toFixed(2)}%` : `${changePercent}%`})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Order Type</span>
              <span className={`font-bold ${isBuy ? 'text-green-600' : 'text-red-600'}`}>
                {isBuy ? 'BUY' : 'SELL'} ORDER
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Quantity</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleDecrement}
                  disabled={adjustedQuantity <= 1 || processing}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  value={adjustedQuantity}
                  onChange={handleQuantityChange}
                  disabled={processing}
                  className="w-16 text-center border border-gray-300 rounded-md py-1 px-2 font-bold text-gray-900"
                  min="1"
                />
                <button 
                  onClick={handleIncrement}
                  disabled={processing}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <span className="font-medium text-gray-500">{Number(adjustedQuantity) === 1 ? 'share' : 'shares'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Price per share</span>
              <span className="font-bold text-gray-900">₹{Number(price || 0).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-3 bg-gray-50 rounded-lg px-4">
              <span className="text-gray-900 font-bold text-lg">{totalLabel}</span>
              <span className={`font-bold text-xl ${isBuy ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Number(total).toLocaleString()}
              </span>
            </div>

            {/* Market Status */}
            {typeof isConnected !== 'undefined' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-blue-800 text-sm font-medium">
                    {isConnected ? 'Live Market Price' : 'Market Closed - Using Last Price'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(adjustedQuantity)}
            disabled={processing}
            className={`flex-1 px-4 py-3 rounded-lg text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isBuy ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              `Confirm ${isBuy ? 'Purchase' : 'Sale'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeConfirmModal;
