import type { Name, NamePopularity } from '@/types';

export const USA_POPULARITY_UNRANKED = 999999;

export function getLatestUsaPopularityYear(popularity: NamePopularity): number | null {
  return typeof popularity.latestYear === 'number' ? popularity.latestYear : null;
}

export function getCurrentUsaRank(popularity: NamePopularity): number | null {
  if (typeof popularity.usa !== 'number' || popularity.usa >= USA_POPULARITY_UNRANKED) {
    return null;
  }

  return popularity.usa;
}

export function formatUsaRank(popularity: NamePopularity): string {
  const rank = getCurrentUsaRank(popularity);
  return rank === null ? 'Unranked' : `#${rank}`;
}

export function getUsaRankBadge(popularity: NamePopularity): { label: string; isUnranked: boolean } {
  const rank = getCurrentUsaRank(popularity);
  const latestYear = getLatestUsaPopularityYear(popularity);

  if (rank === null) {
    return {
      label: latestYear ? `Not ranked in ${latestYear}` : 'Not ranked',
      isUnranked: true,
    };
  }

  if (rank <= 10) {
    return { label: 'Top 10', isUnranked: false };
  }
  if (rank <= 50) {
    return { label: 'Top 50', isUnranked: false };
  }
  if (rank <= 100) {
    return { label: 'Top 100', isUnranked: false };
  }
  if (rank <= 500) {
    return { label: 'Top 500', isUnranked: false };
  }
  if (rank <= 1000) {
    return { label: 'Top 1000', isUnranked: false };
  }

  return {
    label: latestYear ? `Ranked in ${latestYear}` : 'Ranked nationally',
    isUnranked: false,
  };
}

export function getUsaPopularityDescription(name: Name): string {
  const rank = getCurrentUsaRank(name.popularity);
  const latestYear = getLatestUsaPopularityYear(name.popularity);

  if (rank !== null && latestYear !== null) {
    return `ranked #${rank} in U.S. SSA data for ${latestYear}`;
  }

  if (latestYear !== null) {
    return `not ranked in U.S. SSA data for ${latestYear}`;
  }

  return 'with U.S. popularity data available';
}
