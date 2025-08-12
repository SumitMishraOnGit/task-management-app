// Frontend/src/components/profile/ActivityHeatmap.jsx

import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { HeatmapSkeleton } from '../ui/Skeleton';
import { useTaskContext } from '../../Context/TaskContext'; // <-- This line was missing

const ActivityHeatmap = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { tasks } = useTaskContext(); // Get tasks from context to trigger refresh

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const res = await fetchWithAuth('/users/profile/activity-heatmap');
        const responseText = await res.text();
        
        // The backend seems to be returning an object, not an array.
        // Let's adapt to that structure.
        const activityData = responseText ? JSON.parse(responseText) : {};

        if (!res.ok) throw new Error('Failed to fetch activity data');

        setData(activityData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmapData();
  }, [tasks]); // Refresh when tasks change

  const getDaysInLastYear = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    return days.reverse();
  };

  const getColorClass = (count) => {
    if (!count || count === 0) return 'bg-neutral-800';
    if (count <= 2) return 'bg-rose-900';
    if (count <= 5) return 'bg-rose-700';
    return 'bg-rose-500';
  };

  if (loading) {
    return <HeatmapSkeleton />;
  }

  const days = getDaysInLastYear();

  return (
    <div className="dashboard-card pb-8 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
      <div className="grid grid-rows-7 grid-flow-col gap-1 overflow-x-auto p-2">
        {days.map((day, index) => {
          const dateString = day.toISOString().split('T')[0];
          const count = data[dateString] || 0;
          return (
            <div key={index} className="relative group">
              <div className={`w-3 h-3 rounded-sm ${getColorClass(count)}`}></div>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-neutral-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {count} {count === 1 ? 'task' : 'tasks'} on {day.toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityHeatmap;