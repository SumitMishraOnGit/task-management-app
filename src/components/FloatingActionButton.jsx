import React from 'react';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6
        bg-rose-600 hover:bg-rose-700
        text-white
        h-14 rounded-full
        shadow-lg
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-neutral-900
        z-[9999]
        flex items-center justify-center
        group-hover:justify-start
        px-4
        w-14 hover:w-40
        group
        overflow-hidden
      "
      aria-label="Add New Task"
    >
      {/* Plus icon - visible normally, shifts left on hover */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 transition-all duration-300 ease-in-out shrink-0 group-hover:-ml-1"
      >
        <path
          fillRule="evenodd"
          d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25v5.25a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
          clipRule="evenodd"
        />
      </svg>

      {/* "Add Task" text - hidden normally, fades in on hover */}
      <span
        className="
          ml-2 text-base font-semibold
          whitespace-nowrap opacity-0 group-hover:opacity-100
          transition-all duration-300 ease-in-out
          absolute translate-x-[100px] group-hover:translate-x-0 group-hover:relative
        "
      >
        Add Task
      </span>
    </button>
  );
};

export default FloatingActionButton;