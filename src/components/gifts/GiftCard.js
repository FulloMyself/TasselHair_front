import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { FaGift, FaCalendarAlt, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const GiftCard = ({ gift }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...gift,
      price: gift.sellingPrice,
      originalPrice: gift.totalValue,
    }, 1);
    toast.success(`${gift.name} added to cart!`);
  };

  const discount = Math.round(((gift.totalValue - gift.sellingPrice) / gift.totalValue) * 100);

  return (
    <motion.div
      className="product-card group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/gifts/${gift._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={gift.images?.[0] || '/images/gift-placeholder.jpg'}
            alt={gift.name}
            className="product-image"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="badge-sale">
              Save {discount}%
            </div>
          )}

          {/* Quick Add Button */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              className="w-full bg-accent-pink text-white py-2 rounded-lg hover:bg-opacity-90 transition flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="product-name line-clamp-2">{gift.name}</h3>
          
          {/* Occasions */}
          {gift.occasions && gift.occasions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {gift.occasions.slice(0, 2).map((occasion, index) => (
                <span
                  key={index}
                  className="text-xs bg-secondary-beige text-primary-brown px-2 py-1 rounded"
                >
                  {occasion}
                </span>
              ))}
              {gift.occasions.length > 2 && (
                <span className="text-xs bg-secondary-beige text-primary-brown px-2 py-1 rounded">
                  +{gift.occasions.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline">
            <span className="price-sale">{formatCurrency(gift.sellingPrice)}</span>
            <span className="price-original">{formatCurrency(gift.totalValue)}</span>
          </div>

          {/* Validity */}
          {gift.validityPeriod && (
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <FaCalendarAlt className="mr-1" />
              Valid for {gift.validityPeriod} days
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default GiftCard;