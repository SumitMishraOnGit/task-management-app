import React from "react";

const dummyTasks = [
  {
    id: "1",
    title: "Finish landing page",
    dueDate: "2025-07-22",
    priority: "high",
    status: "pending",
  },
  {
    id: "2",
    title: "Fix bug in auth flow",
    dueDate: "2025-07-25",
    priority: "medium",
    status: "completed",
  },
  {
    id: "3",
    title: "Update README docs",
    dueDate: "2025-07-28",
    priority: "low",
    status: "pending",
  },
  {
    id: "4",
    title: "Optimize image loading",
    dueDate: "2025-07-21",
    priority: "high",
    status: "pending",
  },
];

const priorityStyles = {
  high: "text-red-400 bg-red-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  low: "text-green-400 bg-green-400/10",
};

export default function RecentTasksPreview({ tasks }) {
  // Use provided tasks or fallback to dummyTasks
  const allTasks = tasks && tasks.length > 0 ? tasks : dummyTasks;
  // Sort by priority (high > medium > low), then by due date ascending
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTasks = [...allTasks].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  // Show only top 3 highest priority tasks
  const previewTasks = sortedTasks.slice(0, 3);

  return (
    <div className="dashboard-card w-full h-auto p-4 flex-grow relative flex flex-col">
      <h3 className="text-lg font-semibold text-neutral-200 mb-2">Top Priority</h3>
      {/* Header */}
      <div className="grid grid-cols-[auto,1fr,100px,80px] md:grid-cols-[auto,1fr,150px,100px] gap-4 items-center mb-1 pb-1 border-b border-neutral-600 text-neutral-400 font-semibold text-xs md:text-sm">
        <div className="text-center">S.No.</div>
        <div>Task Title</div>
        <div className="hidden md:block text-center">Due Date</div>
        <div className="text-center">Priority</div>
      </div>
      {/* Task Rows */}
      <div className="space-y-2">
        {previewTasks.length > 0 ? (
          previewTasks.map((task, idx) => (
            <div
              key={task.id}
              className={`grid grid-cols-[auto,1fr,100px,80px] md:grid-cols-[auto,1fr,150px,100px] gap-4 items-center py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out bg-neutral-800 border border-neutral-700/50`}
            >
              <div className="text-center text-neutral-300 font-medium text-xs">{idx + 1}.</div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-50">{task.title}</span>
              </div>
              <div className="hidden md:block text-neutral-300 text-xs text-center">
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium text-center ${priorityStyles[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-neutral-400 text-center py-4">No top priority tasks found.</p>
        )}
      </div>
    </div>
  );
} 