import BlobbyBackground from "./BlobbyBackground";
import DashboardNavbar from "./DashNavbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";


export default function Layout({ children }) {
  return (
    <>
      <BlobbyBackground />
      <DashboardNavbar />
      <div className="flex">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
