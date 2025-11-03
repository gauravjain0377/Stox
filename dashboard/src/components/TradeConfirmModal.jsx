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
  currentShares = 0, // Current shares owned (for sell validation)
}) => {
  const [adjustedQuantity, setAdjustedQuantity] = useState(quantity);
  const [error, setError] = useState('');
  const isBuy = type === 'buy';

  // Function to validate quantity (defined before useEffect)
  const validateQuantity = (value) => {
    if (!isBuy && value > currentShares) {
      setError(`You don't have enough shares. Maximum available: ${currentShares} shares.`);
      return false;
    }
    setError('');
    return true;
  };

  // Update adjusted quantity when the initial quantity changes
  useEffect(() => {
    setAdjustedQuantity(quantity);
    validateQuantity(quantity);
  }, [quantity, currentShares, isBuy]);

  if (!isOpen) return null;

  const total = (Number(price) || 0) * (Number(adjustedQuantity) || 0);
  const totalLabel = isBuy ? 'Total Cost' : 'Total Proceeds';
  
  const handleIncrement = () => {
    const newValue = Number(adjustedQuantity) + 1;
    if (validateQuantity(newValue)) {
      setAdjustedQuantity(newValue);
    }
  };
  
  const handleDecrement = () => {
    const newValue = Math.max(1, Number(adjustedQuantity) - 1);
    validateQuantity(newValue);
    setAdjustedQuantity(newValue);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      validateQuantity(value);
      setAdjustedQuantity(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-2 sm:mx-4 my-4 overflow-hidden border border-gray-200 max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                {isBuy ? (
                  <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {isBuy ? 'Confirm Purchase' : 'Confirm Sale'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">
                  {isBuy ? 'Review your buy order details' : 'Review your sell order details'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 sm:p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors flex-shrink-0 ml-2"
              aria-label="Close"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body - Horizontal Layout */}
        <div className="px-4 sm:px-8 py-4 sm:py-7">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
            {/* Left Column - Stock Info */}
            <div className="lg:w-1/2">
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">Stock Details</h4>
                
                <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 sm:pb-5 border-b border-gray-200">
                  <div className="min-w-0 flex-1 mr-2">
                    <h5 className="font-bold text-base sm:text-xl text-gray-900 truncate">{name}</h5>
                    <p className="text-sm sm:text-base text-gray-600 truncate">{symbol}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-lg sm:text-2xl text-gray-900">₹{Number(price || 0).toLocaleString()}</p>
                    {(typeof changeAbs === 'number' && changePercent !== undefined) && (
                      <p className={`text-sm font-medium mt-1 ${isDown ? 'text-amber-600' : 'text-blue-600'}`}>
                        {changeAbs !== 0 ? `${changeAbs < 0 ? '' : '+'}${changeAbs.toFixed(2)}` : '0.00'}{' '}
                        ({typeof changePercent === 'number' ? `${isDown ? '-' : '+'}${changePercent.toFixed(2)}%` : `${changePercent}%`})
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-600 text-xs sm:text-sm">Order Type</p>
                    <p className="font-bold text-sm sm:text-lg mt-1">{isBuy ? 'Buy Order' : 'Sell Order'}</p>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-600 text-xs sm:text-sm">Price per Share</p>
                    <p className="font-bold text-sm sm:text-lg mt-1">₹{Number(price || 0).toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-600 text-xs sm:text-sm">Available Shares</p>
                    <p className="font-bold text-sm sm:text-lg mt-1">{!isBuy ? currentShares : '-'}</p>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-600 text-xs sm:text-sm">Market Status</p>
                    <p className={`font-bold text-sm sm:text-lg mt-1 ${isConnected ? 'text-blue-600' : 'text-gray-500'}`}>
                      {isConnected ? 'Live' : 'Delayed'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Optional Note */}
              {note && (
                <div className="mt-6 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-amber-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-amber-800">
                      {note}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column - Order Details */}
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200 h-full">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">Order Summary</h4>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Quantity</label>
                    <div className="flex items-center justify-center space-x-0">
                      {/* Minus button integrated with input */}
                      <button 
                        onClick={handleDecrement}
                        disabled={adjustedQuantity <= 1 || processing}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-l-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 shadow-sm -mr-px z-10"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      {/* Input field with integrated buttons */}
                      <input
                        type="number"
                        value={adjustedQuantity}
                        onChange={handleQuantityChange}
                        disabled={processing}
                        className={`w-20 sm:w-24 h-12 sm:h-14 text-center border-y border-gray-200 font-bold text-base sm:text-xl bg-white shadow-sm ${error ? 'border-red-300 text-red-600' : 'border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent z-0`}
                        min="1"
                      />
                      
                      {/* Plus button integrated with input */}
                      <button 
                        onClick={handleIncrement}
                        disabled={processing || (!isBuy && adjustedQuantity >= currentShares)}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-r-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 shadow-sm -ml-px z-10"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {error && (
                      <div className="mt-3 text-sm text-red-600 font-medium bg-red-50 px-4 py-3 rounded-xl flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-gray-700 font-medium text-sm sm:text-base">Subtotal</span>
                      <span className="font-bold text-base sm:text-lg">₹{Number(price || 0).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-gray-700 font-medium text-sm sm:text-base">Quantity</span>
                      <span className="font-bold text-base sm:text-lg">x {adjustedQuantity}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                      <span className="text-gray-900 font-bold text-base sm:text-xl">{totalLabel}</span>
                      <span className="font-bold text-lg sm:text-2xl text-blue-600">
                        ₹{Number(total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={onCancel}
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm text-sm sm:text-base"
                      disabled={processing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => onConfirm(adjustedQuantity)}
                      disabled={processing || error !== ''}
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-100 text-sm sm:text-base"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                          <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeConfirmModal;