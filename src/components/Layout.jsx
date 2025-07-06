import BlobbyBackground from "./BlobbyBackground";
export default function Layout({ children }) {
  return (
    <>
      <BlobbyBackground />
      {/* ---dashboard-navbar--- */}
      <div className="navbar-container">
        <span className="navbar-brand" style={{ fontFamily: '"Jersey 15", cursive', fontSize: "35px" }}>AlTogether</span>
        <span className="w-[800px]" >
          <input
            type="text"
            placeholder="Search tasks, users, anything..."
            style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
            className="search-input"
          />
        </span>
      </div>
      {/* ---Main Content Area--- */}
      <div className="flex" >
        {/* ---Sidebar--- */}
        <div className="h-[calc(full - 4rem)] w-280px flex shrink-0" >
          <div className="sidebar-container">
            <ul className="sidebar-menu">
              {/* this is just example here "only the duration of grpah rendered will be shown." */}
              <li className="sidebar-item text-base">
                <img src="/icons/dashboard.svg" alt="Dashboard" className="sidebar-icon" />
                Dashboard
              </li>
              <li className="sidebar-item">
                <img src="/icons/tasks.svg" alt="Tasks" className="sidebar-icon" />
                Tasks
              </li>
              <li className="sidebar-item">
                <img src="/icons/profile.svg" alt="Profile" className="sidebar-icon" />
                Profile
              </li>
              <li className="sidebar-item">
                <img src="/icons/logout.svg" alt="Logout" className="sidebar-icon" />
                Logout
              </li>
            </ul>
          </div>
        </div>
        {/* Render children here, alongside the sidebar content */}
        <div className="main-content">
          {children}
        </div>
      </div>
    </>
  );
}