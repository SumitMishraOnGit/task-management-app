import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function isTrivialChartError(error) {
  if (!error) return false;
  const lower = error.toLowerCase();
  return (
    lower.includes('access token expired') ||
    lower.includes('jwt expired') ||
    lower.includes('invalid token')
  );
}

// ✨ NEW: CustomTooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900/80 p-3 rounded-lg shadow-lg  text-white border border-neutral-700">
        <p className="font-bold text-lg mb-1">{`${label}`}</p>
        {/* Iterate over payload to display each item (completed, pending) */}
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm">
            <span style={{ color: entry.color }}>{`${entry.name}`}</span>: {`${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-4 right-4 bg-rose-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
      {message}
    </div>
  );
};

const TaskDistributionChart = ({ taskData = [], error }) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    if (error) setShowToast(true);
  }, [error]);

  if (error && !isTrivialChartError(error) && showToast) {
    return <Toast message={error} onClose={() => setShowToast(false)} />;
  }

  if (!taskData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="text-neutral-400 text-center py-4">You currently have no tasks. Hence, no data to show.</div>
        <button
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          onClick={() => navigate('/home/tasks')}
        >
          Add your first task
        </button>
      </div>
    );
  }
  if (taskData.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="text-neutral-400 text-center py-4">Not enough data to show a chart. Add more tasks!</div>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={taskData}
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
        {/* ✨ CHANGE HERE: Use the custom content prop for Tooltip */}
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