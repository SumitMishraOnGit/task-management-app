import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/Tasks/TaskList';
import AddTaskModal from '../components/modals/AddTaskModal';
import TaskDetailsModal from '../components/modals/TaskDetailsModal';
import FloatingActionButton from '../components/ui/FloatingActionButton';

function Tasks() {
  const { tasks, loading, error, addTask, updateTask, deleteTask, fetchTasks } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    console.log('Current tasks:', tasks);
  }, [tasks]);

  // Sort tasks: pending first, then completed
  const sortedTasks = [...(tasks || [])].sort((a, b) => {
    if (a.status === b.status) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.status ? 1 : -1;
  });

  const handleAddTask = async (newTask) => {
    try {
      console.log('Adding new task:', newTask);
      await addTask(newTask);
      console.log('Task added successfully');
      await fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      console.log('Updating task:', taskId, 'with data:', updatedTask);
      await updateTask(taskId, updatedTask);
      console.log('Task updated successfully');
      await fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      console.log('Deleting task:', taskId);
      await deleteTask(taskId);
      console.log('Task deleted successfully');
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      try {
        console.log('Toggling task status:', taskId, 'from', task.status, 'to', !task.status);
        await updateTask(taskId, { status: !task.status });
        console.log('Task status toggled successfully');
        await fetchTasks();
      } catch (error) {
        console.error('Error toggling task status:', error);
      }
    }
  };

  const openTaskDetails = (task, editMode = false) => {
    console.log('Opening task details:', task, 'in', editMode ? 'edit' : 'view', 'mode');
    setSelectedTask(task);
    setIsEditMode(editMode);
  };

  return (
    <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-3 overflow-hidden">
      <div className="task-div w-full h-full overflow-y-auto">
        {loading ? (
          <div className="text-neutral-400 text-center py-4">Loading tasks...</div>
        ) : error ? (
          <div className="text-rose-400 text-center py-4">{error}</div>
        ) : (
          <TaskList
            sortedTasks={sortedTasks}
            toggleTaskStatus={handleToggleStatus}
            openTaskDetails={openTaskDetails}
            deleteTask={handleDeleteTask}
          />
        )}
      </div>
      
      <FloatingActionButton onClick={() => setShowAddModal(true)} />
      
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAddTask={handleAddTask}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}

export default Tasks;


