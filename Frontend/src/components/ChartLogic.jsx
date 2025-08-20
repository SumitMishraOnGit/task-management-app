import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTaskContext } from '../Context/TaskContext';
import { isTrivialChartError, Toast, CustomTooltip } from '../utils/chartUtils';

const TaskDistributionChart = ({ taskData = [], error }) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(true);
  const { tasks } = useTaskContext();
  
  useEffect(() => {
    if (error) setShowToast(true);
  }, [error]);

  if (error && !isTrivialChartError(error) && showToast) {
    return <Toast message={error} onClose={() => setShowToast(false)} />;
  }
  
  const displayData = taskData || [];

  // FIX: Added a check for 'tasks' from context
  const hasTasks = tasks && tasks.length > 0;

  if (!hasTasks) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="text-neutral-400 text-center py-4">You currently have no tasks.</div>
        <button
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          onClick={() => navigate('/home/tasks')}
        >
          Add your first task
        </button>
      </div>
    );
  }

  if (displayData.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="text-neutral-400 text-center py-4">Not enough data to show a chart. Add more tasks!</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={displayData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="completed"
          stackId="1"
          stroke="#E0245E"
          fill="#E0245E"
        />
        <Area
          type="monotone"
          dataKey="pending"
          stackId="1"
          stroke="#FDB0C0"
          fill="#FDB0C0"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TaskDistributionChart;