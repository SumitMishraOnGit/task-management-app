import { useMemo } from 'react';
import { useTaskContext } from '../../../Context/TaskContext';
import { useNavigate } from 'react-router-dom';

export default function DashNavbar() {
  const { searchTerm, setSearchTerm, sortedTasks, setHighlightedTaskId } = useTaskContext();
  const navigate = useNavigate();

  // Filter tasks for the dropdown based on the search term
  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    return sortedTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 5); // Show top 5 results
  }, [sortedTasks, searchTerm]);

  // Handle clicking on a search result
  const handleResultClick = (taskId) => {
    setHighlightedTaskId(taskId); // Set the task to be highlighted
    navigate('/home/tasks');      // Navigate to the tasks page
    setSearchTerm('');            // Clear the search bar
  };

  return (
    <div className="navbar-container">
      <span className="navbar-brand" style={{ fontFamily: '"Jersey 15", cursive', fontSize: "35px" }}>
        AlTogether
      </span>
      
      <div className="relative w-[800px]">
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* ✨ This is the new interactive search results dropdown */}
        {searchTerm && (
          <div className="absolute top-full ml-14 mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 overflow-hidden">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div
                  key={task._id}
                  onClick={() => handleResultClick(task._id)}
                  className="p-3 hover:bg-rose-600/30 cursor-pointer border-b border-neutral-700 last:border-b-0"
                >
                  <p className="font-semibold text-white truncate">{task.title}</p>
                  <p className="text-neutral-400 text-xs truncate">{task.description || 'No description'}</p>
                </div>
              ))
            ) : (
              <div className="p-3 text-neutral-400 text-sm">No results found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
