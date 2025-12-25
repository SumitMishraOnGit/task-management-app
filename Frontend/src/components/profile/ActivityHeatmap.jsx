// Frontend/src/components/profile/ActivityHeatmap.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { HeatmapSkeleton } from '../ui/Skeleton';
import { useTaskContext } from '../../Context/TaskContext';

const ActivityHeatmap = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { tasks } = useTaskContext();

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const res = await fetchWithAuth('/users/profile/activity-heatmap');
        const responseText = await res.text();
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
  }, [tasks]);

  // Generate weeks for the last 52 weeks (like GitHub)
  const { weeks, months } = useMemo(() => {
    const weeks = [];
    const months = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday

    // Start from the beginning of the current week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek - (52 * 7) + 1);

    let currentMonth = -1;

    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (week * 7) + day);

        // Track month changes for labels
        if (date.getMonth() !== currentMonth && date.getDate() <= 7) {
          currentMonth = date.getMonth();
          months.push({ week, name: date.toLocaleString('default', { month: 'short' }) });
        }

        if (date <= today) {
          weekDays.push(date);
        }
      }
      if (weekDays.length > 0) {
        weeks.push(weekDays);
      }
    }

    return { weeks, months };
  }, []);

  // Rose color scheme
  const getColorClass = (count) => {
    if (!count || count === 0) return 'bg-neutral-800 hover:bg-neutral-700';
    if (count === 1) return 'bg-rose-900 hover:bg-rose-800';
    if (count <= 3) return 'bg-rose-700 hover:bg-rose-600';
    if (count <= 6) return 'bg-rose-500 hover:bg-rose-400';
    return 'bg-rose-400 hover:bg-rose-300';
  };

  if (loading) {
    return <HeatmapSkeleton />;
  }

  const dayLabels = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];
  const today = new Date();

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
      <div className="w-full overflow-visible">
        {/* Month labels */}
        <div className="flex text-xs text-neutral-500 mb-2 ml-8 relative h-4">
          {months.map((month, idx) => (
            <span
              key={idx}
              className="absolute whitespace-nowrap"
              style={{ left: `${(month.week / 53) * 100}%` }}
            >
              {month.name}
            </span>
          ))}
        </div>

        <div className="flex w-full">
          {/* Day labels */}
          <div className="flex flex-col text-xs text-neutral-500 mr-2 justify-around" style={{ height: '98px' }}>
            {dayLabels.map((label, idx) => (
              <span key={idx} className="h-3 leading-3">{label}</span>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex flex-grow gap-[2px]">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[2px] flex-1">
                {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                  const day = week.find(d => d.getDay() === dayIdx);
                  if (!day) {
                    return <div key={dayIdx} className="w-full aspect-square"></div>;
                  }

                  const dateString = day.toISOString().split('T')[0];
                  const count = data[dateString] || 0;
                  const isToday = day.toDateString() === today.toDateString();

                  return (
                    <div key={dayIdx} className="relative group w-full aspect-square">
                      <div
                        className={`w-full h-full rounded-sm ${getColorClass(count)} transition-colors cursor-pointer ${isToday ? 'ring-2 ring-rose-500 ring-offset-1 ring-offset-neutral-900' : ''}`}
                      ></div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] shadow-xl">
                        <div className="font-semibold text-center">{count} {count === 1 ? 'task' : 'tasks'}</div>
                        <div className="text-neutral-400 text-center">{day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        {isToday && <div className="text-rose-500 text-[10px] mt-1 font-medium text-center">Today</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-neutral-500">
          <span>Less</span>
          <div className="flex gap-[3px]">
            <div className="w-[11px] h-[11px] rounded-sm bg-neutral-800"></div>
            <div className="w-[11px] h-[11px] rounded-sm bg-rose-900"></div>
            <div className="w-[11px] h-[11px] rounded-sm bg-rose-700"></div>
            <div className="w-[11px] h-[11px] rounded-sm bg-rose-500"></div>
            <div className="w-[11px] h-[11px] rounded-sm bg-rose-400"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;