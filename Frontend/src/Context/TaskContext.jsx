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
  const [loading, setLoading] = useState(true); // Only for initial load
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedTaskId, setHighlightedTaskId] = useState(null);
  const [activityIndicators, setActivityIndicators] = useState({}); // For new/edited tasks

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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
      setTasks(Array.isArray(data) ? data : (data.tasks || []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const pendingTasks = tasks.filter(task => !task.status);
    const completedTasks = tasks.filter(task => task.status);
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
      const taskData = { ...newTaskData, status: Boolean(newTaskData.status) };
      // Get the real task from the server first
      const res = await fetchWithAuth(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const savedTask = await res.json();
      if (!res.ok) throw new Error(savedTask.message || 'Failed to add task');
      
      // Optimistically add the server-confirmed task to state
      setTasks(prevTasks => [savedTask, ...prevTasks]);
      showActivityIndicator(savedTask._id, 'new');

    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to be caught in the modal
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
        
        // Optimistically update the task in the local state
        setTasks(prevTasks => prevTasks.map(t => t._id === id ? updatedTask : t));
        // Only show "edited" badge if it wasn't a status toggle
        if (updatedTaskData.status === undefined) {
          showActivityIndicator(id, 'edited');
        }

    } catch (err) {
        setError(err.message);
        throw err;
    }
  };

  const deleteTask = async (id) => {
    const originalTasks = tasks;
    // Optimistically remove the task from the UI immediately
    setTasks(prevTasks => prevTasks.filter(t => t._id !== id));
    
    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        // If the server fails, put the task back
        setTasks(originalTasks);
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete task');
      }
    } catch (err) {
      setError(err.message);
      // Revert state if the API call fails
      setTasks(originalTasks);
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