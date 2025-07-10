export default function DashNavbar() {
  return (
    <div className="navbar-container">
      <span className="navbar-brand" style={{ fontFamily: '"Jersey 15", cursive', fontSize: "35px" }}>
        AlTogether
      </span>
      <span className="w-[800px]">
        <input
          type="text"
          placeholder="Search tasks, users, anything..."
          style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
          className="search-input"
        />
      </span>
    </div>
  );
}
