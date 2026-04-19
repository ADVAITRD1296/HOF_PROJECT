import React from 'react';

interface StrengthMeterProps {
  strength: number; // 0-100
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ strength }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (strength / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        {/* Track */}
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#1A1A1A"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#FAFAFA"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{strength}%</span>
        </div>
      </div>
      <div className="text-center mt-3">
        <div className="text-sm border border-border px-3 py-1 rounded-full text-white font-medium bg-[#1A1A1A]">
          Case Strength
        </div>
        <div className="flex gap-2 text-[11px] text-muted-foreground mt-2 uppercase tracking-wider">
          <span>Coverage</span>•<span>Evidence</span>•<span>Clarity</span>
        </div>
      </div>
    </div>
  );
};
