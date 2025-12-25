import React, { useState, useEffect } from 'react';
import TagInput from '../ui/TagInput';
import TagChip from '../ui/TagChip';
import { enhanceDescriptionWithGemini, getEnhanceModes, getRateLimitInfo } from '../../utils/geminiApi';

const TaskDetailsModal = ({ task, isOpen, onClose, onSave, isEditMode }) => {
  const [isEditingTask, setIsEditingTask] = useState(isEditMode);
  const [editedTask, setEditedTask] = useState(task);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showEnhanceMenu, setShowEnhanceMenu] = useState(false);
  const [enhanceError, setEnhanceError] = useState('');

  const enhanceModes = getEnhanceModes();

  useEffect(() => {
    setEditedTask(task);
    setIsEditingTask(isEditMode);
  }, [task, isEditMode]);

  if (!isOpen) return null;

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleEnhanceDescription = async (mode) => {
    if (!editedTask.title.trim()) {
      alert('Please enter a task title first!');
      return;
    }

    setShowEnhanceMenu(false);
    setIsGeneratingDescription(true);
    setEnhanceError('');

    try {
      const enhancedDescription = await enhanceDescriptionWithGemini(editedTask.title, editedTask.description, mode);
      setEditedTask(prev => ({ ...prev, description: enhancedDescription }));
    } catch (error) {
      console.error('Error enhancing description:', error);
      setEnhanceError(error.message);
    } finally {
      setIsGeneratingDescription(false);
    }
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
  const rateLimitInfo = getRateLimitInfo();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-4xl relative border border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">

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

        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex-shrink-0">
          <h3 className="text-xl font-semibold text-white">
            {isEditingTask ? 'Edit Task' : 'Task Details'}
          </h3>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto">
          {isEditingTask ? (
            <form onSubmit={handleSaveEditedTask}>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label htmlFor="editTitle" className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      id="editTitle"
                      name="title"
                      value={editedTask.title}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
                      required
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label htmlFor="editDueDate" className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="editDueDate"
                      name="dueDate"
                      value={formattedDueDate}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
                      Tags
                    </label>
                    <TagInput
                      tags={editedTask.tags || []}
                      onChange={(tags) => setEditedTask(prev => ({ ...prev, tags }))}
                      maxTags={5}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="editDescription" className="text-neutral-400 text-xs font-medium uppercase tracking-wider">
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
                    id="editDescription"
                    name="description"
                    value={editedTask.description || ''}
                    onChange={handleEditInputChange}
                    className="w-full flex-grow min-h-[200px] lg:min-h-0 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingTask(false)}
                  className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Meta */}
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">Title</p>
                    <h4 className="text-xl font-semibold text-white">{task.title}</h4>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${task.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${task.status ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                      {task.status ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div>
                    <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">Due Date</p>
                    <p className="text-white">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                        : 'No due date'
                      }
                    </p>
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div>
                      <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <TagChip key={index} tag={tag} size="md" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Description */}
                <div>
                  <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">Description</p>
                  <div className="bg-neutral-800/50 rounded-lg p-4 min-h-[150px] lg:min-h-[200px]">
                    <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed">
                      {task.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingTask(true)}
                  className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;