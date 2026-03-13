import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { FaHeart, FaShoppingCart, FaTrash, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWishlist = (items) => {
    localStorage.setItem('wishlist', JSON.stringify(items));
    setWishlist(items);
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter(item => item._id !== productId);
    saveWishlist(updated);
    toast.info('Item removed from wishlist');
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast.success(`${product.name} moved to cart`);
  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      saveWishlist([]);
      toast.info('Wishlist cleared');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          My Wishlist ({wishlist.length})
        </h1>
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-error hover:underline text-sm"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaRegHeart className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-primary-brown mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-text-dark mb-4">
            Save your favorite items here and come back to them later.
          </p>
          <Link to="/shop" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => {
            const isOnSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
            const currentPrice = isOnSale ? product.salePrice : product.price;
            
            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                <Link to={`/shop/product/${product._id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.images?.[0] || '/images/product-placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    {isOnSale && (
                      <div className="absolute top-2 left-2 bg-accent-pink text-white px-2 py-1 rounded-full text-xs">
                        Sale
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/shop/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-primary-brown mb-2 hover:text-accent-pink transition line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-500 mb-3">
                    {product.brand} • {product.category}
                  </p>

                  <div className="flex items-baseline mb-4">
                    <span className="text-xl font-bold text-accent-pink">
                      {formatCurrency(currentPrice)}
                    </span>
                    {isOnSale && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => moveToCart(product)}
                      className="flex-1 btn-primary text-sm flex items-center justify-center"
                    >
                      <FaShoppingCart className="mr-2" size={12} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition"
                      title="Remove from wishlist"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>

                  {product.stockQuantity === 0 && (
                    <p className="mt-2 text-xs text-error text-center">
                      Out of stock
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;