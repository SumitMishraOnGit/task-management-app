// Frontend/src/context/TaskContext.jsx

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
  const navigate = useNavigate();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pendingTasks = tasks.filter(task => !task.status);
    const completedTasks = tasks.filter(task => task.status);
    completedTasks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setSortedTasks([...pendingTasks, ...completedTasks]);
  }, [tasks]);

  const addTask = async (newTaskData) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setError(null);
    try {
      const taskData = { ...newTaskData, status: Boolean(newTaskData.status) };
      const res = await fetchWithAuth(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add task');
      await fetchTasks(); // Refetch to get the latest list
    } catch (err) {
      setError(err.message);
      if (err.message.includes('unauthorized')) navigate('/login');
      throw err;
    }
  };

  const updateTask = async (id, updatedTask) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setError(null);
    try {
      const taskData = {
        ...updatedTask,
        status: updatedTask.status !== undefined ? Boolean(updatedTask.status) : undefined,
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
      await fetchTasks(); // Refetch
    } catch (err) {
      setError(err.message);
      if (err.message.includes('unauthorized')) navigate('/login');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete task');
      }
      // Optimistic update is fine here
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
      if (err.message.includes('unauthorized')) navigate('/login');
    }
  };

  const value = {
    tasks,
    sortedTasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};