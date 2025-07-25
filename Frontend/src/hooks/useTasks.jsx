import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api/tasks';  // Keep this as /api/tasks

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    console.log('Access token:', token ? 'Present' : 'Missing');
    return !!token;
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    if (!isAuthenticated()) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching tasks from:', `${API_URL}/paginated`);
      const res = await fetchWithAuth(`${API_URL}/paginated`);
      
      // Log the raw response for debugging
      const text = await res.text();
      console.log('Raw response:', text);
      
      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed response:', data);
      
      if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      if (err.message.includes('unauthorized') || err.message.includes('invalid token')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchTasks();
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Separate pending and completed tasks
    const pendingTasks = tasks.filter(task => !task.status);
    const completedTasks = tasks.filter(task => task.status);
    // Sort completed tasks by dueDate (or createdAt if available)
    completedTasks.sort((a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0));
    setSortedTasks([...pendingTasks, ...completedTasks]);
  }, [tasks]);

  // Add task
  const addTask = async (newTaskData) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setError(null);
    try {
      // Ensure status is boolean
      const taskData = {
        ...newTaskData,
        status: Boolean(newTaskData.status)
      };

      const res = await fetchWithAuth(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add task');
      await fetchTasks();
    } catch (err) {
      setError(err.message);
      if (err.message.includes('unauthorized') || err.message.includes('invalid token')) {
        navigate('/login');
      }
      throw err;
    }
  };

  // Update task
  const updateTask = async (id, updatedTask) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setError(null);
    try {
      // Ensure status is boolean if it's being updated
      const taskData = {
        ...updatedTask,
        status: updatedTask.status !== undefined ? Boolean(updatedTask.status) : undefined
      };

      const res = await fetchWithAuth(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update task');
      }
      await fetchTasks();
    } catch (err) {
      setError(err.message);
      if (err.message.includes('unauthorized') || err.message.includes('invalid token')) {
        navigate('/login');
      }
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setError(null);
    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete task');
      }
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
      if (err.message.includes('unauthorized') || err.message.includes('invalid token')) {
        navigate('/login');
      }
    }
  };

  return {
    tasks,
    sortedTasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
};