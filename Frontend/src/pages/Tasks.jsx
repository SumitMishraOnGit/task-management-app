import React, { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/Tasks/TaskList';
import AddTaskModal from '../components/modals/AddTaskModal';
import TaskDetailsModal from '../components/modals/TaskDetailsModal';
import FloatingActionButton from '../components/ui/FloatingActionButton';

function Tasks() {
  const { sortedTasks, loading, error, addTask, updateTask, deleteTask, searchTerm } = useTaskContext();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
      return sortedTasks;
    }
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
          <div className="text-neutral-400 text-center py-4">Loading tasks...</div>
        ) : error ? (
          <div className="text-rose-400 text-center py-4">{error}</div>
        ) : (
          <TaskList
            sortedTasks={filteredTasks}
            toggleTaskStatus={handleToggleStatus}
            openTaskDetails={openTaskDetails}
            deleteTask={deleteTask}
          />
        )}
      </div>
      
      <FloatingActionButton onClick={() => setShowAddModal(true)} />
      
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAddTask={addTask}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          // ✨ FIX: Changed prop name from onUpdate to onSave
          onSave={updateTask}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}

export default Tasks;
