'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendBadgeProps {
  trend: 'rising' | 'falling' | 'stable';
  rank?: number;
  showRank?: boolean;
}

export default function TrendBadge({ trend, rank, showRank = true }: TrendBadgeProps) {
  const trendIcon =
    trend === 'rising' ? <TrendingUp size={14} className="text-green-500" /> :
    trend === 'falling' ? <TrendingDown size={14} className="text-red-500" /> :
    <Minus size={14} className="text-gray-400" />;

  return (
    <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-md">
      {showRank && rank && (
        <span className="font-semibold text-gray-700">#{rank}</span>
      )}
      {trendIcon}
    </div>
  );
}
