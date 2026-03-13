import React, { useState, useEffect } from 'react';
import * as giftAPI from '../../api/giftAPI';
import * as serviceAPI from '../../api/serviceAPI';
import * as productAPI from '../../api/productAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import FileUpload from '../common/FileUpload';
import { formatCurrency } from '../../utils/formatters';
import { 
  FaGift, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
  FaBoxes,
  FaSpa
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const GiftPackageManagement = () => {
  const [gifts, setGifts] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    occasion: 'all',
    isActive: 'all',
    search: '',
  });
  const [selectedGift, setSelectedGift] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    packageType: 'preset',
    items: [],
    sellingPrice: '',
    validityPeriod: 365,
    occasions: [],
    isActive: true,
    images: [],
  });
  const [selectedItem, setSelectedItem] = useState({
    itemType: 'service',
    itemId: '',
    quantity: 1,
  });

  useEffect(() => {
    fetchGifts();
    fetchServices();
    fetchProducts();
  }, [pagination.page, filters]);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      if (filters.occasion === 'all') delete params.occasion;
      if (filters.isActive === 'all') delete params.isActive;
      
      const response = await giftAPI.getAllGiftPackages(params);
      setGifts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast.error('Failed to load gift packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAllServices({ isActive: true, limit: 100 });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts({ isActive: true, limit: 100 });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setPagination({ ...pagination, page: 1 });
  };

  const handleEdit = (gift) => {
    setSelectedGift(gift);
    setFormData({
      name: gift.name,
      description: gift.description || '',
      packageType: gift.packageType,
      items: gift.items || [],
      sellingPrice: gift.sellingPrice,
      validityPeriod: gift.validityPeriod || 365,
      occasions: gift.occasions || [],
      isActive: gift.isActive,
      images: gift.images || [],
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedGift(null);
    setFormData({
      name: '',
      description: '',
      packageType: 'preset',
      items: [],
      sellingPrice: '',
      validityPeriod: 365,
      occasions: [],
      isActive: true,
      images: [],
    });
    setModalType('create');
    setModalOpen(true);
  };

  const handleToggleStatus = async (gift) => {
    try {
      setActionLoading(true);
      await giftAPI.toggleGiftStatus(gift._id);
      toast.success(`Gift package ${gift.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchGifts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update gift status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (gift) => {
    if (!window.confirm(`Are you sure you want to delete ${gift.name}?`)) return;
    
    try {
      setActionLoading(true);
      await giftAPI.deleteGiftPackage(gift._id);
      toast.success('Gift package deleted successfully');
      fetchGifts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete gift package');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      toast.error('Please add at least one item to the gift package');
      return;
    }

    try {
      setActionLoading(true);
      
      // Calculate total value
      const totalValue = formData.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const packageData = {
        ...formData,
        totalValue,
      };

      if (modalType === 'create') {
        await giftAPI.createGiftPackage(packageData);
        toast.success('Gift package created successfully');
      } else {
        await giftAPI.updateGiftPackage(selectedGift._id, packageData);
        toast.success('Gift package updated successfully');
      }
      setModalOpen(false);
      fetchGifts();
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${modalType} gift package`);
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

  const handleAddItem = () => {
    if (!selectedItem.itemId) {
      toast.error('Please select an item');
      return;
    }

    let itemDetails;
    if (selectedItem.itemType === 'service') {
      itemDetails = services.find(s => s._id === selectedItem.itemId);
    } else {
      itemDetails = products.find(p => p._id === selectedItem.itemId);
    }

    if (!itemDetails) return;

    const newItem = {
      itemType: selectedItem.itemType,
      itemId: selectedItem.itemId,
      itemName: itemDetails.name,
      quantity: selectedItem.quantity,
      price: itemDetails.salePrice || itemDetails.price,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setSelectedItem({
      itemType: 'service',
      itemId: '',
      quantity: 1,
    });
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleAddOccasion = (occasion) => {
    if (occasion && !formData.occasions.includes(occasion)) {
      setFormData(prev => ({
        ...prev,
        occasions: [...prev.occasions, occasion],
      }));
    }
  };

  const handleRemoveOccasion = (index) => {
    setFormData(prev => ({
      ...prev,
      occasions: prev.occasions.filter((_, i) => i !== index),
    }));
  };

  const handleFilesSelected = (files) => {
    // Handle image upload
    console.log('Files selected:', files);
  };

  const calculateTotalValue = () => {
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const occasions = [
    'Birthday', 'Mother\'s Day', 'Valentine\'s Day', 'Anniversary',
    'Wedding', 'Christmas', 'New Year', 'Just Because', 'Thank You'
  ];

  if (loading && gifts.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          Gift Package Management
        </h1>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" size={14} />
          Add Gift Package
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label-primary">Search</label>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search gift packages..."
              delay={500}
            />
          </div>
          <div>
            <label className="label-primary">Occasion</label>
            <select
              value={filters.occasion}
              onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}
              className="input-primary"
            >
              <option value="all">All Occasions</option>
              {occasions.map(occ => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
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
        </div>
      </div>

      {/* Gift Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((gift) => {
          const discount = Math.round(((gift.totalValue - gift.sellingPrice) / gift.totalValue) * 100);
          return (
            <div key={gift._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48">
                <img
                  src={gift.images?.[0] || '/images/gift-placeholder.jpg'}
                  alt={gift.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-2 right-2 bg-accent-pink text-white px-2 py-1 rounded-full text-xs font-bold">
                    Save {discount}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-primary-brown line-clamp-2 flex-1">
                    {gift.name}
                  </h3>
                  <span className={`badge ${gift.isActive ? 'bg-success' : 'bg-error'} text-white ml-2`}>
                    {gift.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Occasions */}
                {gift.occasions && gift.occasions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {gift.occasions.slice(0, 2).map((occ, idx) => (
                      <span key={idx} className="text-xs bg-secondary-beige px-2 py-1 rounded">
                        {occ}
                      </span>
                    ))}
                    {gift.occasions.length > 2 && (
                      <span className="text-xs bg-secondary-beige px-2 py-1 rounded">
                        +{gift.occasions.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Items count */}
                <p className="text-sm text-gray-500 mb-2">
                  {gift.items.length} item(s) included
                </p>

                {/* Price */}
                <div className="flex items-baseline mb-3">
                  <span className="text-xl font-bold text-accent-pink">
                    {formatCurrency(gift.sellingPrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through ml-2">
                    {formatCurrency(gift.totalValue)}
                  </span>
                </div>

                {/* Validity */}
                {gift.validityPeriod && (
                  <p className="text-xs text-gray-500 flex items-center mb-3">
                    <FaCalendarAlt className="mr-1" size={10} />
                    Valid for {gift.validityPeriod} days
                  </p>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <button
                    onClick={() => handleEdit(gift)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(gift)}
                    className={`p-2 rounded-lg transition ${
                      gift.isActive
                        ? 'text-warning hover:bg-warning hover:bg-opacity-10'
                        : 'text-success hover:bg-success hover:bg-opacity-10'
                    }`}
                    title={gift.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {gift.isActive ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => handleDelete(gift)}
                    className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {gifts.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaGift className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-text-dark">No gift packages found</p>
        </div>
      )}

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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === 'create' ? 'Create Gift Package' : 'Edit Gift Package'}
        size="full"
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div>
              <label className="label-primary">Package Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-primary"
              />
            </div>

            <div>
              <label className="label-primary">Package Type</label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleInputChange}
                className="input-primary"
              >
                <option value="preset">Preset Package</option>
                <option value="custom">Custom Package</option>
              </select>
            </div>

            <div>
              <label className="label-primary">Selling Price (R)</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="input-primary"
              />
            </div>

            <div>
              <label className="label-primary">Validity Period (days)</label>
              <input
                type="number"
                name="validityPeriod"
                value={formData.validityPeriod}
                onChange={handleInputChange}
                min="1"
                className="input-primary"
              />
            </div>

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
            <label className="label-primary">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input-primary"
              placeholder="Gift package description..."
            />
          </div>

          {/* Occasions */}
          <div>
            <label className="label-primary">Occasions</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.occasions.map((occ, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-secondary-beige rounded-full text-sm"
                >
                  {occ}
                  <button
                    type="button"
                    onClick={() => handleRemoveOccasion(index)}
                    className="ml-2 text-error hover:text-opacity-80"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <select
              onChange={(e) => handleAddOccasion(e.target.value)}
              className="input-primary"
              value=""
            >
              <option value="">Add an occasion</option>
              {occasions.map(occ => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <label className="label-primary">Package Items</label>
            <div className="bg-secondary-beige p-4 rounded-lg mb-3">
              <div className="grid md:grid-cols-4 gap-2 mb-2">
                <select
                  value={selectedItem.itemType}
                  onChange={(e) => setSelectedItem({ ...selectedItem, itemType: e.target.value, itemId: '' })}
                  className="input-primary text-sm"
                >
                    <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
                <select
                  value={selectedItem.itemId}
                  onChange={(e) => setSelectedItem({ ...selectedItem, itemId: e.target.value })}
                  className="input-primary text-sm col-span-2"
                >
                  <option value="">Select item</option>
                  {selectedItem.itemType === 'service' ? (
                    services.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.name} - {formatCurrency(s.price)}
                      </option>
                    ))
                  ) : (
                    products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} - {formatCurrency(p.salePrice || p.price)}
                      </option>
                    ))
                  )}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  value={selectedItem.quantity}
                  onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="input-primary text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="btn-secondary text-sm"
              >
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-border mb-2">
                <div className="flex-1">
                  <p className="font-medium text-primary-brown">{item.itemName}</p>
                  <p className="text-xs text-gray-500">
                    {item.itemType} • Qty: {item.quantity} • {formatCurrency(item.price)} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent-pink">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-xs text-error hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {formData.items.length > 0 && (
              <div className="bg-primary-brown text-white p-3 rounded-lg mt-3 flex justify-between">
                <span>Total Package Value:</span>
                <span className="font-bold">{formatCurrency(calculateTotalValue())}</span>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="label-primary">Package Images</label>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxFiles={5}
              acceptedFileTypes="image/*"
            />
            {formData.images.length > 0 && (
              <div className="mt-2 flex space-x-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="" className="w-16 h-16 object-cover rounded" />
                  </div>
                ))}
              </div>
            )}
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
              {actionLoading ? <LoadingSpinner size="sm" /> : (modalType === 'create' ? 'Create Gift Package' : 'Update Gift Package')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GiftPackageManagement;