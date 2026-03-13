import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as authAPI from '../api/authAPI';
import { jwtDecode } from 'jwt-decode';

// Export the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          await refreshToken();
        } else {
          const response = await authAPI.getProfile();
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }

    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      console.log('Login response:', response.data); // Debug log

      // Check different possible response structures
      let userData;
      let accessToken;
      let refreshToken;

      if (response.data.data) {
        // Structure: { success: true, data: { user, token, refreshToken } }
        userData = response.data.data.user || response.data.data;
        accessToken = response.data.data.accessToken || response.data.data.token;
        refreshToken = response.data.data.refreshToken;
      } else {
        // Structure: { user, token, refreshToken }
        userData = response.data.user || response.data;
        accessToken = response.data.accessToken || response.data.token;
        refreshToken = response.data.refreshToken;
      }

      if (!accessToken) {
        console.error('No access token in response:', response.data);
        throw new Error('Invalid server response');
      }

      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${userData.firstName}!`);

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/dashboard');
      }

      return response;
    } catch (error) {
      console.error('Login error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Sending registration data:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration response:', response.data);

      // Check different possible response structures
      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful! Please check your email to verify your account.');
      } else {
        toast.success('Registration successful! Please check your email to verify your account.');
      }

      navigate('/login');
      return response;
    } catch (error) {
      console.error('Registration error details:', error.response?.data || error.message);

      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
      toast.info('You have been logged out');
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await authAPI.refreshToken(refreshToken);

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      await checkAuth();
    } catch (error) {
      logout();
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data);
      toast.success('Profile updated successfully');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Profile update failed');
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Password change failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole: (role) => user?.role === role,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isCustomer: user?.role === 'customer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};