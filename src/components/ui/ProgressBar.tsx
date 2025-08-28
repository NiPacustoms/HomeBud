import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  height?: number; // px
  trackClassName?: string;
  barClassName?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 8,
  trackClassName = 'fill-gray-200',
  barClassName = 'fill-green-500',
  label,
}) => {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-2">
      <div className="w-full">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="rounded-full overflow-hidden"
        >
          <rect x="0" y="0" width="100" height={height} className={trackClassName} />
          <rect x="0" y="0" width={`${pct}`} height={height} className={barClassName} />
        </svg>
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
};
