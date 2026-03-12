'use client';

import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartPoint {
  year: number;
  rank: number | null;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string | null }>;
  label?: string | number;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const rawRank = payload[0]?.value;
  const rank = typeof rawRank === 'number' ? rawRank : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-xl shadow-gray-900/10">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">SSA Rank</div>
      <div className="mt-1 text-lg font-bold text-gray-900">{rank !== null ? `#${rank}` : 'Unranked'}</div>
      <div className="text-sm text-gray-500">Year {label}</div>
    </div>
  );
}

interface PopularityChartProps {
  chartData: ChartPoint[];
  chartTicks: number[];
  yDomain: [number, number];
  selectedYear: number | null;
  selectedRank: number | null;
}

export default function PopularityChart({
  chartData,
  chartTicks,
  yDomain,
  selectedYear,
  selectedRank,
}: PopularityChartProps) {
  const rankValues = chartData.filter((point): point is { year: number; rank: number } => typeof point.rank === 'number').map((point) => point.rank);
  const yPadding = rankValues.length > 0 ? Math.max(25, Math.round(Math.max(...rankValues) * 0.05)) : 25;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 18, right: 8, left: 0, bottom: 12 }}>
        <defs>
          <linearGradient id="rankBackdrop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE4E6" stopOpacity={0.65} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 6" vertical={false} />
        <XAxis
          dataKey="year"
          type="number"
          domain={['dataMin', 'dataMax']}
          ticks={chartTicks}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          tickFormatter={(value) => String(value)}
        />
        <YAxis
          reversed
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          domain={yDomain}
          width={rankValues.length > 0 && Math.max(...rankValues) >= 1000 ? 60 : 44}
          tickFormatter={(value) => `#${value}`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
        {selectedYear !== null && (
          <ReferenceLine x={selectedYear} stroke="#FDA4AF" strokeDasharray="4 6" />
        )}
        {selectedYear !== null && selectedRank !== null && (
          <ReferenceDot
            x={selectedYear}
            y={selectedRank}
            r={5}
            fill="#E11D48"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        )}
        <Line
          type="monotone"
          dataKey="rank"
          connectNulls={false}
          stroke="#E11D48"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2, fill: '#E11D48' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
