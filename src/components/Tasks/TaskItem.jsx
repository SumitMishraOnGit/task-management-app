import React from 'react';

const TaskItem = ({ task, toggleTaskStatus, openTaskDetails }) => {
  const truncateDescription = (description, wordLimit) => {
    if (!description) return '';
    const words = description.split(/\s+/);
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  return (
    <div
      className={`group grid grid-cols-[auto,1fr,100px,80px] md:grid-cols-[auto,1fr,150px,100px] gap-4 items-center py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out relative
        ${task.status === 'completed'
          ? 'bg-rose-700/30 border border-rose-600 scale-98 opacity-70'
          : 'bg-neutral-700 border border-neutral-600 hover:bg-neutral-600 scale-100 opacity-100'
        }`}
    >
      {/* Edit Button on Task Card - Hidden by default, visible on group hover */}
      <button
        type="button"
        onClick={() => openTaskDetails(task, true)} // Open in edit mode directly
        className="absolute top-2 right-2 p-1 text-neutral-300 hover:text-white transition-opacity duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10"
        aria-label="Edit Task"
      >
        {/* Pencil SVG Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      {/* Serial Number (index is passed from TaskList) */}
      <div className="text-center text-neutral-300 font-medium text-sm">
        {task.displayIndex}.
      </div>

      {/* Task Details */}
      <div className="flex flex-col">
        <h3 className={`font-semibold text-base ${task.status === 'completed' ? 'line-through text-neutral-400' : 'text-neutral-50'}`}>
          {task.title}
        </h3>
        {/* Conditional rendering for description with "Show More" */}
        {task.description && task.description.split(/\s+/).length > 20 ? (
          <p className={`text-xs ${task.status === 'completed' ? 'line-through text-neutral-500' : 'text-neutral-400'}`}>
            {truncateDescription(task.description, 20)}
            <button
              type="button"
              onClick={() => openTaskDetails(task)} // This opens in view mode by default
              className="ml-1 text-rose-400 hover:text-rose-300 font-medium"
            >
              Show More
            </button>
          </p>
        ) : (
          <p className={`text-xs ${task.status === 'completed' ? 'line-through text-neutral-500' : 'text-neutral-400'}`}>
            {task.description}
          </p>
        )}
      </div>

      {/* Due Date */}
      <div className="hidden md:block text-neutral-300 text-xs text-center">
        {task.dueDate}
      </div>

      {/* Status Checkbox */}
      <div className="flex justify-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={task.status === 'completed'}
            onChange={() => toggleTaskStatus(task.id)}
          />
          <div className="w-9 h-5 bg-neutral-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-neutral-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
          <span className="ml-2 text-xs font-medium text-neutral-300 hidden sm:block">
            {task.status === 'completed' ? 'Done' : 'Pending'}
          </span>
        </label>
      </div>
    </div>
  );
};

export default TaskItem;