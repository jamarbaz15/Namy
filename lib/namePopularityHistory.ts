import 'server-only';

import type { PopularityHistoryPoint } from '@/types';
import popularityHistoryJson from '@/data/generated/name-popularity-history.json';

interface PopularityHistoryIndex {
  firstYear: number;
  latestYear: number;
  chartYears: number[];
  byId: Record<string, Array<number | null>>;
}

const popularityHistory = popularityHistoryJson as PopularityHistoryIndex;

export function getNamePopularityHistory(id: string): PopularityHistoryPoint[] {
  const ranks = popularityHistory.byId[id] ?? [];

  return popularityHistory.chartYears.map((year, index) => ({
    year,
    rank: typeof ranks[index] === 'number' ? ranks[index] : null,
  }));
}

export function getPopularityHistoryYears(): number[] {
  return popularityHistory.chartYears;
}

export function getPopularityHistoryRange(): { firstYear: number; latestYear: number } {
  return {
    firstYear: popularityHistory.firstYear,
    latestYear: popularityHistory.latestYear,
  };
}
