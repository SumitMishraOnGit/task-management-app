import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-neutral-800 rounded ${className}`}></div>
);

export const ProfileSkeleton = () => (
  <div className="grid gap-6">
    {/* Avatar and Name Section */}
    <div className="flex items-center gap-4">
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>

    {/* Stats Section */}
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>

    {/* Activity Section */}
    <div className="space-y-4">
      <Skeleton className="h-4 w-40" />
      <div className="grid grid-cols-7 gap-1">
        {Array(35).fill(null).map((_, i) => (
          <Skeleton key={i} className="w-full h-8" />
        ))}
      </div>
    </div>
  </div>
);

export const HeatmapSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-40" />
    <div className="grid grid-cols-7 gap-1">
      {Array(35).fill(null).map((_, i) => (
        <Skeleton key={i} className="w-full h-8" />
      ))}
    </div>
  </div>
);

export default Skeleton;
