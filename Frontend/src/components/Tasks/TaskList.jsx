
import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ sortedTasks, toggleTaskStatus, openTaskDetails, deleteTask }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Task List Header */}
      <div className="grid grid-cols-[auto,1fr,100px,80px] md:grid-cols-[auto,1fr,150px,100px] gap-4 items-center mb-4 pb-2 border-b border-neutral-600 text-neutral-400 font-semibold text-sm md:text-base">
        <div className="text-center">S.No.</div>
        <div>Task Title</div>
        <div className="hidden md:block text-center">Due Date</div>
        <div className="text-center">Status</div>
      </div>

      {/* Task List Items */}
      <div className="flex-1 overflow-auto">
        {sortedTasks.length > 0 ? (
          <div className="space-y-2">
            {sortedTasks.map((task, index) => (
              // ✨ FIX: Use task._id for the key, as it's the unique identifier from MongoDB
              <React.Fragment key={task._id}>
                {task.status && sortedTasks[index - 1]?.status !== true && (
                  <div className="flex items-center justify-center text-neutral-400 font-semibold mt-6 mb-2 pt-2">
                    <span className="text-lg mr-2">Completed Tasks</span>
                    <span className="flex-grow border-b border-neutral-600"></span>
                  </div>
                )}
                <TaskItem
                  task={{ ...task, displayIndex: index + 1 }}
                  toggleTaskStatus={toggleTaskStatus}
                  openTaskDetails={openTaskDetails}
                  deleteTask={deleteTask}
                />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-400 text-lg py-8">No tasks found. Add some tasks to get started!</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;