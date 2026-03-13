import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGift, FaCalendarAlt, FaShoppingCart, FaHeart, FaTag } from 'react-icons/fa';
import * as giftAPI from '../../api/giftAPI';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import GiftGrid from './GiftGrid';

const GiftDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedGifts, setRelatedGifts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGift();
    }
  }, [id]);

  const fetchGift = async () => {
    try {
      setLoading(true);
      const response = await giftAPI.getGiftPackageById(id);
      setGift(response.data);
      
      // Fetch related gifts (same occasion)
      if (response.data.occasions?.[0]) {
        const related = await giftAPI.getGiftPackagesByOccasion(response.data.occasions[0]);
        setRelatedGifts(related.data.filter(g => g._id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching gift:', error);
      toast.error('Failed to load gift package');
      navigate('/gifts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...gift,
      price: gift.sellingPrice,
      originalPrice: gift.totalValue,
    }, quantity);
    toast.success(`${gift.name} added to cart!`);
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const discount = gift ? Math.round(((gift.totalValue - gift.sellingPrice) / gift.totalValue) * 100) : 0;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!gift) {
    return (
      <div className="text-center py-12">
        <p className="text-text-dark">Gift package not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul className="flex space-x-2 text-gray-500">
            <li><a href="/" className="hover:text-accent-pink">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href="/gifts" className="hover:text-accent-pink">Gifts</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-primary-brown">{gift.name}</li>
          </ul>
        </div>

        {/* Gift Main */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={gift.images?.[0] || '/images/gift-placeholder.jpg'}
              alt={gift.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-primary-brown mb-2">
              {gift.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-accent-pink">
                  {formatCurrency(gift.sellingPrice)}
                </span>
                <span className="text-xl text-gray-400 line-through ml-3">
                  {formatCurrency(gift.totalValue)}
                </span>
                {discount > 0 && (
                  <span className="ml-3 bg-accent-pink text-white px-2 py-1 rounded text-sm">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Occasions */}
            {gift.occasions && gift.occasions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-primary-brown mb-2">Perfect for:</h3>
                <div className="flex flex-wrap gap-2">
                  {gift.occasions.map((occasion, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary-beige rounded-full text-sm"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Validity */}
            {gift.validityPeriod && (
              <div className="mb-6 flex items-center text-text-dark">
                <FaCalendarAlt className="mr-2 text-accent-pink" />
                <span>Valid for {gift.validityPeriod} days from purchase</span>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-primary-brown mb-2">Description</h3>
              <p className="text-text-dark">{gift.description}</p>
            </div>

            {/* Package Contents */}
            <div className="mb-6">
              <h3 className="font-semibold text-primary-brown mb-2">Package Includes:</h3>
              <div className="space-y-2">
                {gift.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm border-b border-border pb-2">
                    <span>
                      {item.quantity}x {item.itemName}
                    </span>
                    <span className="font-semibold">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-secondary-beige transition disabled:opacity-50"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 hover:bg-secondary-beige transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-lg border transition ${
                  isWishlisted
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-border hover:border-accent-pink'
                }`}
              >
                <FaHeart />
              </button>
            </div>

            {/* Gift Option */}
            <div className="bg-secondary-beige p-4 rounded-lg">
              <h3 className="font-semibold text-primary-brown mb-2 flex items-center">
                <FaGift className="mr-2" />
                Send as a Gift?
              </h3>
              <p className="text-sm text-text-dark mb-3">
                You can add a personal message and schedule delivery during checkout.
              </p>
              <Link
                to={`/checkout?gift=${gift._id}`}
                className="text-accent-pink hover:underline text-sm"
              >
                Learn more about gift options →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Gifts */}
        {relatedGifts.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title">You Might Also Like</h2>
            <GiftGrid gifts={relatedGifts} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GiftDetails;