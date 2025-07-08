export default function Sidebar() {
  return (
    <div className="h-[calc(full - 4rem)] w-280px flex shrink-0">
      <div className="sidebar-container">
        <ul className="sidebar-menu">
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
  );
}
