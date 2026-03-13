import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { motion } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaHeart,
  FaSearch 
} from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, setCartOpen } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/shop', label: 'Shop' },
    { to: '/gifts', label: 'Gifts' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar with sliding text */}
        <div className="bg-secondary-beige py-2 overflow-hidden">
          <motion.div
            className="whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <p className="text-primary-brown">
              🏠 55 True North Road, Mulbarton, Gauteng | 📞 {process.env.REACT_APP_COMPANY_PHONE} | ✉️ {process.env.REACT_APP_COMPANY_EMAIL}
            </p>
          </motion.div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/images/logo.png" 
              alt="Tassel Beauty & Wellness" 
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-primary-brown hidden md:block">
              Tassel Beauty & Wellness
            </span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-beige rounded-l focus:outline-none focus:border-accent-pink"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-accent-pink text-white rounded-r hover:bg-opacity-90 transition"
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Action icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist" className="text-primary-brown hover:text-accent-pink transition">
                <FaHeart size={20} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-primary-brown hover:text-accent-pink transition"
            >
              <FaShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-primary-brown hover:text-accent-pink transition"
                  >
                    <FaUser size={18} />
                    <span className="hidden md:inline">{user?.firstName}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-primary-brown hover:text-accent-pink transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-primary-brown hover:text-accent-pink transition"
                  >
                    Login
                  </Link>
                  <span className="text-primary-brown">|</span>
                  <Link
                    to="/register"
                    className="text-primary-brown hover:text-accent-pink transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-primary-brown"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation - desktop */}
        <nav className="hidden md:block py-2">
          <ul className="flex justify-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-primary-brown hover:text-accent-pink transition font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4"
          >
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-beige rounded focus:outline-none focus:border-accent-pink"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-brown"
                >
                  <FaSearch />
                </button>
              </div>
            </form>

            {/* Mobile nav links */}
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-primary-brown hover:text-accent-pink transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;