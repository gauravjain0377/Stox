import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth here
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
import ProfileSettings from './components/ProfileSettings';
import ProfileDetails from './components/ProfileDetails';
import ProfileOverview from './components/ProfileOverview';
import ProfileEdit from './components/ProfileEdit';
import AllStocks from './components/AllStocks';
import { SidebarProvider } from './context/SidebarContext';
import ContactSupport from './components/ContactSupport';
import Faqs from './components/Faqs';

// ⬇️ MOVED ProtectedRoute OUTSIDE of the App component ⬇️
// This ensures it's the same component on every render.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
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
    // Note: A full page redirect is generally not ideal in a single-page app.
    // Consider using the Navigate component from react-router-dom for client-side navigation.
    window.location.href = 'http://localhost:5173/login';
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  return children;
};

// Sets document.title based on current route
const TitleManager = () => {
  const location = useLocation();

  const resolveTitle = (pathname) => {
    // Exact matches first
    const exactMap = {
      '/': 'Dashboard',
      '/orders': 'Orders',
      '/holdings': 'Holdings',
      '/positions': 'Positions',
      '/portfolio': 'Analytics',
      '/watchlist': 'Watchlist',
      '/settings': 'Settings',
      '/support/contact': 'Support',
      '/support/faqs': 'FAQs & Guides',
      '/all-stocks': 'All Stocks'
    };

    if (exactMap[pathname]) return exactMap[pathname];

    // Prefix-based routes
    if (pathname.startsWith('/orders/')) return 'Order Details';
    if (pathname.startsWith('/profile/')) return 'Profile';
    if (pathname.startsWith('/stock/')) return 'Stock Detail';

    return 'Dashboard';
  };

  const section = resolveTitle(location.pathname);
  document.title = `StockSathi | ${section}`;
  return null;
};

function App() {
  return (
    // The order of providers here is now correct. AuthProvider wraps ProtectedRoute.
    <AuthProvider>
      <SidebarProvider>
        <ThemeProvider>
          <GeneralContextProvider>
            <Router>
              <Routes>
                {/* Wrap all protected routes inside a single Route element */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TitleManager />
                        <Routes>
                          <Route path="/" element={<ModernSummary />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/holdings" element={<Holdings />} />
                          <Route path="/positions" element={<Positions />} />
                          <Route path="/portfolio" element={<PortfolioAnalytics />} />
                          <Route path="/watchlist" element={<PersonalWatchlist />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/orders/:orderId" element={<OrderDetail />} />
                          <Route path="/profile/settings" element={<ProfileSettings />} />
                          <Route path="/support/contact" element={<ContactSupport />} />
                          <Route path="/support/faqs" element={<Faqs />} />
                          <Route path="/bank-details" element={<Navigate to="/profile/settings?tab=bank" replace />} />
                          <Route path="/reports" element={<Navigate to="/profile/settings?tab=reports" replace />} />
                          <Route path="/support" element={<Navigate to="/profile/settings?tab=support" replace />} />
                          <Route path="/profile/details" element={<ProfileDetails />} />
                          <Route path="/profile/overview" element={<ProfileOverview />} />
                          <Route path="/profile/edit" element={<ProfileEdit />} />
                          <Route path="/stock/:symbol" element={<StockDetail />} />
                          <Route path="/all-stocks" element={<AllStocks />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                {/* You can add public routes (like login/signup) here if needed */}
              </Routes>
            </Router>
          </GeneralContextProvider>
        </ThemeProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;