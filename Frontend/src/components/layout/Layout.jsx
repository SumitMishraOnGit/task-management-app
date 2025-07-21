import BlobbyBackground from "../ui/BlobbyBackground";
import DashboardNavbar from "./Navbar/DashNavbar";
import Sidebar from "./Sidebar";
import FloatingActionButton from "../ui/FloatingActionButton";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AddTaskModal from "../modals/AddTaskModal";
import { useTasks } from "../../hooks/useTasks";


export default function Layout({ children }) {
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const { addTask } = useTasks();

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
          onAddTask={addTask}
        />
      )}

      <FloatingActionButton onClick={() => setIsAddTaskPopupOpen(true)} />

      {isAddTaskPopupOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskPopupOpen(false)}
          onAddTask={(newTask) => {
            // Handle adding task here or through context if needed
            setIsAddTaskPopupOpen(false);
          }}
        />
      )}
    </>
  );
}
