import BlobbyBackground from "../ui/BlobbyBackground";
import DashboardNavbar from "./Navbar/DashNavbar";
import Sidebar from "./Sidebar";
import FloatingActionButton from "../ui/FloatingActionButton";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AddTaskModal from "../modals/AddTaskModal";
import { useTaskContext } from "../../Context/TaskContext"; // ✨ USE CONTEXT

export default function Layout() {
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const { addTask } = useTaskContext(); // ✨ GET addTask from context

  return (
    <>
      <BlobbyBackground />
      <DashboardNavbar />
      <Sidebar />
      <div className="main-content ml-[280px] mt-16 h-[calc(100vh-4rem)] overflow-auto">
        <Outlet />
      </div>
      
      <FloatingActionButton onClick={() => setIsAddTaskPopupOpen(true)} />
      
      {isAddTaskPopupOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskPopupOpen(false)}
          onAddTask={addTask} // ✨ Pass the function from context
        />
      )}
    </>
  );
}