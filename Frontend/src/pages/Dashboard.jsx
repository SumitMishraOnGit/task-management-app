// Frontend/src/pages/Dashboard.jsx

import TaskDistributionChart from '../components/ChartLogic';
import RecentTasksPreview from '../components/Tasks/RecentTasksPreview';
import { useTaskContext } from '../Context/TaskContext';
import { useTaskStats, useTaskAnalytics } from '../hooks/useTaskStats';
import { useState, useEffect } from 'react';

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
  const { tasks, loading: tasksLoading, error: tasksError } = useTaskContext();
  const [range, setRange] = useState('weekly');
  const { stats, loading: statsLoading, error: statsError } = useTaskStats(range);
  const { data: chartData, loading: chartLoading, error: chartError } = useTaskAnalytics(range);

  const isLoading = tasksLoading || statsLoading || chartLoading;
  const error = tasksError || statsError || chartError;

  useEffect(() => {
    if (tasks.length > 0) {
      console.log('Tasks updated, refreshing stats...');
    }
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-neutral-800 rounded"></div>
          <div className="h-32 bg-neutral-800 rounded"></div>
          <div className="h-64 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !isTrivialStatsError(error)) {
    return <div className="p-4 text-red-500 text-center">Error loading dashboard: {error}</div>;
  }

  return (
    <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-4 overflow-hidden">
      <div className="flex w-full gap-4 h-2/3">
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
              <span className="text-neutral-400">Total Tasks</span>
              <span className="text-white font-semibold">{stats.total || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Completed</span>
              <span className="text-green-400 font-semibold">{stats.completed || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Pending</span>
              <span className="text-rose-400 font-semibold">{stats.pending || 0}</span>
            </div>
          </div>
        </div>

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
      <RecentTasksPreview tasks={tasks} loading={isLoading} error={error} />
    </div>
  );
}