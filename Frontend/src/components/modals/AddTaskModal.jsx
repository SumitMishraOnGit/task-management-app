import React, { useState } from 'react';
import { enhanceDescriptionWithGemini, getEnhanceModes, getRateLimitInfo } from '../../utils/geminiApi';
import TagInput from '../ui/TagInput';

const AddTaskModal = ({ onClose, onAddTask }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: false,
    tags: []
  });
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showEnhanceMenu, setShowEnhanceMenu] = useState(false);
  const [enhanceError, setEnhanceError] = useState('');

  const enhanceModes = getEnhanceModes();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewTask(prev => ({ ...prev, [name]: checked }));
    } else {
      setNewTask(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEnhanceDescription = async (mode) => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title first!');
      return;
    }

    setShowEnhanceMenu(false);
    setIsGeneratingDescription(true);
    setEnhanceError('');

    try {
      const enhancedDescription = await enhanceDescriptionWithGemini(newTask.title, newTask.description, mode);
      setNewTask(prev => ({ ...prev, description: enhancedDescription }));
    } catch (error) {
      console.error('Error enhancing description:', error);
      setEnhanceError(error.message);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert('Task title cannot be empty!');
      return;
    }
    try {
      await onAddTask({
        ...newTask,
        status: Boolean(newTask.status),
        dueDate: newTask.dueDate || null
      });
      setNewTask({ title: '', description: '', dueDate: '', status: false, tags: [] });
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const rateLimitInfo = getRateLimitInfo();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-4xl relative border border-neutral-800 overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all duration-200 z-10"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-800">
            <h3 className="text-xl font-semibold text-white">New Task</h3>
          </div>

          {/* Content - Responsive Grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">

            {/* Left Column */}
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
                  Tags
                </label>
                <TagInput
                  tags={newTask.tags}
                  onChange={(tags) => setNewTask(prev => ({ ...prev, tags }))}
                  maxTags={5}
                />
              </div>

              {/* Status Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="status"
                    checked={newTask.status}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-700 rounded-full peer peer-checked:bg-rose-600 transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className="text-neutral-400 text-sm group-hover:text-white transition-colors">Mark as complete</span>
              </label>
            </div>

            {/* Right Column */}
            <div className="space-y-5 flex flex-col">
              {/* Description */}
              <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="description" className="text-neutral-400 text-xs font-medium uppercase tracking-wider">
                    Description
                  </label>

                  {/* AI Enhance Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEnhanceMenu(!showEnhanceMenu)}
                      disabled={isGeneratingDescription}
                      className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-medium transition-colors disabled:opacity-50 bg-rose-500/10 px-3 py-1.5 rounded-full hover:bg-rose-500/20"
                    >
                      {isGeneratingDescription ? (
                        <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      ) : (
                        <span>✨</span>
                      )}
                      {isGeneratingDescription ? 'Generating...' : 'AI Enhance'}
                      {!isGeneratingDescription && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {showEnhanceMenu && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-20 py-1">
                        <div className="px-3 py-2 border-b border-neutral-700">
                          <p className="text-xs text-neutral-500">{rateLimitInfo.remaining} requests left</p>
                        </div>
                        {enhanceModes.map((mode) => (
                          <button
                            key={mode.key}
                            type="button"
                            onClick={() => handleEnhanceDescription(mode.key)}
                            className="w-full px-3 py-2 text-left hover:bg-neutral-700 transition-colors"
                          >
                            <div className="text-sm text-white font-medium">{mode.label}</div>
                            <div className="text-xs text-neutral-500">{mode.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Error message */}
                {enhanceError && (
                  <div className="mb-2 text-xs text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg">
                    {enhanceError}
                  </div>
                )}

                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="w-full flex-grow min-h-[180px] lg:min-h-0 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none"
                  placeholder="Add more details..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
