import React, { useState, useEffect } from 'react';
import * as productAPI from '../../api/productAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { 
  FaBoxes, 
  FaEdit, 
  FaExclamationTriangle,
  FaHistory,
  FaPlus,
  FaMinus,
  FaFilter,
  FaFileExport,
  FaChartLine
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const InventoryManagement = () => {
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
    lowStock: false,
    search: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [stockUpdate, setStockUpdate] = useState({
    quantity: 0,
    operation: 'add',
    reason: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchStats();
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
      
      const response = await productAPI.getAllProducts(params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [allProducts, lowStock] = await Promise.all([
        productAPI.getAllProducts({ limit: 1000 }),
        productAPI.getLowStockProducts(),
      ]);

      const totalValue = allProducts.data.reduce((sum, p) => sum + (p.costPrice * p.stockQuantity), 0);
      const outOfStock = allProducts.data.filter(p => p.stockQuantity === 0).length;

      setStats({
        totalProducts: allProducts.data.length,
        totalValue,
        lowStockCount: lowStock.data.length,
        outOfStockCount: outOfStock,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setPagination({ ...pagination, page: 1 });
  };

  const handleUpdateStock = async () => {
    if (stockUpdate.quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      setActionLoading(true);
      await productAPI.updateStock(selectedProduct._id, {
        quantity: stockUpdate.quantity,
        operation: stockUpdate.operation,
      });
      
      toast.success(`Stock ${stockUpdate.operation === 'add' ? 'added' : 'removed'} successfully`);
      setModalOpen(false);
      fetchProducts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update stock');
    } finally {
      setActionLoading(false);
    }
  };

  const getStockStatus = (product) => {
    if (product.stockQuantity === 0) {
      return { label: 'Out of Stock', color: 'bg-error', icon: FaExclamationTriangle };
    }
    if (product.stockQuantity <= product.lowStockThreshold) {
      return { label: 'Low Stock', color: 'bg-warning', icon: FaExclamationTriangle };
    }
    return { label: 'In Stock', color: 'bg-success', icon: FaBoxes };
  };

  const productCategories = [
    'skincare', 'haircare', 'bodycare', 'wellness', 'accessories', 'gifts'
  ];

  if (loading && products.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">
        Inventory Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-text-dark">Total Products</p>
          <p className="text-2xl font-bold text-primary-brown">{stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-text-dark">Inventory Value</p>
          <p className="text-2xl font-bold text-primary-brown">{formatCurrency(stats.totalValue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-text-dark">Low Stock Items</p>
          <p className="text-2xl font-bold text-warning">{stats.lowStockCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-text-dark">Out of Stock</p>
          <p className="text-2xl font-bold text-error">{stats.outOfStockCount}</p>
        </div>
      </div>

      {/* Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center text-accent-pink mb-4 hover:underline"
      >
        <FaFilter className="mr-2" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label-primary">Search</label>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search by name or SKU..."
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
              <label className="label-primary">Status</label>
              <div className="flex items-center space-x-2 h-10">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.lowStock}
                    onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-accent-pink"
                  />
                  <span className="text-text-dark">Show low stock only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Threshold</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Potential Profit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getStockStatus(product);
                const StatusIcon = status.icon;
                const potentialProfit = (product.salePrice || product.price) - product.costPrice;
                const totalPotential = potentialProfit * product.stockQuantity;

                return (
                  <tr key={product._id} className={status.color === 'bg-warning' ? 'bg-warning bg-opacity-5' : ''}>
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
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{product.sku}</td>
                    <td className="capitalize">{product.category}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={status.color === 'bg-success' ? 'text-success' : status.color === 'bg-warning' ? 'text-warning' : 'text-error'} />
                        <span className={`font-semibold ${
                          status.color === 'bg-success' ? 'text-success' : 
                          status.color === 'bg-warning' ? 'text-warning' : 'text-error'
                        }`}>
                          {product.stockQuantity}
                        </span>
                      </div>
                    </td>
                    <td>{product.lowStockThreshold}</td>
                    <td>{formatCurrency(product.costPrice)}</td>
                    <td>
                      {product.salePrice ? (
                        <div>
                          <span className="text-accent-pink">{formatCurrency(product.salePrice)}</span>
                          <span className="text-xs text-gray-400 line-through ml-1">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-accent-pink">{formatCurrency(product.price)}</span>
                      )}
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-success">{formatCurrency(totalPotential)}</p>
                        <p className="text-xs text-gray-500">({formatCurrency(potentialProfit)}/unit)</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setStockUpdate({
                              quantity: 0,
                              operation: 'add',
                              reason: '',
                            });
                            setModalType('stock');
                            setModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Update Stock"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Show stock history
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Stock History"
                        >
                          <FaHistory />
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
            <FaBoxes className="mx-auto text-5xl text-gray-300 mb-4" />
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

      {/* Update Stock Modal */}
      <Modal
        isOpen={modalOpen && modalType === 'stock'}
        onClose={() => setModalOpen(false)}
        title="Update Stock"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="bg-secondary-beige p-4 rounded-lg">
              <p className="font-medium text-primary-brown">{selectedProduct.name}</p>
              <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
              <p className="text-sm mt-2">
                Current Stock: <span className="font-bold text-primary-brown">{selectedProduct.stockQuantity}</span>
              </p>
            </div>

            <div>
              <label className="label-primary">Operation</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="operation"
                    value="add"
                    checked={stockUpdate.operation === 'add'}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, operation: e.target.value })}
                    className="form-radio h-5 w-5 text-accent-pink"
                  />
                  <span className="flex items-center text-success">
                    <FaPlus className="mr-1" size={12} />
                    Add Stock
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="operation"
                    value="subtract"
                    checked={stockUpdate.operation === 'subtract'}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, operation: e.target.value })}
                    className="form-radio h-5 w-5 text-accent-pink"
                  />
                  <span className="flex items-center text-error">
                    <FaMinus className="mr-1" size={12} />
                    Remove Stock
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="label-primary">Quantity</label>
              <input
                type="number"
                value={stockUpdate.quantity}
                onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: parseInt(e.target.value) || 0 })}
                min="1"
                className="input-primary"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="label-primary">Reason (Optional)</label>
              <input
                type="text"
                value={stockUpdate.reason}
                onChange={(e) => setStockUpdate({ ...stockUpdate, reason: e.target.value })}
                className="input-primary"
                placeholder="e.g., New shipment, damaged goods, etc."
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
                onClick={handleUpdateStock}
                disabled={actionLoading}
                className="btn-primary"
              >
                {actionLoading ? <LoadingSpinner size="sm" /> : 'Update Stock'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventoryManagement;