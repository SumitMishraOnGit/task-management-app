import TaskDistributionChart from '../components/ChartLogic'; // Import the chart component

export default function Dashboard() {
  return (
    <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-4 overflow-hidden">
      {/* top 2 boxes in a row */}
      <div className="flex w-full gap-4 h-2/3">
        {/* first div for duration of data shown */}
        <div className="dashboard-card w-2/7 rounded-2xl p-6 flex flex-col text-white">
          <h2 className="text-lg font-semibold text-neutral-200 mb-2">Statistics</h2>
          <p className="text-sm text-neutral-400 mb-6">Showing data for this week.</p>

          <div className="flex flex-col gap-2 mb-4">
            {/* Example of an active button */}
            <button className="text-left p-3 rounded-lg text-sm transition-colors bg-rose-500/10 text-rose-400 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 ">
              Weekly View
            </button>
            {/* Example of an inactive button - refined hover */}
            <button className="text-left p-3 rounded-lg text-sm transition-colors hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50">
              Monthly View
            </button>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-sm">Total Tasks</span>
              <span className="font-semibold text-neutral-100 text-sm">25</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 text-sm">Completed</span>
              <span className="font-semibold text-green-400 text-sm">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rose-600 text-sm">Pending</span>
              <span className="font-semibold text-rose-400 text-sm">7</span>
            </div>
          </div>
        </div>

        {/* actual data in the form of charts with the help of recharts.js */}
        <div className="dashboard-card flex-grow w-5/7 p-4 h-full flex flex-col"> {/* Added h-full and flex flex-col */}
          <h3 className="text-lg font-semibold text-neutral-200 mb-4">Task Distribution</h3>
          {/* Ensure TaskDistributionChart is NOT commented out here */}
          <div className="flex-grow"> {/* This div ensures the chart fills remaining space */}
            <TaskDistributionChart />
          </div>
        </div>
      </div>
      {/* bottom div, recent tasks to be shown */}
      <div className="dashboard-card w-full h-2/3 p-4 flex-grow"> {/* Added flex-grow here for better height distribution */}
        <h3 className="text-lg font-semibold text-neutral-200 mb-4">Recent Tasks</h3>
        {/* Content for recent tasks goes here */}
        <p className="text-neutral-400">List of recent tasks will appear here.</p>
      </div>
    </div>
  );
}
