import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaCalendarAlt, 
  FaShoppingBag, 
  FaGift, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUsers,
  FaBoxes,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isStaff } = useAuth();
  const location = useLocation();

  const getNavLinks = () => {
    const commonLinks = [
      { to: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
      { to: '/profile', icon: FaUser, label: 'Profile' },
    ];

    if (isAdmin) {
      return [
        ...commonLinks,
        { to: '/admin/users', icon: FaUsers, label: 'Users' },
        { to: '/admin/services', icon: FaClipboardList, label: 'Services' },
        { to: '/admin/products', icon: FaBoxes, label: 'Products' },
        { to: '/admin/gifts', icon: FaGift, label: 'Gift Packages' },
        { to: '/admin/appointments', icon: FaCalendarAlt, label: 'Appointments' },
        { to: '/admin/orders', icon: FaShoppingBag, label: 'Orders' },
        { to: '/admin/reports', icon: FaChartBar, label: 'Reports' },
        { to: '/admin/settings', icon: FaCog, label: 'Settings' },
      ];
    } else if (isStaff) {
      return [
        ...commonLinks,
        { to: '/staff/appointments', icon: FaCalendarAlt, label: 'My Appointments' },
        { to: '/staff/commissions', icon: FaChartBar, label: 'Commissions' },
        { to: '/staff/leave', icon: FaClipboardList, label: 'Leave' },
        { to: '/staff/availability', icon: FaCog, label: 'Availability' },
      ];
    } else {
      return [
        ...commonLinks,
        { to: '/my-appointments', icon: FaCalendarAlt, label: 'My Appointments' },
        { to: '/my-orders', icon: FaShoppingBag, label: 'My Orders' },
        { to: '/wishlist', icon: FaHeart, label: 'Wishlist' },
        { to: '/my-vouchers', icon: FaGift, label: 'My Vouchers' },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="dashboard-layout">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-accent-pink text-white p-2 rounded-lg"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <img 
                  src="/images/logo.png" 
                  alt="Tassel" 
                  className="h-10 w-auto"
                />
                <div>
                  <h2 className="font-bold text-primary-brown">Tassel Beauty</h2>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-accent-pink text-white' 
                          : 'text-text-dark hover:bg-secondary-beige'
                      }`}
                    >
                      <Icon className={isActive ? 'text-white' : 'text-primary-brown'} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-text-dark hover:bg-secondary-beige transition-colors mt-8"
                >
                  <FaSignOutAlt className="text-primary-brown" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="dashboard-main">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;