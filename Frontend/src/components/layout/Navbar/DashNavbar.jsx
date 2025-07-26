import { useTaskContext } from '../../../Context/TaskContext'; // ✨ IMPORT CONTEXT

export default function DashNavbar() {
  const { searchTerm, setSearchTerm } = useTaskContext(); // ✨ USE CONTEXT

  return (
    <div className="navbar-container">
      <span className="navbar-brand" style={{ fontFamily: '"Jersey 15", cursive', fontSize: "35px" }}>
        AlTogether
      </span>
      <span className="w-[800px]">
        <input
          type="text"
          placeholder="Search tasks..."
          style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
          className="search-input"
          value={searchTerm} // ✨ Control the input value
          onChange={(e) => setSearchTerm(e.target.value)} // ✨ Update context on change
        />
      </span>
    </div>
  );
}