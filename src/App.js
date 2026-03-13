import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

// Context Providers that need router
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Routes
import AppRoutes from './routes';

// Components
import ErrorBoundary from './components/common/ErrorBoundary';
import ShoppingCart from './components/shop/ShoppingCart';
import { useCart } from './hooks/useCart';

// Styles
import './index.css';

// Inner component to access cart context (must be inside providers)
const AppContent = () => {
  const { cartOpen, setCartOpen } = useCart();

  return (
    <>
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        icon={true}
      />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
     <HashRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {/* All providers and AppContent */}
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;