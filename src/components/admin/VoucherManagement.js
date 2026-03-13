import React, { useState, useEffect } from 'react';
import * as voucherAPI from '../../api/voucherAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  FaTicketAlt, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaPercent,
  FaMoneyBillWave,
  FaGift,
  FaCalendarAlt,
  FaUsers
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    type: 'all',
    isActive: 'all',
    valid: 'all',
    search: '',
  });
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    voucherType: 'monetary',
    value: '',
    minimumPurchase: '',
    maxDiscount: '',
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    usageLimit: 1,
    isActive: true,
    description: '',
  });

  useEffect(() => {
    fetchVouchers();
  }, [pagination.page, filters]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      if (filters.type === 'all') delete params.type;
      if (filters.isActive === 'all') delete params.isActive;
      if (filters.valid === 'all') delete params.valid;
      
      const response = await voucherAPI.getAllVouchers(params);
      setVouchers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setPagination({ ...pagination, page: 1 });
  };

  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setFormData({
      code: voucher.code,
      voucherType: voucher.voucherType,
      value: voucher.value,
      minimumPurchase: voucher.minimumPurchase || '',
      maxDiscount: voucher.maxDiscount || '',
      validFrom: new Date(voucher.validFrom),
      validUntil: new Date(voucher.validUntil),
      usageLimit: voucher.usageLimit || 1,
      isActive: voucher.isActive,
      description: voucher.description || '',
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedVoucher(null);
    setFormData({
      code: '',
      voucherType: 'monetary',
      value: '',
      minimumPurchase: '',
      maxDiscount: '',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 1,
      isActive: true,
      description: '',
    });
    setModalType('create');
    setModalOpen(true);
  };

  const handleToggleStatus = async (voucher) => {
    try {
      setActionLoading(true);
      await voucherAPI.updateVoucher(voucher._id, { isActive: !voucher.isActive });
      toast.success(`Voucher ${voucher.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchVouchers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update voucher status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (voucher) => {
    if (!window.confirm(`Are you sure you want to delete voucher ${voucher.code}?`)) return;
    
    try {
      setActionLoading(true);
      await voucherAPI.deleteVoucher(voucher._id);
      toast.success('Voucher deleted successfully');
      fetchVouchers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete voucher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      if (modalType === 'create') {
        await voucherAPI.createVoucher(formData);
        toast.success('Voucher created successfully');
      } else {
        await voucherAPI.updateVoucher(selectedVoucher._id, formData);
        toast.success('Voucher updated successfully');
      }
      setModalOpen(false);
      fetchVouchers();
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${modalType} voucher`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const getVoucherIcon = (type) => {
    switch (type) {
      case 'monetary':
        return <FaMoneyBillWave className="text-success" />;
      case 'percentage':
        return <FaPercent className="text-info" />;
      case 'gift':
        return <FaGift className="text-accent-pink" />;
      default:
        return <FaTicketAlt />;
    }
  };

  if (loading && vouchers.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          Voucher Management
        </h1>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" size={14} />
          Create Voucher
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="label-primary">Search</label>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by code..."
              delay={500}
            />
          </div>
          <div>
            <label className="label-primary">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-primary"
            >
              <option value="all">All Types</option>
              <option value="monetary">Monetary</option>
              <option value="percentage">Percentage</option>
              <option value="gift">Gift</option>
            </select>
          </div>
          <div>
            <label className="label-primary">Status</label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="input-primary"
            >
              <option value="all">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="label-primary">Valid</label>
            <select
              value={filters.valid}
              onChange={(e) => setFilters({ ...filters, valid: e.target.value })}
              className="input-primary"
            >
              <option value="all">All</option>
              <option value="true">Valid</option>
              <option value="false">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Purchase</th>
                <th>Valid Period</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => {
                const isValid = new Date(voucher.validUntil) >= new Date() && new Date(voucher.validFrom) <= new Date();
                return (
                  <tr key={voucher._id}>
                    <td>
                      <div className="flex items-center space-x-2">
                        {getVoucherIcon(voucher.voucherType)}
                        <span className="font-mono font-bold">{voucher.code}</span>
                      </div>
                    </td>
                    <td className="capitalize">{voucher.voucherType}</td>
                    <td className="font-semibold text-accent-pink">
                      {voucher.voucherType === 'percentage' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                    </td>
                    <td>
                      {voucher.minimumPurchase ? formatCurrency(voucher.minimumPurchase) : '-'}
                    </td>
                    <td>
                      <div className="text-sm">
                        <p>{formatDate(voucher.validFrom)}</p>
                        <p className="text-xs text-gray-500">to {formatDate(voucher.validUntil)}</p>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <p className="font-semibold">{voucher.usedCount || 0}/{voucher.usageLimit || '∞'}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col space-y-1">
                        <span className={`badge ${voucher.isActive ? 'bg-success' : 'bg-error'} text-white`}>
                          {voucher.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {!isValid && voucher.isActive && (
                          <span className="badge bg-warning text-white text-xs">Expired</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(voucher)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(voucher)}
                          className={`p-2 rounded-lg transition ${
                            voucher.isActive
                              ? 'text-warning hover:bg-warning hover:bg-opacity-10'
                              : 'text-success hover:bg-success hover:bg-opacity-10'
                          }`}
                          title={voucher.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {voucher.isActive ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button
                          onClick={() => handleDelete(voucher)}
                          className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {vouchers.length === 0 && (
          <div className="text-center py-12">
            <FaTicketAlt className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-text-dark">No vouchers found</p>
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === 'create' ? 'Create Voucher' : 'Edit Voucher'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Code */}
            <div>
              <label className="label-primary">Voucher Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="input-primary flex-1"
                  placeholder="e.g. SUMMER2024"
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="btn-secondary whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="label-primary">Voucher Type</label>
              <select
                name="voucherType"
                value={formData.voucherType}
                onChange={handleInputChange}
                className="input-primary"
              >
                <option value="monetary">Monetary (Fixed Amount)</option>
                <option value="percentage">Percentage (%)</option>
                <option value="gift">Gift Voucher</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="label-primary">
                {formData.voucherType === 'percentage' ? 'Percentage (%)' : 'Value (R)'}
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                required
                min="0"
                step={formData.voucherType === 'percentage' ? '1' : '0.01'}
                max={formData.voucherType === 'percentage' ? '100' : ''}
                className="input-primary"
              />
            </div>

            {/* Min Purchase */}
            <div>
              <label className="label-primary">Minimum Purchase (R)</label>
              <input
                type="number"
                name="minimumPurchase"
                value={formData.minimumPurchase}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="input-primary"
                placeholder="Optional"
              />
            </div>

            {/* Max Discount (for percentage) */}
            {formData.voucherType === 'percentage' && (
              <div>
                <label className="label-primary">Maximum Discount (R)</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="input-primary"
                  placeholder="Optional"
                />
              </div>
            )}

            {/* Usage Limit */}
            <div>
              <label className="label-primary">Usage Limit</label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleInputChange}
                min="1"
                className="input-primary"
              />
            </div>

            {/* Valid From */}
            <div>
              <label className="label-primary">Valid From</label>
              <DatePicker
                selected={formData.validFrom}
                onChange={(date) => setFormData(prev => ({ ...prev, validFrom: date }))}
                className="input-primary w-full"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
              />
            </div>

            {/* Valid Until */}
            <div>
              <label className="label-primary">Valid Until</label>
              <DatePicker
                selected={formData.validUntil}
                onChange={(date) => setFormData(prev => ({ ...prev, validUntil: date }))}
                className="input-primary w-full"
                dateFormat="yyyy-MM-dd"
                minDate={formData.validFrom}
              />
            </div>

            {/* Active */}
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-accent-pink"
                />
                <span className="text-text-dark">Active</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label-primary">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input-primary"
              placeholder="Describe the voucher's terms and conditions..."
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
              type="submit"
              disabled={actionLoading}
              className="btn-primary"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : (modalType === 'create' ? 'Create Voucher' : 'Update Voucher')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;