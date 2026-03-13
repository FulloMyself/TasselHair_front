import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as serviceAPI from '../../api/serviceAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaClock,
  FaTag,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    category: 'all',
    department: 'all',
    isActive: 'all',
    search: '',
  });
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    department: '',
    price: '',
    duration: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, [pagination.page, filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      if (filters.category === 'all') delete params.category;
      if (filters.department === 'all') delete params.department;
      if (filters.isActive === 'all') delete params.isActive;
      
      const response = await serviceAPI.getAllServices(params);
      setServices(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setPagination({ ...pagination, page: 1 });
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      category: service.category,
      department: service.department,
      price: service.price,
      duration: service.duration,
      description: service.description || '',
      isActive: service.isActive,
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setFormData({
      name: '',
      category: '',
      department: '',
      price: '',
      duration: '',
      description: '',
      isActive: true,
    });
    setModalType('create');
    setModalOpen(true);
  };

  const handleToggleStatus = async (service) => {
    try {
      setActionLoading(true);
      await serviceAPI.toggleServiceStatus(service._id);
      toast.success(`Service ${service.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update service status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Are you sure you want to delete ${service.name}?`)) return;
    
    try {
      setActionLoading(true);
      await serviceAPI.deleteService(service._id);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete service');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      if (modalType === 'create') {
        await serviceAPI.createService(formData);
        toast.success('Service created successfully');
      } else {
        await serviceAPI.updateService(selectedService._id, formData);
        toast.success('Service updated successfully');
      }
      setModalOpen(false);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${modalType} service`);
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

  const serviceCategories = [
    'hair_wash', 'braids', 'cornrows', 'plaits', 'benny_betty',
    'massage', 'facial', 'wax', 'nail', 'microneedling',
    'chemical_peel', 'body_contouring', 'add_on_treatments', 'event'
  ];

  if (loading && services.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          Service Management
        </h1>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" size={14} />
          Add Service
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="label-primary">Search</label>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search services..."
              delay={500}
            />
          </div>
          <div>
            <label className="label-primary">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-primary"
            >
              <option value="all">All Categories</option>
              {serviceCategories.map(cat => (
                <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-primary">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="input-primary"
            >
              <option value="all">All</option>
              <option value="hair">Hair</option>
              <option value="beauty">Beauty</option>
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

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Department</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      {service.images?.[0] && (
                        <img
                          src={service.images[0]}
                          alt={service.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-primary-brown">
                          {service.name}
                        </p>
                        <p className="text-xs text-gray-500">ID: {service._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="capitalize">{service.category.replace('_', ' ')}</td>
                  <td className="capitalize">{service.department}</td>
                  <td className="font-semibold text-accent-pink">
                    {formatCurrency(service.price)}
                  </td>
                  <td>
                    <span className="flex items-center">
                      <FaClock className="mr-1 text-gray-400" size={12} />
                      {service.duration} min
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${service.isActive ? 'bg-success' : 'bg-error'} text-white`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(service)}
                        className={`p-2 rounded-lg transition ${
                          service.isActive
                            ? 'text-warning hover:bg-warning hover:bg-opacity-10'
                            : 'text-success hover:bg-success hover:bg-opacity-10'
                        }`}
                        title={service.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {service.isActive ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        onClick={() => handleDelete(service)}
                        className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <FaTag className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-text-dark">No services found</p>
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
        title={modalType === 'create' ? 'Add New Service' : 'Edit Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-primary">Service Name</label>
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
              <label className="label-primary">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="input-primary"
              >
                <option value="">Select category</option>
                {serviceCategories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-primary">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="input-primary"
              >
                <option value="">Select department</option>
                <option value="hair">Hair</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>

            <div>
              <label className="label-primary">Price (R)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="input-primary"
              />
            </div>

            <div>
              <label className="label-primary">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
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

          <div>
            <label className="label-primary">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="input-primary"
              placeholder="Service description..."
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
              {actionLoading ? <LoadingSpinner size="sm" /> : (modalType === 'create' ? 'Create Service' : 'Update Service')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;