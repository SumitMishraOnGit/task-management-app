import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const TaskDistributionChart = () => {
  const taskData = [
    { name: 'Mon', total: 5, completed: 3, pending: 2 },
    { name: 'Tue', total: 7, completed: 5, pending: 2 },
    { name: 'Wed', total: 6, completed: 4, pending: 2 },
    { name: 'Thu', total: 6, completed: 4, pending: 2 },
    { name: 'Fri', total: 8, completed: 6, pending: 2 },
    { name: 'Sat', total: 3, completed: 1, pending: 2 },
    { name: 'Sun', total: 2, completed: 2, pending: 0 },
  ];

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