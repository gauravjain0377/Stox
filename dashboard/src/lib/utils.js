// Utility functions for the stock trading platform

/**
 * Determines if the Indian stock market is currently open
 * Market hours: 9:15 AM to 3:30 PM IST (Monday to Friday)
 * @returns {boolean} True if market is open, false otherwise
 */
export const isMarketOpen = () => {
  const now = new Date();
  const istOffset = 5.5 * 60; // IST is UTC+5:30
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istTime = new Date(utc + (istOffset * 60000));
  
  const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  
  // Check if it's a weekday (Monday to Friday)
  if (day === 0 || day === 6) {
    return false;
  }
  
  // Check if time is between 9:15 AM and 3:30 PM IST
  const currentTimeInMinutes = hours * 60 + minutes;
  const marketOpenTime = 9 * 60 + 15; // 9:15 AM in minutes
  const marketCloseTime = 15 * 60 + 30; // 3:30 PM in minutes
  
  return currentTimeInMinutes >= marketOpenTime && currentTimeInMinutes <= marketCloseTime;
};

/**
 * Determines if the display should show "Live" status
 * Display hours: 9:00 AM to 3:30 PM IST (Monday to Friday)
 * @returns {boolean} True if live status should be shown, false otherwise
 */
export const shouldShowLiveStatus = () => {
  const now = new Date();
  const istOffset = 5.5 * 60; // IST is UTC+5:30
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istTime = new Date(utc + (istOffset * 60000));
  
  const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  
  // Check if it's a weekday (Monday to Friday)
  if (day === 0 || day === 6) {
    return false;
  }
  
  // Check if time is between 9:00 AM and 3:30 PM IST
  const currentTimeInMinutes = hours * 60 + minutes;
  const displayOpenTime = 9 * 60; // 9:00 AM in minutes
  const displayCloseTime = 15 * 60 + 30; // 3:30 PM in minutes
  
  return currentTimeInMinutes >= displayOpenTime && currentTimeInMinutes <= displayCloseTime;
};

/**
 * Gets the current trading date
 * If after 3:30 PM, returns next trading day
 * @returns {Date} The current or next trading date
 */
export const getCurrentTradingDate = () => {
  const now = new Date();
  const istOffset = 5.5 * 60; // IST is UTC+5:30
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istTime = new Date(utc + (istOffset * 60000));
  
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentTimeInMinutes = hours * 60 + minutes;
  const marketCloseTime = 15 * 60 + 30; // 3:30 PM in minutes
  
  // If after 3:30 PM, move to next day
  if (currentTimeInMinutes > marketCloseTime) {
    istTime.setDate(istTime.getDate() + 1);
  }
  
  // Skip weekends
  const day = istTime.getDay();
  if (day === 0) { // Sunday
    istTime.setDate(istTime.getDate() + 1);
  } else if (day === 6) { // Saturday
    istTime.setDate(istTime.getDate() + 2);
  }
  
  return istTime;
};

/**
 * Formats a date as YYYY-MM-DD
 * @param {Date} date 
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Gets the storage key for today's market data
 * @returns {string} Storage key
 */
export const getMarketDataStorageKey = () => {
  const today = getCurrentTradingDate();
  return `marketData_${formatDate(today)}`;
};