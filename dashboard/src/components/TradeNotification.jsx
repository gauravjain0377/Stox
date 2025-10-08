import React, { useState, useEffect } from 'react';

const TradeNotification = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100 border-green-500',
          text: 'text-green-800',
          icon: '✅'
        };
      case 'error':
        return {
          bg: 'bg-red-100 border-red-500',
          text: 'text-red-800',
          icon: '❌'
        };
      default:
        return {
          bg: 'bg-blue-100 border-blue-500',
          text: 'text-blue-800',
          icon: 'ℹ️'
        };
    }
  };
  
  const { bg: bgColor, text: textColor, icon } = getStyles();

  return (
    <div 
      className={`fixed top-5 right-5 z-50 p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${bgColor} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      style={{ maxWidth: '400px' }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 text-xl">
          {icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TradeNotification;