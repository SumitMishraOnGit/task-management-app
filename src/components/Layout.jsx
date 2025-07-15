import BlobbyBackground from "./BlobbyBackground";
import DashboardNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";


export default function Layout({ children }) {
  return (
    <>
      <BlobbyBackground />
      <DashboardNavbar />
      <Sidebar />
      <div className="main-content ml-[280px] mt-16 h-[calc(100vh-4rem)] overflow-auto">
        <Outlet />
      </div>
    </>
  );
}
