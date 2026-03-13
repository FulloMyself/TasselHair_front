import { useState, useEffect } from 'react';

export const useDataFetching = (fetchFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data...');
        
        // Pass a large limit to get all records
        const params = options.params || { limit: 1000 }; // Get up to 1000 records
        const response = await fetchFunction(params);
        console.log('API Response:', response);
        
        // Handle different response structures
        const responseData = response.data?.data || response.data || [];
        const responsePagination = response.data?.pagination || null;
        
        console.log(`Received ${responseData.length} items`);
        
        if (isMounted) {
          setData(responseData);
          setPagination(responsePagination);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (isMounted) {
          setError(err.message || 'Failed to fetch data');
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

  return { data, loading, error, pagination };
};