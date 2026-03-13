import React, { useState, useEffect } from 'react';
import * as orderAPI from '../../api/orderAPI';
import * as userAPI from '../../api/userAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  FaShoppingBag, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPrint,
  FaFilePdf,
  FaEye
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: 'all',
    fromDate: null,
    toDate: null,
    search: '',
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    orderStatus: '',
    trackingNumber: '',
    notes: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      if (filters.status === 'all') delete params.status;
      if (filters.fromDate) params.fromDate = filters.fromDate.toISOString().split('T')[0];
      if (filters.toDate) params.toDate = filters.toDate.toISOString().split('T')[0];
      
      const response = await orderAPI.getAllOrders(params);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setActionLoading(true);
      await orderAPI.updateOrderStatus(selectedOrder._id, statusUpdate);
      toast.success('Order status updated successfully');
      setModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!window.confirm('Are you sure you want to refund this order?')) return;
    
    try {
      setActionLoading(true);
      await orderAPI.processRefund(selectedOrder._id, { reason: 'Admin initiated refund' });
      toast.success('Refund processed successfully');
      setModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to process refund');
    } finally {
      setActionLoading(false);
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

  const getPaymentStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-warning',
      paid: 'bg-success',
      failed: 'bg-error',
      refunded: 'bg-error',
    };

    return (
      <span className={`badge ${statusColors[status] || 'bg-gray-500'} text-white text-xs`}>
        {status}
      </span>
    );
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">
        Order Management
      </h1>

      {/* Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center text-accent-pink mb-4 hover:underline"
      >
        <FaShoppingBag className="mr-2" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="label-primary">Search</label>
              <SearchBar
                onSearch={(term) => setFilters({ ...filters, search: term })}
                placeholder="Order # or customer..."
                delay={500}
              />
            </div>
            <div>
              <label className="label-primary">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="label-primary">From Date</label>
              <DatePicker
                selected={filters.fromDate}
                onChange={(date) => setFilters({ ...filters, fromDate: date })}
                className="input-primary w-full"
                placeholderText="Start date"
                dateFormat="yyyy-MM-dd"
                isClearable
              />
            </div>
            <div>
              <label className="label-primary">To Date</label>
              <DatePicker
                selected={filters.toDate}
                onChange={(date) => setFilters({ ...filters, toDate: date })}
                className="input-primary w-full"
                placeholderText="End date"
                dateFormat="yyyy-MM-dd"
                minDate={filters.fromDate}
                isClearable
              />
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="font-mono text-sm font-medium">
                    {order.orderNumber}
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-secondary-beige rounded-full flex items-center justify-center">
                        <FaUser size={14} className="text-primary-brown" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-brown">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{order.customer?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <p>{formatDate(order.createdAt)}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <p className="font-medium">{order.items.length} item(s)</p>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalType('details');
                          setModalOpen(true);
                        }}
                        className="text-accent-pink hover:underline text-xs flex items-center mt-1"
                      >
                        <FaEye className="mr-1" size={10} />
                        View items
                      </button>
                    </div>
                  </td>
                  <td className="font-bold text-accent-pink">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </td>
                  <td>
                    <div className="flex flex-col items-start space-y-1">
                      {getStatusBadge(order.orderStatus)}
                      {order.trackingNumber && (
                        <span className="text-xs text-gray-500">
                          Track: {order.trackingNumber}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusUpdate({
                            orderStatus: order.orderStatus,
                            trackingNumber: order.trackingNumber || '',
                            notes: order.notes || '',
                          });
                          setModalType('status');
                          setModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Update Status"
                      >
                        <FaClock />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalType('invoice');
                          // TODO: Generate invoice
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="View Invoice"
                      >
                        <FaFilePdf />
                      </button>
                      {order.paymentStatus === 'paid' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            handleProcessRefund();
                          }}
                          className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition"
                          title="Process Refund"
                        >
                          <FaTimesCircle />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <FaShoppingBag className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-text-dark">No orders found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-border">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
            />
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={modalOpen && modalType === 'details'}
        onClose={() => setModalOpen(false)}
        title={`Order #${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-secondary-beige p-4 rounded-lg">
              <h3 className="font-semibold text-primary-brown mb-3">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <p className="flex items-center text-sm">
                  <FaUser className="mr-2 text-gray-500" size={12} />
                  {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                </p>
                <p className="flex items-center text-sm">
                  <FaEnvelope className="mr-2 text-gray-500" size={12} />
                  {selectedOrder.customer?.email}
                </p>
                <p className="flex items-center text-sm">
                  <FaPhone className="mr-2 text-gray-500" size={12} />
                  {selectedOrder.customer?.phone}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-primary-brown mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-border pb-2">
                    <div>
                      <p className="font-medium text-primary-brown">{item.itemName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-accent-pink">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            {selectedOrder.deliveryOption === 'delivery' && selectedOrder.shippingAddress && (
              <div>
                <h3 className="font-semibold text-primary-brown mb-3">Delivery Address</h3>
                <div className="bg-secondary-beige p-3 rounded-lg">
                  <p className="flex items-center text-sm mb-1">
                    <FaUser className="mr-2 text-gray-500" size={12} />
                    {selectedOrder.shippingAddress.recipientName}
                  </p>
                  <p className="flex items-center text-sm mb-1">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" size={12} />
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.suburb}
                  </p>
                  <p className="text-sm ml-6">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  {selectedOrder.shippingAddress.phone && (
                    <p className="flex items-center text-sm mt-1">
                      <FaPhone className="mr-2 text-gray-500" size={12} />
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-border pt-4">
              <div className="space-y-1">
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

            {selectedOrder.notes && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {selectedOrder.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={modalOpen && modalType === 'status'}
        onClose={() => setModalOpen(false)}
        title="Update Order Status"
      >
        <div className="space-y-4">
          <div>
            <label className="label-primary">Order Status</label>
            <select
              value={statusUpdate.orderStatus}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, orderStatus: e.target.value })}
              className="input-primary"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {statusUpdate.orderStatus === 'dispatched' && (
            <div>
              <label className="label-primary">Tracking Number</label>
              <input
                type="text"
                value={statusUpdate.trackingNumber}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, trackingNumber: e.target.value })}
                className="input-primary"
                placeholder="Enter tracking number"
              />
            </div>
          )}

          <div>
            <label className="label-primary">Notes (Optional)</label>
            <textarea
              value={statusUpdate.notes}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
              rows="3"
              className="input-primary"
              placeholder="Add any notes about this update..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={actionLoading}
              className="btn-primary"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Update Status'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderManagement;