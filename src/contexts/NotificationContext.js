import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showSuccess = (message) => {
    toast.success(message);
    addNotification({ type: 'success', message });
  };

  const showError = (message) => {
    toast.error(message);
    addNotification({ type: 'error', message });
  };

  const showWarning = (message) => {
    toast.warning(message);
    addNotification({ type: 'warning', message });
  };

  const showInfo = (message) => {
    toast.info(message);
    addNotification({ type: 'info', message });
  };

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now(), read: false }]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    markAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};