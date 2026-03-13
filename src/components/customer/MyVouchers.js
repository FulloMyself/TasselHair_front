import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as voucherAPI from '../../api/voucherAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FaGift, FaCalendarAlt, FaTag, FaShare, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherAPI.getMyGiftVouchers();
      setVouchers(response.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Voucher code copied to clipboard!');
  };

  const handleShareViaEmail = (voucher) => {
    const subject = encodeURIComponent('You received a gift voucher from Tassel Beauty!');
    const body = encodeURIComponent(
      `Hello!\n\nYou have received a gift voucher from Tassel Beauty & Wellness worth ${formatCurrency(voucher.value)}.\n\nVoucher Code: ${voucher.code}\nValid until: ${formatDate(voucher.validUntil)}\n\nRedeem at: ${window.location.origin}/redeem-voucher/${voucher.code}\n\nEnjoy!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const getVoucherIcon = (type) => {
    switch (type) {
      case 'monetary':
        return <FaTag className="text-success" />;
      case 'percentage':
        return <FaTag className="text-info" />;
      case 'gift':
        return <FaGift className="text-accent-pink" />;
      default:
        return <FaGift />;
    }
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          My Gift Vouchers
        </h1>
        <Link to="/gifts/purchase" className="btn-primary flex items-center">
          <FaGift className="mr-2" />
          Buy Gift Voucher
        </Link>
      </div>

      {vouchers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaGift className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-primary-brown mb-2">
            No Vouchers Yet
          </h3>
          <p className="text-text-dark mb-4">
            You haven't purchased any gift vouchers yet.
          </p>
          <Link to="/gifts/purchase" className="btn-primary inline-block">
            Buy a Gift Voucher
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => {
            const expired = isExpired(voucher.validUntil);
            return (
              <div
                key={voucher._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition ${
                  expired ? 'opacity-75' : ''
                }`}
              >
                {/* Voucher Header */}
                <div className={`p-4 ${
                  expired ? 'bg-gray-300' : 'bg-gradient-to-r from-accent-pink to-primary-brown'
                } text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">Gift Voucher</p>
                      <p className="text-2xl font-bold mt-1">
                        {voucher.voucherType === 'percentage' 
                          ? `${voucher.value}% OFF` 
                          : formatCurrency(voucher.value)}
                      </p>
                    </div>
                    {getVoucherIcon(voucher.voucherType)}
                  </div>
                </div>

                {/* Voucher Body */}
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Voucher Code</p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-lg">
                        {voucher.code}
                      </code>
                      <button
                        onClick={() => handleCopyCode(voucher.code)}
                        className="p-2 text-gray-500 hover:text-primary-brown transition"
                        title="Copy code"
                      >
                        <FaTag />
                      </button>
                    </div>
                  </div>

                  {voucher.recipientName && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">For</p>
                      <p className="font-medium">{voucher.recipientName}</p>
                    </div>
                  )}

                  {voucher.personalMessage && (
                    <div className="mb-3 p-3 bg-secondary-beige rounded-lg">
                      <p className="text-sm italic">"{voucher.personalMessage}"</p>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      Valid until: {formatDate(voucher.validUntil)}
                      {expired && <span className="ml-2 text-error">(Expired)</span>}
                    </span>
                  </div>

                  {voucher.usedCount > 0 && (
                    <p className="text-sm text-success mb-3">
                      ✓ Redeemed on {formatDate(voucher.usedBy[0]?.usedAt)}
                    </p>
                  )}

                  {/* Actions */}
                  {!expired && voucher.usedCount === 0 && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleShareViaEmail(voucher)}
                        className="flex-1 btn-outline text-sm flex items-center justify-center"
                      >
                        <FaEnvelope className="mr-2" size={12} />
                        Email
                      </button>
                      <button
                        onClick={() => handleCopyCode(voucher.code)}
                        className="flex-1 btn-primary text-sm"
                      >
                        Use Voucher
                      </button>
                    </div>
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

export default MyVouchers;