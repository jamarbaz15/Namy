'use client';

import React from 'react';

interface GenderBadgeProps {
  gender: 'male' | 'female' | 'unisex';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function GenderBadge({ gender, size = 'md', showLabel = true }: GenderBadgeProps) {
  const colorClass =
    gender === 'male' ? 'bg-boy' :
    gender === 'female' ? 'bg-girl' :
    'bg-unisex';

  const textColorClass =
    gender === 'male' ? 'text-boy' :
    gender === 'female' ? 'text-girl' :
    'text-unisex';

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const textSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm'
  };

  const label = gender === 'male' ? 'Boy' : gender === 'female' ? 'Girl' : 'Unisex';

  return (
    <div className="flex items-center gap-1.5">
      <span className={`${sizeClasses[size]} rounded-full ${colorClass}`}></span>
      {showLabel && (
        <span className={`${textSizeClasses[size]} font-bold uppercase tracking-wider ${textColorClass}`}>
          {label}
        </span>
      )}
    </div>
  );
}
