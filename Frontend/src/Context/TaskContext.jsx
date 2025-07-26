import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

const API_URL = '/api/tasks';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();

  // ... (isAuthenticated, fetchTasks, and other functions remain the same)
  const isAuthenticated = () => !!localStorage.getItem('accessToken');

  const fetchTasks = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_URL}/paginated`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
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
    const pendingTasks = tasks.filter(task => !task.status);
    const completedTasks = tasks.filter(task => task.status);
    completedTasks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setSortedTasks([...pendingTasks, ...completedTasks]);
  }, [tasks]);

  const addTask = async (newTaskData) => {
    // ... (addTask logic is unchanged)
  };

  const updateTask = async (id, updatedTask) => {
    // ... (updateTask logic is unchanged)
  };

  const deleteTask = async (id) => {
    // ... (deleteTask logic is unchanged)
  };


  const value = {
    tasks,
    sortedTasks,
    loading,
    error,
    searchTerm, // ✨ PASS search term
    setSearchTerm, // ✨ PASS the function to update it
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
