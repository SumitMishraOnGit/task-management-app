// Frontend/src/Context/TaskContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

const API_URL = '/tasks';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedTaskId, setHighlightedTaskId] = useState(null);
  const [activityIndicators, setActivityIndicators] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = () => !!localStorage.getItem('accessToken');

  const fetchTasks = async () => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(API_URL);
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];

      if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');

      const processedTasks = Array.isArray(data) ? data : (data.tasks || []);
      console.log('Fetched tasks:', processedTasks.length);
      setTasks(processedTasks);

    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      if (!isInitialized) {
        console.log('Initializing TaskContext...');
        await fetchTasks();
        setIsInitialized(true);
      }
    };

    initializeApp();

    // Set up refresh interval
    const refreshInterval = setInterval(() => {
      if (isAuthenticated()) {
        fetchTasks();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [isInitialized]);

  useEffect(() => {
    const pendingTasks = tasks.filter(task => !task.status);
    const completedTasks = tasks.filter(task => task.status);
    // Sort pending tasks by due date (sooner first)
    pendingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    // Sort completed tasks by creation date (newest first)
    completedTasks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setSortedTasks([...pendingTasks, ...completedTasks]);
  }, [tasks]);

  const showActivityIndicator = (taskId, type) => {
    setActivityIndicators(prev => ({ ...prev, [taskId]: type }));
    setTimeout(() => {
      setActivityIndicators(prev => {
        const newIndicators = { ...prev };
        delete newIndicators[taskId];
        return newIndicators;
      });
    }, 2500); // Indicator lasts for 2.5 seconds
  };

  const addTask = async (newTaskData) => {
    try {
      const res = await fetchWithAuth(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      });
      const savedTask = await res.json();
      if (!res.ok) throw new Error(savedTask.message || 'Failed to add task');

      // --- FIX: Refetch tasks to get the latest list ---
      await fetchTasks();
      showActivityIndicator(savedTask._id, 'new');

    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, updatedTaskData) => {
     try {
        const res = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTaskData),
        });
        const updatedTask = await res.json();
        if (!res.ok) throw new Error(updatedTask.message || 'Failed to update task');

        // --- FIX: Refetch tasks to ensure UI is in sync ---
        await fetchTasks();
        if (updatedTaskData.status === undefined) {
          showActivityIndicator(id, 'edited');
        }

    } catch (err) {
        setError(err.message);
        throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete task');
      }
      // --- FIX: Refetch tasks after successful deletion ---
      await fetchTasks();
    } catch (err) {
      setError(err.message);
      // If the delete fails, we should refetch to restore the original state
      await fetchTasks();
    }
  };

  const value = {
    sortedTasks,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    highlightedTaskId,
    setHighlightedTaskId,
    activityIndicators,
    addTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};