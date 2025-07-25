import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = '/tasks/stats';
const ANALYTICS_URL = '/tasks/analytics';

export const useTaskStats = (range = 'weekly') => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_URL}?range=${range}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
      setStats(data);
    } catch (err) {
      setError(err.message);
      setStats({ total: 0, completed: 0, pending: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, [range]);

  return { stats, loading, error, fetchStats };
};

// New: Hook for analytics chart data
export const useTaskAnalytics = (range = 'weekly') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${ANALYTICS_URL}?range=${range}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to fetch analytics');
      setData(result);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line
  }, [range]);

  return { data, loading, error, fetchAnalytics };
}; 