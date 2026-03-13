import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productAPI from '../../api/productAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import FileUpload from '../common/FileUpload';
import { formatCurrency } from '../../utils/formatters';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaBoxes,
  FaTag,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaImage
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    department: '',
    price: '',
    salePrice: '',
    costPrice: '',
    stockQuantity: '',
    lowStockThreshold: 5,
    description: '',
    brand: '',
    isFeatured: false,
    isActive: true,
    variants: [],
    images: [],
  });
  const [variantInput, setVariantInput] = useState({
    name: '',
    value: '',
    sku: '',
    price: '',
    stockQuantity: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  const fetchProducts = async () => {
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
      
      const response = await productAPI.getAllProducts(params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setPagination({ ...pagination, page: 1 });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      department: product.department,
      price: product.price,
      salePrice: product.salePrice || '',
      costPrice: product.costPrice,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold || 5,
      description: product.description || '',
      brand: product.brand || '',
      isFeatured: product.isFeatured || false,
      isActive: product.isActive,
      variants: product.variants || [],
      images: product.images || [],
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      sku: '',
      category: '',
      department: '',
      price: '',
      salePrice: '',
      costPrice: '',
      stockQuantity: '',
      lowStockThreshold: 5,
      description: '',
      brand: '',
      isFeatured: false,
      isActive: true,
      variants: [],
      images: [],
    });
    setModalType('create');
    setModalOpen(true);
  };

  const handleToggleStatus = async (product) => {
    try {
      setActionLoading(true);
      await productAPI.toggleProductStatus(product._id);
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update product status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;
    
    try {
      setActionLoading(true);
      await productAPI.deleteProduct(product._id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStockUpdate = async (product, newStock) => {
    try {
      setActionLoading(true);
      await productAPI.updateStock(product._id, { quantity: newStock });
      toast.success('Stock updated successfully');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update stock');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      if (modalType === 'create') {
        await productAPI.createProduct(formData);
        toast.success('Product created successfully');
      } else {
        await productAPI.updateProduct(selectedProduct._id, formData);
        toast.success('Product updated successfully');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${modalType} product`);
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

  const handleFilesSelected = (files) => {
    // Handle image upload
    console.log('Files selected:', files);
    // TODO: Upload images to server
  };

  const addVariant = () => {
    if (variantInput.name && variantInput.value) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...variantInput }],
      }));
      setVariantInput({
        name: '',
        value: '',
        sku: '',
        price: '',
        stockQuantity: '',
      });
    }
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const productCategories = [
    'skincare', 'haircare', 'bodycare', 'wellness', 'accessories', 'gifts'
  ];

  if (loading && products.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          Product Management
        </h1>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" size={14} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="label-primary">Search</label>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search products..."
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
              {productCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isLowStock = product.stockQuantity <= product.lowStockThreshold;
                return (
                  <tr key={product._id} className={isLowStock ? 'bg-warning bg-opacity-5' : ''}>
                    <td>
                      <div className="flex items-center space-x-3">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-primary-brown">
                            {product.name}
                          </p>
                          {product.isFeatured && (
                            <span className="badge bg-accent-pink text-white text-xs">
                              <FaStar className="mr-1" size={10} />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{product.sku}</td>
                    <td className="capitalize">{product.category}</td>
                    <td>
                      {product.salePrice ? (
                        <div>
                          <span className="font-semibold text-accent-pink">
                            {formatCurrency(product.salePrice)}
                          </span>
                          <span className="text-xs text-gray-400 line-through ml-1">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-accent-pink">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </td>
                    <td>
                      <div>
                        <span className={`font-semibold ${isLowStock ? 'text-warning' : 'text-success'}`}>
                          {product.stockQuantity}
                        </span>
                        {isLowStock && (
                          <p className="text-xs text-warning">Low stock</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${product.isActive ? 'bg-success' : 'bg-error'} text-white`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product)}
                          className={`p-2 rounded-lg transition ${
                            product.isActive
                              ? 'text-warning hover:bg-warning hover:bg-opacity-10'
                              : 'text-success hover:bg-success hover:bg-opacity-10'
                          }`}
                          title={product.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {product.isActive ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button
                          onClick={() => {
                            const newStock = prompt('Enter new stock quantity:', product.stockQuantity);
                            if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
                              handleStockUpdate(product, parseInt(newStock));
                            }
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Update Stock"
                        >
                          <FaBoxes />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
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

        {products.length === 0 && (
          <div className="text-center py-12">
            <FaTag className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-text-dark">No products found</p>
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
        title={modalType === 'create' ? 'Add New Product' : 'Edit Product'}
        size="full"
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div>
              <label className="label-primary">Product Name</label>
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
              <label className="label-primary">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
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
                {productCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
              <label className="label-primary">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>

            {/* Pricing */}
            <div>
              <label className="label-primary">Regular Price (R)</label>
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
              <label className="label-primary">Sale Price (R)</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="input-primary"
              />
            </div>

            <div>
              <label className="label-primary">Cost Price (R)</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="input-primary"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="label-primary">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
                min="0"
                className="input-primary"
              />
            </div>

            <div>
              <label className="label-primary">Low Stock Threshold</label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                min="0"
                className="input-primary"
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-accent-pink"
                />
                <span className="text-text-dark">Featured Product</span>
              </label>

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
              rows="4"
              className="input-primary"
              placeholder="Product description..."
            />
          </div>

          {/* Images */}
          <div>
            <label className="label-primary">Product Images</label>
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

          {/* Variants */}
          <div>
            <label className="label-primary">Product Variants</label>
            <div className="bg-secondary-beige p-4 rounded-lg mb-3">
              <div className="grid md:grid-cols-5 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name (e.g. Size)"
                  value={variantInput.name}
                  onChange={(e) => setVariantInput({ ...variantInput, name: e.target.value })}
                  className="input-primary text-sm"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Large)"
                  value={variantInput.value}
                  onChange={(e) => setVariantInput({ ...variantInput, value: e.target.value })}
                  className="input-primary text-sm"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={variantInput.sku}
                  onChange={(e) => setVariantInput({ ...variantInput, sku: e.target.value })}
                  className="input-primary text-sm"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variantInput.price}
                  onChange={(e) => setVariantInput({ ...variantInput, price: e.target.value })}
                  className="input-primary text-sm"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={variantInput.stockQuantity}
                  onChange={(e) => setVariantInput({ ...variantInput, stockQuantity: e.target.value })}
                  className="input-primary text-sm"
                />
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="btn-secondary text-sm"
              >
                Add Variant
              </button>
            </div>

            {formData.variants.map((variant, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-border mb-2">
                <div className="grid grid-cols-5 gap-2 flex-1">
                  <span className="text-sm">{variant.name}</span>
                  <span className="text-sm">{variant.value}</span>
                  <span className="text-sm font-mono">{variant.sku}</span>
                  <span className="text-sm">{formatCurrency(variant.price)}</span>
                  <span className="text-sm">{variant.stockQuantity}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="ml-2 text-error hover:text-opacity-80"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
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
              {actionLoading ? <LoadingSpinner size="sm" /> : (modalType === 'create' ? 'Create Product' : 'Update Product')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;