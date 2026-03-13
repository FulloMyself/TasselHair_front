import { useState, useEffect } from 'react';

export const useDataFetching = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data from:', process.env.REACT_APP_API_URL);
        
        const response = await fetchFunction();
        console.log('API Response:', response);
        
        const responseData = response.data?.data || response.data || [];
        
        if (isMounted) {
          setData(responseData);
        }
      } catch (err) {
        console.error('Fetch error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          config: err.config
        });
        
        if (isMounted) {
          // Provide user-friendly error message
          let errorMessage = 'Failed to fetch data';
          if (err.code === 'ERR_NETWORK') {
            errorMessage = 'Cannot connect to server. Please check your internet connection or try again later.';
          } else if (err.response?.status === 404) {
            errorMessage = 'API endpoint not found. Please check server configuration.';
          } else if (err.response?.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
};