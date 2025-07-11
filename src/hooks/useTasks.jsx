import { useState, useEffect } from 'react';

export const useTasks = (initialTasks) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [sortedTasks, setSortedTasks] = useState([]);

  useEffect(() => {
    // Separate pending and completed tasks
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    // Sort completed tasks by completedDate in descending order (most recent first)
    completedTasks.sort((a, b) => {
      // Handle cases where completedDate might be undefined or null for older tasks
      const dateA = new Date(a.completedDate || 0);
      const dateB = new Date(b.completedDate || 0);
      return dateB - dateA;
    });

    // Combine pending and sorted completed tasks
    setSortedTasks([...pendingTasks, ...completedTasks]);
  }, [tasks]);

  const addTask = (newTaskData) => {
    const newId = String(Date.now());
    const taskToAdd = {
      id: newId,
      title: newTaskData.title.trim(),
      description: newTaskData.description.trim(),
      dueDate: newTaskData.dueDate || null,
      status: 'pending',
    };
    setTasks(prevTasks => [...prevTasks, taskToAdd]);
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? {
            ...task,
            status: task.status === 'completed' ? 'pending' : 'completed',
            completedDate: task.status === 'pending' ? new Date().toISOString().slice(0, 10) : undefined
          }
        : task
    ));
  };

  const updateTask = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? { ...updatedTask, dueDate: updatedTask.dueDate || null } : task
      )
    );
  };

  return {
    tasks,
    sortedTasks,
    addTask,
    toggleTaskStatus,
    updateTask,
  };
};