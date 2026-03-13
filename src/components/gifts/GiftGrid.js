import React from 'react';
import GiftCard from './GiftCard';
import LoadingSpinner from '../common/LoadingSpinner';

const GiftGrid = ({ gifts, loading, emptyMessage = 'No gift packages found' }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const giftArray = Array.isArray(gifts) ? gifts : [];
  console.log('GiftGrid rendering with:', giftArray.length, 'gifts');

  if (giftArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-dark">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {giftArray.map((gift) => (
        <GiftCard key={gift._id} gift={gift} />
      ))}
    </div>
  );
};

export default GiftGrid;