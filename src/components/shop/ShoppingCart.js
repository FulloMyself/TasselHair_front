import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ShoppingCart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    total,
    itemCount,
    clearCart,
    applyVoucher,
    voucher,
    removeVoucher,
  } = useCart();

  const [voucherCode, setVoucherCode] = React.useState('');
  const [applyingVoucher, setApplyingVoucher] = React.useState(false);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    
    setApplyingVoucher(true);
    const success = await applyVoucher(voucherCode);
    if (success) {
      setVoucherCode('');
    }
    setApplyingVoucher(false);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/shop');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="cart-sidebar"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary-brown">
                  Your Cart ({itemCount})
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-error transition"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items */}
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingBag className="mx-auto text-5xl text-gray-300 mb-4" />
                  <p className="text-text-dark mb-4">Your cart is empty</p>
                  <button
                    onClick={handleContinueShopping}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="cart-item"
                      >
                        <img
                          src={item.images?.[0] || '/images/product-placeholder.jpg'}
                          alt={item.name}
                          className="cart-item-image"
                        />
                        
                        <div className="cart-item-details">
                          <h3 className="cart-item-name line-clamp-2">{item.name}</h3>
                          <p className="cart-item-price">
                            {formatCurrency(item.salePrice || item.price)}
                          </p>
                          
                          <div className="cart-quantity-controls">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="cart-quantity-btn"
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="cart-quantity-btn"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-primary-brown">
                            {formatCurrency((item.salePrice || item.price) * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-error hover:text-opacity-80 transition mt-2"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Voucher */}
                  <div className="mb-6">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Voucher code"
                        className="input-primary flex-1"
                        disabled={voucher !== null}
                      />
                      {voucher ? (
                        <button
                          onClick={removeVoucher}
                          className="px-4 py-2 bg-error text-white rounded-lg hover:bg-opacity-90 transition"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={handleApplyVoucher}
                          disabled={applyingVoucher || !voucherCode.trim()}
                          className="px-4 py-2 bg-accent-pink text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {voucher && (
                      <p className="text-sm text-success mt-2">
                        {voucher.description} applied!
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="border-t border-border pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-dark">Subtotal</span>
                      <span className="font-semibold">{formatCurrency(subtotal)}</span>
                    </div>
                    {voucher && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Discount</span>
                        <span>-{formatCurrency(subtotal - (total - deliveryFee))}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-text-dark">Delivery</span>
                      <span className="font-semibold">
                        {deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Free'}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-primary-brown text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      Proceed to Checkout
                      <FaArrowRight className="ml-2" />
                    </button>
                    <button
                      onClick={handleContinueShopping}
                      className="btn-outline w-full"
                    >
                      Continue Shopping
                    </button>
                    {cartItems.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to clear your cart?')) {
                            clearCart();
                          }
                        }}
                        className="text-error hover:underline text-sm w-full mt-4"
                      >
                        Clear Cart
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;