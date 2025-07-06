import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GeneralContextProvider } from './components/GeneralContext';
import Layout from './components/Layout';
import StockDetail from './components/StockDetail';
import ModernSummary from './components/ModernSummary';
import Holdings from './components/Holdings';
import Orders from './components/Orders';
import Positions from './components/Positions';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import Settings from './components/Settings';
import PersonalWatchlist from './components/PersonalWatchlist';
import OrderDetail from './components/OrderDetail';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  console.log('🔒 ProtectedRoute check:', { user: !!user, loading });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log('❌ No user found, redirecting to frontend login...');
    // Add a small delay to ensure AuthContext has processed URL parameters
    setTimeout(() => {
      window.location.href = 'http://localhost:5173/login';
    }, 100);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  console.log('✅ User authenticated, rendering dashboard');
  return children;
};

// Dashboard Layout Wrapper
const DashboardLayout = ({ children }) => (
  <ProtectedRoute>
    <GeneralContextProvider>
      <Layout>
        {children}
      </Layout>
    </GeneralContextProvider>
  </ProtectedRoute>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Dashboard Routes */}
              <Route path="/" element={
                <DashboardLayout>
                  <ModernSummary />
                </DashboardLayout>
              } />
              <Route path="/orders" element={
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              } />
              <Route path="/holdings" element={
                <DashboardLayout>
                  <Holdings />
                </DashboardLayout>
              } />
              <Route path="/positions" element={
                <DashboardLayout>
                  <Positions />
                </DashboardLayout>
              } />
              <Route path="/portfolio" element={
                <DashboardLayout>
                  <PortfolioAnalytics />
                </DashboardLayout>
              } />
              <Route path="/watchlist" element={
                <DashboardLayout>
                  <PersonalWatchlist />
                </DashboardLayout>
              } />
              <Route path="/settings" element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              } />
              <Route path="/orders/:orderId" element={
                <DashboardLayout>
                  <OrderDetail />
                </DashboardLayout>
              } />
              
              {/* Stock Detail Route */}
              <Route path="/stock/:symbol" element={
                <ProtectedRoute>
                  <StockDetail />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 