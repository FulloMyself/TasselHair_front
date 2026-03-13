import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from '../hooks/useLocalStorage';
import * as voucherAPI from '../api/voucherAPI';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useLocalStorage('cart', []);
  const [cartOpen, setCartOpen] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const deliveryFee = 200; // R200 delivery fee
  const total = subtotal + deliveryFee - voucherDiscount;

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      
      if (existing) {
        toast.info(`Added another ${product.name} to cart`);
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity }];
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const item = prev.find(i => i._id === productId);
      if (item) {
        toast.info(`${item.name} removed from cart`);
      }
      return prev.filter(item => item._id !== productId);
    });
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setVoucher(null);
    setVoucherDiscount(0);
    toast.info('Cart cleared');
  };

  // Apply voucher
  const applyVoucher = async (code) => {
    try {
      const response = await voucherAPI.validateVoucher({
        code,
        orderAmount: subtotal,
      });

      const voucherData = response.data.voucher;
      setVoucher(voucherData);
      setVoucherDiscount(voucherData.discount);
      
      toast.success(`Voucher applied! You saved R${voucherData.discount.toFixed(2)}`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid voucher code');
      return false;
    }
  };

  // Remove voucher
  const removeVoucher = () => {
    setVoucher(null);
    setVoucherDiscount(0);
    toast.info('Voucher removed');
  };

  // Cart item count
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyVoucher,
    removeVoucher,
    voucher,
    subtotal,
    deliveryFee,
    total,
    itemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};