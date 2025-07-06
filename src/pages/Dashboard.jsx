import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="bg-neutral-900/70 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-4 overflow-hidden">
        {/* top 2 boxes in a row */}
        <div className="flex w-full gap-4 h-2/3">
          <div className="dashboard-card w-1/5">
            <ul className="my-7 p-2 space-y-2">
              <li className="sidebar-item text-base text-white">
                <img src="/icons/dashboard.svg" alt="Dashboard" className="sidebar-icon" />
                Dashboard
              </li>
              <li className="sidebar-item text-lg">
                <img src="/icons/tasks.svg" alt="Tasks" className="sidebar-icon" />
                Tasks
              </li>
              <li className="sidebar-item text-lg">
                <img src="/icons/profile.svg" alt="Profile" className="sidebar-icon" />
                Profile
              </li>
              <li className="sidebar-item text-lg">
                <img src="/icons/logout.svg" alt="Logout" className="sidebar-icon" />
                Logout
              </li>
            </ul>
          </div>
          {/* <div className="dashboard-card w-3/5"></div> */}
          <div className="dashboard-card w-4/5"></div>
        </div>
        {/* bottom div */}
        <div className="dashboard-card w-full h-1/2"></div>
      </div>
    </Layout>
  );
}