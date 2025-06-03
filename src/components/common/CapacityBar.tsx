import React from 'react';

interface CapacityBarProps {
  usagePercent: number;
}

export default function CapacityBar({ usagePercent }: CapacityBarProps) {
  let color = 'bg-green-500';
  if (usagePercent >= 80) {
    color = 'bg-red-600';
  } else if (usagePercent >= 50) {
    color = 'bg-yellow-400';
  }
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={usagePercent}
      className="w-full bg-gray-200 rounded h-6"
      aria-label={`Capacity usage ${usagePercent}%`}
    >
      <div
        className={`${color} h-6 rounded`}
        style={{ width: `${usagePercent}%`, transition: 'width 0.3s ease' }}
      />
    </div>
  );
}
