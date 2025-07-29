// Frontend/src/components/layout/Sidebar.jsx

import { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutConfirmationModal from "../modals/LogoutConfirmationModal";

export default function Sidebar() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutRequest = () => {
    setIsLogoutModalOpen(true); // Just open the modal
  };

  const confirmLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await fetch('/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Failed to logout on server:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = '/login';
    }
  };

  return (
    <>
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-[280px] text-white flex flex-col shrink-0 z-40 p-4 bg-neutral-900/50 backdrop-blur-lg shadow-lg">
        <ul className="sidebar-menu flex-grow">
          <NavLink
            to="/home/dashboard"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <li className="flex items-center gap-2">
              <img src="/icons/dashboard.svg" alt="Dashboard" className="sidebar-icon" />
              Dashboard
            </li>
          </NavLink>

          <NavLink
            to="/home/tasks"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <li className="flex items-center gap-2">
              <img src="/icons/tasks.svg" alt="Tasks" className="sidebar-icon" />
              Tasks
            </li>
          </NavLink>

          <NavLink
            to="/home/profile"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <li className="flex items-center gap-2">
              <img src="/icons/profile.svg" alt="Profile" className="sidebar-icon" />
              Profile
            </li>
          </NavLink>
        </ul>

        {/* ✨ FIX: Logout button is now separate and pushed to the bottom */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <button onClick={handleLogoutRequest} className="sidebar-item w-full">
            <li className="flex items-center gap-2">
              <img src="/icons/logout.svg" alt="Logout" className="sidebar-icon" />
              Logout
            </li>
          </button>
        </div>
      </div>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
