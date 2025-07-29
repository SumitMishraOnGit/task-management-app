// Frontend/src/components/Tasks/TaskList.jsx

import React from 'react';
import TaskItem from './TaskItem';
import { AnimatePresence } from 'framer-motion';

const TaskList = ({ sortedTasks, toggleTaskStatus, openTaskDetails, deleteTask, highlightedTaskId, activityIndicators, loading }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-[auto,1fr,100px,80px] md:grid-cols-[auto,1fr,150px,100px] gap-4 items-center mb-4 pb-2 border-b border-neutral-600 text-neutral-400 font-semibold text-sm md:text-base">
        <div className="text-center">S.No.</div>
        <div>Task Title</div>
        <div className="hidden md:block text-center">Due Date</div>
        <div className="text-center">Status</div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-2">
          <AnimatePresence>
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task, index) => (
                <TaskItem
                  key={task._id}
                  task={{ ...task, displayIndex: index + 1 }}
                  toggleTaskStatus={toggleTaskStatus}
                  openTaskDetails={openTaskDetails}
                  deleteTask={deleteTask}
                  isHighlighted={task._id === highlightedTaskId}
                  activityType={activityIndicators[task._id]}
                />
              ))
            ) : (
              !loading && <p className="text-center text-neutral-400 text-lg py-8">No tasks found.</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
