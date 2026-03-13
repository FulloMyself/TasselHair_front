import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as orderAPI from '../../api/orderAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  FaShoppingBag, 
  FaEye, 
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaBox,
  FaTimesCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders({
        page: pagination.page,
        limit: pagination.limit,
      });
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-success" />;
      case 'cancelled':
        return <FaTimesCircle className="text-error" />;
      case 'dispatched':
        return <FaTruck className="text-info" />;
      case 'processing':
        return <FaClock className="text-warning" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-warning',
      confirmed: 'bg-info',
      processing: 'bg-info',
      ready: 'bg-success',
      dispatched: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-error',
    };

    return (
      <span className={`badge ${statusColors[status] || 'bg-gray-500'} text-white`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const handleTrackOrder = (order) => {
    if (order.trackingNumber) {
      // Open tracking URL (e.g., Courier service tracking)
      window.open(`https://track.courier.com/${order.trackingNumber}`, '_blank');
    } else {
      toast.info('Tracking number not available yet');
    }
  };

  const handleDownloadInvoice = (order) => {
    // TODO: Generate and download invoice PDF
    toast.info('Invoice download coming soon');
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaShoppingBag className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-primary-brown mb-2">
            No Orders Yet
          </h3>
          <p className="text-text-dark mb-4">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link to="/shop" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-primary-brown">
                        Order #{order.orderNumber}
                      </h3>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent-pink">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} item(s)
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.itemName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-primary-brown">
                            {item.itemName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} • {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-500 self-center">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="border-t border-border pt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setModalOpen(true);
                    }}
                    className="btn-outline text-sm flex items-center"
                  >
                    <FaEye className="mr-2" size={12} />
                    View Details
                  </button>
                  
                  {order.orderStatus === 'dispatched' && order.trackingNumber && (
                    <button
                      onClick={() => handleTrackOrder(order)}
                      className="btn-outline text-sm flex items-center"
                    >
                      <FaTruck className="mr-2" size={12} />
                      Track Order
                    </button>
                  )}
                  
                  {order.paymentStatus === 'paid' && (
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="btn-outline text-sm flex items-center"
                    >
                      <FaDownload className="mr-2" size={12} />
                      Invoice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => setPagination({ ...pagination, page })}
              />
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Order #${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-secondary-beige p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-primary-brown">Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedOrder.orderStatus)}
                  <span className="capitalize">{selectedOrder.orderStatus}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary-brown">Payment:</span>
                <span className={`badge ${
                  selectedOrder.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'
                } text-white`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-primary-brown mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-border pb-2">
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.itemName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-primary-brown">{item.itemName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-accent-pink">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span>{selectedOrder.deliveryFee > 0 ? formatCurrency(selectedOrder.deliveryFee) : 'Free'}</span>
                </div>
                <div className="flex justify-between font-bold text-primary-brown text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.deliveryOption === 'delivery' && selectedOrder.shippingAddress && (
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Delivery Address</h3>
                <div className="bg-secondary-beige p-3 rounded-lg text-sm">
                  <p className="font-medium">{selectedOrder.shippingAddress.recipientName}</p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.suburb}, {selectedOrder.shippingAddress.city}</p>
                  <p>{selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.postalCode}</p>
                  <p className="mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>
            )}

            {/* Tracking Information */}
            {selectedOrder.trackingNumber && (
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Tracking Information</h3>
                <p className="text-sm">Tracking Number: {selectedOrder.trackingNumber}</p>
              </div>
            )}

            {/* Order Notes */}
            {selectedOrder.notes && (
              <div>
                <h3 className="font-semibold text-primary-brown mb-2">Order Notes</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyOrders;