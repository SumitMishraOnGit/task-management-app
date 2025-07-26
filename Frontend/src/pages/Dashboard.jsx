import TaskDistributionChart from '../components/ChartLogic';
import RecentTasksPreview from '../components/Tasks/RecentTasksPreview';
import { useTaskContext } from '../Context/TaskContext'; // ✨ IMPORT CONTEXT
import { useTaskStats, useTaskAnalytics } from '../hooks/useTaskStats';
import { useState } from 'react';

function isTrivialStatsError(error) {
  if (!error) return false;
  const lower = error.toLowerCase();
  return (
    lower.includes('no tasks') ||
    lower.includes('not found') ||
    lower.includes('access token expired') ||
    lower.includes('jwt expired') ||
    lower.includes('invalid token')
  );
}

export default function Dashboard() {
  const { tasks } = useTaskContext(); // ✨ GET TASKS FROM CONTEXT
  const [range, setRange] = useState('weekly');
  const { stats, loading, error } = useTaskStats(range);
  const { data: chartData, loading: chartLoading, error: chartError } = useTaskAnalytics(range);

  return (
    <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-4 overflow-hidden">
      {/* top 2 boxes in a row */}
      <div className="flex w-full gap-4 h-2/3">
        {/* first div for duration of data shown */}
        <div className="dashboard-card w-2/7 rounded-2xl p-4 flex flex-col text-white">
          <h2 className="text-lg font-semibold text-neutral-200 mb-2">Statistics</h2>
          <p className="text-sm text-neutral-400 mb-6">Showing data for this {range}.</p>

          <div className="flex flex-col gap-2 mb-4">
            <button
              className={`text-left p-3 rounded-lg text-sm transition-colors ${range === 'weekly' ? 'bg-rose-500/10 text-rose-400 font-semibold' : 'hover:bg-neutral-700 hover:text-white'} focus:outline-none focus:ring-2 focus:ring-rose-500`}
              onClick={() => setRange('weekly')}
            >
              Weekly View
            </button>
            <button
              className={`text-left p-3 rounded-lg text-sm transition-colors ${range === 'monthly' ? 'bg-rose-500/10 text-rose-400 font-semibold' : 'hover:bg-neutral-700 hover:text-white'} focus:outline-none focus:ring-2 focus:ring-rose-500`}
              onClick={() => setRange('monthly')}
            >
              Monthly View
            </button>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-sm">Total Tasks</span>
              <span className="font-semibold text-neutral-100 text-sm">
                {loading ? '...' : stats.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 text-sm">Completed</span>
              <span className="font-semibold text-green-400 text-sm">
                {loading ? '...' : stats.completed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rose-600 text-sm">Pending</span>
              <span className="font-semibold text-rose-400 text-sm">
                {loading ? '...' : stats.pending}
              </span>
            </div>
            {error && !isTrivialStatsError(error) && (
              <div className="text-rose-400 text-xs mt-2">{error}</div>
            )}
          </div>
        </div>

        {/* actual data in the form of charts with the help of recharts.js */}
        <div className="dashboard-card flex-grow w-5/7 p-4 h-full flex flex-col">
          <h3 className="text-lg font-semibold text-neutral-200 mb-4">Task Distribution</h3>
          <div className="flex-grow">
            <TaskDistributionChart 
              taskData={chartData} 
              error={chartError}
              loading={chartLoading}
            />
          </div>
        </div>
      </div>
      {/* Recent tasks section */}
      {/* ✨ PASS THE REAL TASKS DOWN */}
      <RecentTasksPreview tasks={tasks || []}/>
    </div>
  );
}