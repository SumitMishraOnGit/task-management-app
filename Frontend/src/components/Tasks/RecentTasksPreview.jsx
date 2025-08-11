
const priorityStyles = {
  high: "text-red-400 bg-red-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  low: "text-green-400 bg-green-400/10",
  default: "text-gray-400 bg-gray-400/10", 
};

export default function RecentTasksPreview({ tasks, loading, error }) {
  if (loading) {
    return (
      <div className="dashboard-card w-full h-auto p-4 flex-grow">
        <h3 className="text-lg font-semibold text-neutral-200 mb-2">Upcoming Tasks</h3>
        <div className="text-neutral-400">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card w-full h-auto p-4 flex-grow">
        <h3 className="text-lg font-semibold text-neutral-200 mb-2">Upcoming Tasks</h3>
        <div className="text-rose-400">{error}</div>
      </div>
    );
  }

  // Use only pending tasks for the preview
  const pendingTasks = tasks?.filter(task => !task.status) || [];
  
  // Sort by due date ascending (sooner tasks first)
  const sortedTasks = [...pendingTasks].sort((a, b) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Show only the top 3 upcoming tasks
  const previewTasks = sortedTasks.slice(0, 3);

  return (
    <div className="dashboard-card w-full h-auto p-4 flex-grow relative flex flex-col">
      <h3 className="text-lg font-semibold text-neutral-200 mb-2">Upcoming Tasks</h3>
      {/* Header */}
      <div className="grid grid-cols-[auto,1fr,150px,100px] gap-4 items-center mb-1 pb-1 border-b border-neutral-600 text-neutral-400 font-semibold text-xs md:text-sm">
        <div className="text-center">S.No.</div>
        <div>Task Title</div>
        <div className="text-center">Due Date</div>
        <div className="text-center">Status</div>
      </div>
      {/* Task Rows */}
      <div className="space-y-2">
        {previewTasks.length > 0 ? (
          previewTasks.map((task, idx) => (
            <div
              key={task._id} // ✨ FIX: Use _id for the key
              className={`grid grid-cols-[auto,1fr,150px,100px] gap-4 items-center py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out bg-neutral-800 border border-neutral-700/50`}
            >
              <div className="text-center text-neutral-300 font-medium text-xs">{idx + 1}.</div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-50">{task.title}</span>
              </div>
              <div className="text-neutral-300 text-xs text-center">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium text-center ${priorityStyles.default}`}>
                Pending
              </span>
            </div>
          ))
        ) : (
          <p className="text-neutral-400 text-center py-4">No pending tasks found.</p>
        )}
      </div>
    </div>
  );
}
