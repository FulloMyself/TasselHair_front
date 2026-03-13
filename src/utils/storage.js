// Local Storage utilities
export const storage = {
  // Get item from localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  },

  // Set item in localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      return false;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
      return false;
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Check if key exists in localStorage
  has: (key) => {
    return localStorage.getItem(key) !== null;
  },

  // Get all keys
  keys: () => {
    return Object.keys(localStorage);
  },

  // Get size of localStorage
  size: () => {
    return localStorage.length;
  },
};

// Session Storage utilities
export const sessionStorage = {
  get: (key) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from sessionStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in sessionStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key} from sessionStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  },
};

// Cookie utilities
export const cookies = {
  // Set a cookie
  set: (name, value, days = 7, path = '/') => {
    try {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}`;
      return true;
    } catch (error) {
      console.error(`Error setting cookie ${name}:`, error);
      return false;
    }
  },

  // Get a cookie
  get: (name) => {
    try {
      return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
      }, '');
    } catch (error) {
      console.error(`Error getting cookie ${name}:`, error);
      return null;
    }
  },

  // Delete a cookie
  remove: (name, path = '/') => {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
      return true;
    } catch (error) {
      console.error(`Error deleting cookie ${name}:`, error);
      return false;
    }
  },

  // Check if cookie exists
  has: (name) => {
    return document.cookie.split(';').some((item) => item.trim().startsWith(`${name}=`));
  },

  // Get all cookies
  getAll: () => {
    try {
      return document.cookie.split('; ').reduce((acc, current) => {
        const [name, value] = current.split('=');
        acc[name] = decodeURIComponent(value);
        return acc;
      }, {});
    } catch (error) {
      console.error('Error getting all cookies:', error);
      return {};
    }
  },
};

// Cache utilities (using localStorage with TTL)
export const cache = {
  // Set item with TTL (time to live in milliseconds)
  set: (key, value, ttl = 3600000) => { // Default 1 hour
    try {
      const item = {
        value,
        expires: Date.now() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error(`Error caching item ${key}:`, error);
      return false;
    }
  },

  // Get item if not expired
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const { value, expires } = JSON.parse(item);
      if (Date.now() > expires) {
        localStorage.removeItem(key);
        return null;
      }

      return value;
    } catch (error) {
      console.error(`Error getting cached item ${key}:`, error);
      return null;
    }
  },

  // Remove item from cache
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing cached item ${key}:`, error);
      return false;
    }
  },

  // Clear expired items
  clearExpired: () => {
    try {
      const now = Date.now();
      Object.keys(localStorage).forEach((key) => {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item.expires && now > item.expires) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // Ignore items that aren't cache items
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing expired cache items:', error);
      return false;
    }
  },
};

// Memory storage (for temporary data)
class MemoryStorage {
  constructor() {
    this.storage = new Map();
  }

  set(key, value, ttl = null) {
    const item = {
      value,
      expires: ttl ? Date.now() + ttl : null,
    };
    this.storage.set(key, item);
  }

  get(key) {
    const item = this.storage.get(key);
    if (!item) return null;

    if (item.expires && Date.now() > item.expires) {
      this.storage.delete(key);
      return null;
    }

    return item.value;
  }

  remove(key) {
    this.storage.delete(key);
  }

  clear() {
    this.storage.clear();
  }

  has(key) {
    return this.storage.has(key);
  }

  size() {
    return this.storage.size;
  }

  keys() {
    return Array.from(this.storage.keys());
  }

  values() {
    return Array.from(this.storage.values()).map(item => item.value);
  }
}

export const memoryStorage = new MemoryStorage();