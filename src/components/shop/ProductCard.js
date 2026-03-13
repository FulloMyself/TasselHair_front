import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const isOnSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const discount = isOnSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API
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
            src={product.images?.[0] || '/images/product-placeholder.jpg'}
            alt={product.name}
            className="product-image"
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