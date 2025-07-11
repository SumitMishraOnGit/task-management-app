import React, { useState } from 'react';
import { enhanceDescriptionWithGemini } from '../utils/geminiApi';

const AddTaskModal = ({ onClose, onAddTask }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleEnhanceDescription = async () => {
    if (!newTask.title.trim()) {
      alert("Please enter a Task Title before enhancing the description.");
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const generatedText = await enhanceDescriptionWithGemini(newTask.title, newTask.description);
      setNewTask(prev => ({ ...prev, description: generatedText }));
    } catch (error) {
      alert(error.message); // Display error from utility function
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert('Task title cannot be empty!');
      return;
    }
    onAddTask(newTask);
    setNewTask({ title: '', description: '', dueDate: '' }); // Clear form
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-[100]" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="bg-neutral-800 rounded-xl shadow-2xl p-6 md:p-8 w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100 text-3xl font-bold transition-colors duration-200"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-2xl font-semibold text-neutral-50 mb-4 text-center">Add New Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-neutral-300 text-sm font-medium mb-1">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-100 focus:ring-rose-500 focus:border-rose-500"
              placeholder="e.g., Finish project report"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-neutral-300 text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-100 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="description" className="block text-neutral-300 text-sm font-medium">Description (Optional)</label>
              <button
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isGeneratingDescription}
                className="flex items-center text-rose-400 hover:text-rose-300 text-xs font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingDescription ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  '✨ Enhance Description'
                )}
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-100 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Detailed description of the task..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;