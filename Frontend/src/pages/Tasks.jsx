// Frontend/src/pages/Tasks.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useTaskContext } from '../Context/TaskContext';
import TaskList from '../components/Tasks/TaskList';
import AddTaskModal from '../components/modals/AddTaskModal';
import TaskDetailsModal from '../components/modals/TaskDetailsModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import FloatingActionButton from '../components/ui/FloatingActionButton';

function Tasks() {
  const { 
    sortedTasks, loading, error, addTask, updateTask, deleteTask, 
    searchTerm, highlightedTaskId, setHighlightedTaskId, activityIndicators 
  } = useTaskContext();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (highlightedTaskId) {
      const element = document.getElementById(`task-${highlightedTaskId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const timer = setTimeout(() => setHighlightedTaskId(null), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightedTaskId, setHighlightedTaskId]);

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return sortedTasks;
    return sortedTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedTasks, searchTerm]);

  const handleToggleStatus = (taskId) => {
    const task = sortedTasks.find(t => t._id === taskId);
    if (task) {
      updateTask(taskId, { status: !task.status });
    }
  };

  const openTaskDetails = (task, editMode = false) => {
    setSelectedTask(task);
    setIsEditMode(editMode);
  };
  
  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete._id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-3 overflow-hidden">
      <div className="task-div w-full h-full overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-[auto,1fr,100px,80px] md:grid-cols-[auto,1fr,150px,100px] dashboard-card gap-4 m-2 items-center mb-4 pb-2 border-b border-neutral-600 text-neutral-400 font-semibold text-sm md:text-base">
        <div className="text-center">S.No.</div>
        <div>Task Title</div>
        <div className="hidden md:block text-center">Due Date</div>
        <div className="text-center">Status</div>
      </div>
        ) : error ? (
          <p className="text-center text-rose-400">{error}</p>
        ) : (
          <TaskList
            sortedTasks={filteredTasks}
            toggleTaskStatus={handleToggleStatus}
            openTaskDetails={openTaskDetails}
            deleteTask={handleDeleteRequest}
            highlightedTaskId={highlightedTaskId}
            activityIndicators={activityIndicators}
            loading={loading} 
          />
        )}
      </div>
      
      <FloatingActionButton onClick={() => setShowAddModal(true)} />
      
      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} onAddTask={addTask} />}
      
      {selectedTask && <TaskDetailsModal task={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} onSave={updateTask} isEditMode={isEditMode} />}
      
      {taskToDelete && (
        <DeleteConfirmationModal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleConfirmDelete}
          taskTitle={taskToDelete.title}
        />
      )}
    </div>
  );
}

export default Tasks;
