import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductGrid = ({ products, loading, onQuickView, emptyMessage = 'No products found' }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const productArray = Array.isArray(products) ? products : [];
  console.log('ProductGrid rendering with:', productArray.length, 'products');

  if (productArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-dark">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {productArray.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};

export default ProductGrid;