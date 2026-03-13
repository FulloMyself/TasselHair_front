import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GiftGrid from '../components/gifts/GiftGrid';
import SearchBar from '../components/common/SearchBar';
import * as giftAPI from '../api/giftAPI';
import { useDataFetching } from '../hooks/useDataFetching';
import { FaGift, FaCalendarAlt, FaTag } from 'react-icons/fa';

const GiftsPage = () => {
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Use the custom hook for data fetching
  const { data: gifts, loading, error } = useDataFetching(
    (params) => giftAPI.getAllGiftPackages({
      ...params,
      isActive: true,
      limit: 1000 // Get all gift packages
    }),
    [],
    { params: { limit: 1000 } }
  );

  const filteredGifts = useMemo(() => {
    console.log('Filtering gifts, total:', gifts.length);

    let filtered = [...gifts];

    if (searchTerm) {
      filtered = filtered.filter(gift =>
        gift.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gift.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedOccasion !== 'all') {
      filtered = filtered.filter(gift =>
        gift.occasions?.includes(selectedOccasion)
      );
    }

    return filtered;
  }, [gifts, searchTerm, selectedOccasion]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const occasions = [
    { id: 'all', label: 'All Occasions', icon: FaGift },
    { id: 'Birthday', label: 'Birthday', icon: FaCalendarAlt },
    { id: 'Mother\'s Day', label: 'Mother\'s Day', icon: FaTag },
    { id: 'Valentine\'s Day', label: 'Valentine\'s Day', icon: FaTag },
    { id: 'Anniversary', label: 'Anniversary', icon: FaCalendarAlt },
  ];

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
          Gift Packages
        </h1>
        <p className="text-xl text-text-dark max-w-3xl mx-auto">
          Find the perfect gift for your loved ones
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-primary">Search</label>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search gift packages..."
            />
          </div>
          <div>
            <label className="label-primary">Filter by Occasion</label>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="input-primary"
            >
              {occasions.map(occ => (
                <option key={occ.id} value={occ.id}>{occ.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gift Grid */}
      <GiftGrid
        gifts={filteredGifts}
        loading={loading}
        emptyMessage="No gift packages found matching your criteria"
      />

      {/* Custom Gift CTA */}
      <div className="mt-12 bg-gradient-to-r from-accent-pink to-primary-brown rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Looking for Something Special?</h2>
        <p className="mb-6 opacity-90">
          We can create a custom gift package tailored to your needs.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-white text-accent-pink px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
        >
          Contact Us
        </Link>
      </div>
    </motion.div>
  );
};

export default GiftsPage;