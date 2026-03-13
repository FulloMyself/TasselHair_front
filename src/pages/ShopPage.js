import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/shop/ProductGrid';
import SearchBar from '../components/common/SearchBar';
import * as productAPI from '../api/productAPI';
import { useDataFetching } from '../hooks/useDataFetching';
import { FaFilter } from 'react-icons/fa';

const ShopPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    department: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'createdAt-desc',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Use the custom hook for data fetching
  const { data: products, loading, error } = useDataFetching(
    () => productAPI.getAllProducts({ isActive: true }),
    []
  );

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    console.log('Filtering products, total:', products.length);
    
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(p => p.department === filters.department);
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => {
        const price = p.salePrice || p.price;
        return price >= parseFloat(filters.minPrice);
      });
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => {
        const price = p.salePrice || p.price;
        return price <= parseFloat(filters.maxPrice);
      });
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stockQuantity > 0);
    }

    // Sorting
    const [sortBy, sortOrder] = filters.sortBy.split('-');
    filtered.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === 'price') {
        aVal = a.salePrice || a.price;
        bVal = b.salePrice || b.price;
      } else if (sortBy === 'name') {
        aVal = a.name || '';
        bVal = b.name || '';
      } else {
        aVal = new Date(a.createdAt || 0);
        bVal = new Date(b.createdAt || 0);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [products, filters, searchTerm]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const clearFilters = () => {
    setFilters({
      category: 'all',
      department: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'createdAt-desc',
    });
    setSearchTerm('');
  };

  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-error text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-custom py-12"
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-brown mb-4">
          Shop Our Products
        </h1>
        <p className="text-xl text-text-dark max-w-3xl mx-auto">
          Discover premium beauty and wellness products
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline w-full flex items-center justify-center"
        >
          <FaFilter className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-primary-brown">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-accent-pink hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="label-primary">Search</label>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search products..."
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="label-primary">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-primary"
              >
                <option value="all">All Categories</option>
                <option value="skincare">Skincare</option>
                <option value="haircare">Haircare</option>
                <option value="bodycare">Bodycare</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="label-primary">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input-primary w-1/2"
                  min="0"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input-primary w-1/2"
                  min="0"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="label-primary">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="input-primary"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-text-dark">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <ProductGrid
            products={filteredProducts}
            loading={loading}
            emptyMessage="No products found matching your criteria"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ShopPage;