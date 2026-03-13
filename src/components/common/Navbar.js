import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaSpa, 
  FaShoppingBag, 
  FaGift, 
  FaInfoCircle, 
  FaEnvelope,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTachometerAlt
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/services', label: 'Services', icon: FaSpa },
    { to: '/shop', label: 'Shop', icon: FaShoppingBag },
    { to: '/gifts', label: 'Gifts', icon: FaGift },
    { to: '/about', label: 'About', icon: FaInfoCircle },
    { to: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={scrolled ? "/images/logo.png" : "/images/logo-white.png"} 
              alt="Tassel" 
              className="h-10 w-auto transition-all"
            />
            <span className={`font-bold text-xl hidden md:block ${
              scrolled ? 'text-primary-brown' : 'text-white'
            }`}>
              Tassel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-1 transition-colors ${
                    isActive(link.to)
                      ? scrolled ? 'text-accent-pink' : 'text-white font-semibold'
                      : scrolled ? 'text-text-dark hover:text-accent-pink' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className={`relative p-2 rounded-full transition-colors ${
                scrolled ? 'text-primary-brown hover:bg-secondary-beige' : 'text-white hover:bg-white/10'
              }`}
            >
              <FaShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  className={`flex items-center space-x-2 p-2 rounded-full transition-colors ${
                    scrolled ? 'text-primary-brown hover:bg-secondary-beige' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FaUser size={18} />
                  <span className="hidden md:inline text-sm">{user?.firstName}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-2 text-text-dark hover:bg-secondary-beige transition"
                    >
                      <FaTachometerAlt size={14} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-text-dark hover:bg-secondary-beige transition"
                    >
                      <FaUser size={14} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-error hover:bg-error hover:bg-opacity-10 transition"
                    >
                      <FaSignOutAlt size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    scrolled
                      ? 'text-primary-brown hover:bg-secondary-beige'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-accent-pink text-white rounded-lg hover:bg-opacity-90 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-primary-brown hover:bg-secondary-beige' : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="bg-white rounded-lg shadow-lg py-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center space-x-3 px-4 py-3 transition ${
                        isActive(link.to)
                          ? 'bg-accent-pink text-white'
                          : 'text-text-dark hover:bg-secondary-beige'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                
                {!isAuthenticated && (
                  <div className="border-t border-border mt-2 pt-2">
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-secondary-beige transition"
                    >
                      <FaUser size={16} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-secondary-beige transition"
                    >
                      <FaUser size={16} />
                      <span>Register</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;