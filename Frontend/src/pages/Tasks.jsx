// Frontend/src/pages/Tasks.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useTaskContext } from '../Context/TaskContext';
import TaskList from '../components/Tasks/TaskList';
import AddTaskModal from '../components/modals/AddTaskModal';
import TaskDetailsModal from '../components/modals/TaskDetailsModal';
import FloatingActionButton from '../components/ui/FloatingActionButton';

function Tasks() {
  const { 
    sortedTasks, loading, error, addTask, updateTask, deleteTask, 
    searchTerm, highlightedTaskId, setHighlightedTaskId, activityIndicators 
  } = useTaskContext();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  return (
    <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-3 overflow-hidden">
      <div className="task-div w-full h-full overflow-y-auto">
        {loading ? (
          <p className="text-center text-neutral-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-rose-400">{error}</p>
        ) : (
          <TaskList
            sortedTasks={filteredTasks}
            toggleTaskStatus={handleToggleStatus}
            openTaskDetails={openTaskDetails}
            deleteTask={deleteTask}
            highlightedTaskId={highlightedTaskId}
            activityIndicators={activityIndicators}
          />
        )}
      </div>
      
      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} onAddTask={addTask} />}
      {selectedTask && <TaskDetailsModal task={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} onSave={updateTask} isEditMode={isEditMode} />}
      <FloatingActionButton onClick={() => setShowAddModal(true)} />
    </div>
  );
}

export default Tasks;