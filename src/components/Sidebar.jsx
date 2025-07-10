import { NavLink } from "react-router-dom";
export default function Sidebar() {
  return (
    <div className="h-[calc(full - 4rem)] w-280px flex shrink-0">
      <div className="sidebar-container">
        <ul className="sidebar-menu">

          <NavLink
            to="/home/dashboard"
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' active bg-neutral-900 text-rose-400' : ''}`
            }
          >
            <li className="flex items-center gap-2">
              <img src="/icons/dashboard.svg" alt="Dashboard" className="sidebar-icon" />Dashboard
            </li>
          </NavLink>


          <NavLink
            to="/home/tasks"
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' active bg-neutral-900 text-rose-400' : ''}`
            }
          >
            <li className="flex items-center gap-2">
              <img src="/icons/tasks.svg" alt="Tasks" className="sidebar-icon" />
              Tasks
            </li>
          </NavLink>


          <NavLink
            to="/home/profile"
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' active bg-neutral-900 text-rose-400' : ''}`
            }
          >
            <li className="flex items-center gap-2">
              <img src="/icons/profile.svg" alt="Profile" className="sidebar-icon" />
              Profile
            </li>
          </NavLink>


          <NavLink
            to="/home/logout"
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' active bg-neutral-900 text-rose-400' : ''}`
            }
          >
            <li className="flex items-center gap-2">
              <img src="/icons/logout.svg" alt="Logout" className="sidebar-icon" />
              Logout
            </li>
          </NavLink>
        </ul>
      </div>
    </div>
  );
}
