import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as userAPI from '../../api/userAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import { formatDate } from '../../utils/formatters';
import { 
  FaUser, 
  FaUserTie, 
  FaShieldAlt, 
  FaEdit, 
  FaTrash, 
  FaBan,
  FaCheckCircle,
  FaPlus,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    role: 'all',
    isActive: 'all',
    search: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'edit', 'delete', 'toggle'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      if (filters.role === 'all') delete params.role;
      if (filters.isActive === 'all') delete params.isActive;
      
      const response = await userAPI.getAllUsers(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setPagination({ ...pagination, page: 1 });
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      await userAPI.toggleUserStatus(selectedUser._id);
      toast.success(`User ${selectedUser.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setActionLoading(true);
      await userAPI.deleteUser(selectedUser._id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaShieldAlt className="text-accent-pink" />;
      case 'staff':
        return <FaUserTie className="text-primary-brown" />;
      default:
        return <FaUser className="text-text-dark" />;
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-accent-pink text-white',
      staff: 'bg-primary-brown text-white',
      customer: 'bg-secondary-beige text-primary-brown',
    };
    return (
      <span className={`badge ${colors[role]}`}>
        {role}
      </span>
    );
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          User Management
        </h1>
        <Link to="/admin/users/create-staff" className="btn-primary flex items-center">
          <FaPlus className="mr-2" size={14} />
          Add Staff
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="label-primary">Search</label>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by name, email, phone..."
              delay={500}
            />
          </div>
          <div>
            <label className="label-primary">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="input-primary"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="staff">Staff</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div>
            <label className="label-primary">Status</label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="input-primary"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary-beige rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <p className="font-medium text-primary-brown">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">ID: {user._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="flex items-center text-sm">
                        <FaEnvelope className="mr-2 text-gray-400" size={12} />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="flex items-center text-sm">
                          <FaPhone className="mr-2 text-gray-400" size={12} />
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <span className={`badge ${user.isActive ? 'bg-success' : 'bg-error'} text-white`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center text-sm">
                      <FaCalendarAlt className="mr-2 text-gray-400" size={12} />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setModalType('toggle');
                          setModalOpen(true);
                        }}
                        className={`p-2 rounded-lg transition ${
                          user.isActive
                            ? 'text-warning hover:bg-warning hover:bg-opacity-10'
                            : 'text-success hover:bg-success hover:bg-opacity-10'
                        }`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <FaBan /> : <FaCheckCircle />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          handleDeleteUser();
                        }}
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

        {users.length === 0 && (
          <div className="text-center py-12">
            <FaUser className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-text-dark">No users found</p>
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

      {/* Toggle Status Modal */}
      <Modal
        isOpen={modalOpen && modalType === 'toggle'}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser?.isActive ? 'Deactivate User' : 'Activate User'}
      >
        <div className="space-y-4">
          <p className="text-text-dark">
            Are you sure you want to {selectedUser?.isActive ? 'deactivate' : 'activate'} {selectedUser?.firstName} {selectedUser?.lastName}?
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleStatus}
              disabled={actionLoading}
              className={`btn-primary flex-1 ${selectedUser?.isActive ? 'bg-warning' : 'bg-success'}`}
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Confirm'}
            </button>
            <button
              onClick={() => {
                setModalOpen(false);
                setSelectedUser(null);
              }}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;