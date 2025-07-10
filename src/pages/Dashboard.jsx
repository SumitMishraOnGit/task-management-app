import { NavLink } from "react-router-dom"
export default function Dashboard() {
  return (
    <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-4 overflow-hidden">
      {/* top 2 boxes in a row */}
      <div className="flex w-full gap-4 h-2/3">
        <div className="dashboard-card w-1/5">
        
        </div>
        {/* <div className="dashboard-card w-3/5"></div> */}
        <div className="dashboard-card w-4/5"></div>
      </div>
      {/* bottom div */}
      <div className="dashboard-card w-full h-1/2"></div>
    </div>
  );
}