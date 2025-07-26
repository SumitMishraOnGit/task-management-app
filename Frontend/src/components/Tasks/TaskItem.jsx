import React, { useState } from 'react';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const TaskItem = ({ task, toggleTaskStatus, openTaskDetails, deleteTask }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const truncateDescription = (description, wordLimit) => {
    if (!description) return '';
    const words = description.split(/\s+/);
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    // ✨ FIX 1: Added min-h-[75px] for consistent height and flex for alignment
    <div
      className={`group grid grid-cols-[auto,1fr,100px,80px] md:grid-cols-[auto,1fr,150px,100px] gap-4 items-center p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out relative min-h-[75px]
        ${task.status
          ? 'bg-rose-700/30 border border-rose-600 scale-98 opacity-70'
          : 'bg-neutral-800 border border-neutral-700/50 hover:bg-neutral-700 scale-100 opacity-100'
        }`}
    >
      {/* Edit Button */}
      <button
        type="button"
        onClick={() => openTaskDetails(task, true)}
        className="absolute top-2 right-8 p-1 text-neutral-300 hover:text-white transition-opacity duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10"
        aria-label="Edit Task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => setIsDeleteModalOpen(true)}
        className="absolute top-2 right-2 p-1 text-rose-400 hover:text-rose-300 transition-opacity duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10"
        aria-label="Delete Task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteTask(task._id);
          setIsDeleteModalOpen(false);
        }}
        taskTitle={task.title}
      />

      {/* Serial Number */}
      <div className="text-center text-neutral-300 font-medium text-sm">
        {task.displayIndex}.
      </div>

      {/* Task Details */}
      <div className="flex flex-col justify-center"> {/* Centered content vertically */}
        <h3 className={`font-semibold text-base ${task.status ? 'line-through text-neutral-400' : 'text-neutral-50'}`}>
          {task.title}
        </h3>
        {task.description && (
            <p className={`text-xs mt-1 ${task.status ? 'line-through text-neutral-500' : 'text-neutral-400'}`}>
                {truncateDescription(task.description, 15)}
                <button
                type="button"
                onClick={() => openTaskDetails(task)}
                className="ml-1 text-rose-400 hover:text-rose-300 font-medium"
                >
                Show More
                </button>
            </p>
        )}
      </div>

      {/* Due Date */}
      <div className="hidden md:block text-neutral-300 text-xs text-center">
        {formatDate(task.dueDate)}
      </div>

      {/* Status Checkbox */}
      <div className="flex justify-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={task.status}
            onChange={() => toggleTaskStatus(task._id)}
          />
          <div className="w-9 h-5 bg-neutral-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-neutral-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
        </label>
      </div>
    </div>
  );
};

export default TaskItem;
