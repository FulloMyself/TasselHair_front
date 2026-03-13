import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaStar, FaMinus, FaPlus, FaCheck } from 'react-icons/fa';
import * as productAPI from '../../api/productAPI';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import ProductGrid from './ProductGrid';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      setProduct(response.data);
      setSelectedImage(0);
      
      // Fetch related products
      if (response.data.category) {
        const related = await productAPI.getAllProducts({
          category: response.data.category,
          limit: 4,
          exclude: id,
        });
        setRelatedProducts(related.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product?.stockQuantity || 1)));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedVariant,
    }, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-text-dark">Product not found</p>
      </div>
    );
  }

  const isOnSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const currentPrice = selectedVariant?.price || (isOnSale ? product.salePrice : product.price);
  const originalPrice = selectedVariant?.originalPrice || product.price;

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
            <li><a href="/shop" className="hover:text-accent-pink">Shop</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-primary-brown">{product.name}</li>
          </ul>
        </div>

        {/* Product Main */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage] || '/images/product-placeholder.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-accent-pink' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-primary-brown mb-2">
              {product.name}
            </h1>

            {/* Brand & SKU */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              {product.brand && <span>Brand: {product.brand}</span>}
              <span>SKU: {product.sku}</span>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
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
                <span className="text-sm text-gray-500 ml-2">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {isOnSale ? (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-accent-pink">
                    {formatCurrency(currentPrice)}
                  </span>
                  <span className="text-xl text-gray-400 line-through ml-3">
                    {formatCurrency(originalPrice)}
                  </span>
                  <span className="ml-3 bg-accent-pink text-white px-2 py-1 rounded text-sm">
                    Save {formatCurrency(originalPrice - currentPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-primary-brown">
                  {formatCurrency(currentPrice)}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-primary-brown mb-2">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantSelect(variant)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selectedVariant === variant
                          ? 'border-accent-pink bg-accent-pink text-white'
                          : 'border-border hover:border-accent-pink'
                      }`}
                    >
                      {variant.name}: {variant.value}
                      {variant.price && variant.price !== product.price && (
                        <span className="ml-2 text-sm">
                          (+{formatCurrency(variant.price - product.price)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stockQuantity > 0 ? (
                <div className="flex items-center text-success">
                  <FaCheck className="mr-2" />
                  <span>In Stock ({product.stockQuantity} available)</span>
                </div>
              ) : (
                <p className="text-error">Out of Stock</p>
              )}
            </div>

            {/* Quantity */}
            {product.stockQuantity > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-secondary-beige transition disabled:opacity-50"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                    className="p-3 hover:bg-secondary-beige transition disabled:opacity-50"
                  >
                    <FaPlus size={12} />
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
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-lg border transition ${
                    isWishlisted
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-border hover:border-accent-pink'
                  }`}
                >
                  <FaHeart />
                </button>
              </div>
            )}

            {/* Description */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-primary-brown mb-2">Description</h3>
              <p className="text-text-dark whitespace-pre-line">{product.description}</p>
            </div>

            {/* Categories */}
            {product.tags?.length > 0 && (
              <div className="border-t border-border pt-6 mt-6">
                <h3 className="font-semibold text-primary-brown mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary-beige rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title">You May Also Like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductDetails;