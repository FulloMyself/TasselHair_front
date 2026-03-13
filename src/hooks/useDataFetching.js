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
        console.log('Fetching data...');
        
        const response = await fetchFunction();
        console.log('API Response:', response);
        
        // Handle different response structures
        const responseData = response.data?.data || response.data || [];
        console.log('Extracted data:', responseData);
        
        if (isMounted) {
          setData(responseData);
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

  return { data, loading, error };
};