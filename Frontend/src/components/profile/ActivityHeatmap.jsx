// Frontend/src/components/profile/ActivityHeatmap.jsx

import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { createPortal } from 'react-dom';

// A simple Tooltip component to be rendered in a portal
const Tooltip = ({ content, position }) => {
  if (!content) return null;
  return createPortal(
    <div
      style={{
        top: position.y + 10, // Add a small offset
        left: position.x + 10,
        zIndex: 10000, // A high z-index to ensure it's on top
      }}
      className="fixed px-2 py-1 bg-neutral-900 text-white text-xs rounded-md shadow-lg pointer-events-none"
    >
      {content}
    </div>,
    document.body
  );
};

const ActivityHeatmap = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', position: { x: 0, y: 0 } });

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const res = await fetchWithAuth('/api/users/profile/activity-heatmap');
        const responseText = await res.text();
        const activityData = responseText ? JSON.parse(responseText) : [];

        if (!res.ok) throw new Error('Failed to fetch activity data');

        const dataMap = activityData.reduce((acc, item) => {
          acc[item.date] = item.count;
          return acc;
        }, {});
        setData(dataMap);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmapData();
  }, []);

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

  const days = getDaysInLastYear();

  const handleMouseEnter = (event, date, count) => {
    setTooltip({
      visible: true,
      content: `${count} ${count === 1 ? 'task' : 'tasks'} on ${date.toLocaleDateString()}`,
      position: { x: event.clientX, y: event.clientY }
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <div className={`dashboard-card pb-8 p-4 relative`}>
      <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
      {loading ? (
        <div className="shimmer-wrapper">
          <div className="grid grid-rows-7 grid-flow-col gap-1 overflow-hidden max-w-full">
            {Array.from({ length: 365 }).map((_, index) => (
              <div key={index} className="w-3 h-3 rounded-sm bg-neutral-800"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-rows-7 grid-flow-col gap-1 overflow-hidden max-w-full">
            {days.map((day, index) => {
              const dateString = day.toISOString().split('T')[0];
              const count = data[dateString] || 0;
              return (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={(e) => handleMouseEnter(e, day, count)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={`w-3 h-3 rounded-sm ${getColorClass(count)}`}></div>
                </div>
              );
            })}
          </div>
          {tooltip.visible && <Tooltip content={tooltip.content} position={tooltip.position} />}
        </>
      )}
    </div>
  );
};

export default ActivityHeatmap;