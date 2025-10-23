// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5174';
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

// Helper function to get full API endpoint
export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

// WebSocket URL (same as API_URL for Socket.IO)
export const WS_URL = API_URL;
