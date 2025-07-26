import React, { useState, useEffect } from 'react';

const TaskDetailsModal = ({ task, isOpen, onClose, onSave, isEditMode }) => {
  const [isEditingTask, setIsEditingTask] = useState(isEditMode);
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task);
    setIsEditingTask(isEditMode);
  }, [task, isEditMode]);

  if (!isOpen) return null;

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEditedTask = (e) => {
    e.preventDefault();
    if (!editedTask.title.trim()) {
      alert('Task title cannot be empty!');
      return;
    }
    onSave(task._id, editedTask);
    onClose();
  };
  
  const formattedDueDate = editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : '';

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-[100]" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-neutral-800/70 border-t border-neutral-600 rounded-xl shadow-2xl p-6 md:p-8 w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100 text-3xl font-bold transition-colors duration-200"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-2xl font-semibold text-neutral-50 mb-4 text-center">
          {isEditingTask ? 'Edit Task' : 'Task Details'}
        </h3>

        {isEditingTask ? (
          <form onSubmit={handleSaveEditedTask}>
            {/* Form content remains the same... */}
            <div className="mb-4">
              <label htmlFor="editTitle" className="block text-neutral-300 text-sm font-medium mb-1">Task Title</label>
              <input
                type="text"
                id="editTitle"
                name="title"
                value={editedTask.title}
                onChange={handleEditInputChange}
                className="w-full p-2 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-100 focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editDueDate" className="block text-neutral-300 text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                id="editDueDate"
                name="dueDate"
                value={formattedDueDate}
                onChange={handleEditInputChange}
                className="w-full p-2 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-100 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="editDescription" className="block text-neutral-300 text-sm font-medium mb-1">Description</label>
              <textarea
                id="editDescription"
                name="description"
                value={editedTask.description || ''}
                onChange={handleEditInputChange}
                rows="5"
                className="w-full p-2 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-100 focus:ring-rose-500 focus:border-rose-500"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditingTask(false)}
                className="bg-neutral-600 hover:bg-neutral-700 text-neutral-100 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-neutral-300">
            {/* View content remains the same... */}
            <div>
              <p className="font-semibold text-lg text-neutral-50">{task.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400 mb-1">Description:</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p><span className="font-medium text-neutral-400">Due Date:</span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</p>
              <p><span className="font-medium text-neutral-400">Status:</span> {task.status ? 'Completed' : 'Pending'}</p>
            </div>
            <div className="flex justify-end pt-4 border-t border-neutral-700">
              <button
                type="button"
                onClick={() => setIsEditingTask(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
              >
                Edit Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;