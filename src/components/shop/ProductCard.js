import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import a default placeholder image
import defaultImage from '../../assets/images/product-placeholder.jpg';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const isOnSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const discount = isOnSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  // Construct the correct image path
  const getImageUrl = () => {
    if (imageError) return defaultImage;
    
    // If product has an image path from database
    if (product.image) {
      // If it's already a full URL, use it
      if (product.image.startsWith('http')) {
        return product.image;
      }
      // For GitHub Pages deployment
      if (process.env.NODE_ENV === 'production') {
        return `${process.env.PUBLIC_URL}${product.image}`;
      }
      // For local development
      return product.image.startsWith('/') ? product.image : `/${product.image}`;
    }
    
    // Try to construct from product name if no image field
    if (product.name) {
      const imageName = product.name
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        + '.jpg';
      return `/images/products/${imageName}`;
    }
    
    return defaultImage;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      className="product-card group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/shop/product/${product._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="product-image"
            onError={handleImageError}
          />
          
          {/* Sale Badge */}
          {isOnSale && (
            <div className="badge-sale">
              -{discount}%
            </div>
          )}

          {/* Quick Actions */}
          <motion.div
            className="absolute inset-x-0 bottom-0 flex justify-center space-x-2 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
            animate={isHovered ? { y: 0 } : { y: 20 }}
          >
            <button
              onClick={handleAddToCart}
              className="bg-accent-pink text-white p-2 rounded-full hover:bg-opacity-90 transition transform hover:scale-110"
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full transition transform hover:scale-110 ${
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-primary-brown'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <FaHeart />
            </button>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="bg-white text-primary-brown p-2 rounded-full hover:bg-accent-pink hover:text-white transition transform hover:scale-110"
                title="Quick View"
              >
                <FaStar />
              </button>
            )}
          </motion.div>
        </div>

        <div className="product-info">
          <h3 className="product-name line-clamp-2">{product.name}</h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(product.rating)
                        ? 'star-filled'
                        : i < product.rating
                        ? 'star-filled half'
                        : 'star-empty'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline">
            {isOnSale ? (
              <>
                <span className="price-sale">{formatCurrency(product.salePrice)}</span>
                <span className="price-original">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="price">{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-2 text-sm">
            {product.stockQuantity > 0 ? (
              <span className="text-success">In Stock ({product.stockQuantity})</span>
            ) : (
              <span className="text-error">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;