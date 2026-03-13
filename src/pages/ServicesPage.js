import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import ServiceGrid from '../components/services/ServiceGrid';
import SearchBar from '../components/common/SearchBar';
import * as serviceAPI from '../api/serviceAPI';
import { useDataFetching } from '../hooks/useDataFetching';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Use the custom hook for data fetching
  const { data: services, loading, error } = useDataFetching(
    () => serviceAPI.getAllServices({ isActive: true }),
    []
  );

  // Memoize filtered services
  const filteredServices = useMemo(() => {
    console.log('Filtering services, total:', services.length);
    
    let filtered = [...services];

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(s => s.department === selectedDepartment);
    }

    return filtered;
  }, [services, searchTerm, selectedCategory, selectedDepartment]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

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
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-brown mb-4">
          Our Services
        </h1>
        <p className="text-xl text-text-dark max-w-3xl mx-auto">
          Discover our comprehensive range of beauty and wellness services
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label-primary">Search</label>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search services..."
            />
          </div>
          <div>
            <label className="label-primary">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-primary"
            >
              <option value="all">All Categories</option>
              <option value="hair_wash">Hair Wash</option>
              <option value="braids">Braids</option>
              <option value="cornrows">Cornrows</option>
              <option value="massage">Massage</option>
              <option value="facial">Facials</option>
            </select>
          </div>
          <div>
            <label className="label-primary">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input-primary"
            >
              <option value="all">All Departments</option>
              <option value="hair">Hair</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>
        </div>
      </div>

      <ServiceGrid
        services={filteredServices}
        loading={loading}
        emptyMessage="No services found matching your criteria"
      />
    </motion.div>
  );
};

export default ServicesPage;