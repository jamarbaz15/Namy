'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarRange,
  Heart,
  Info,
  Minus,
  Scale,
  Share2,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Users,
  Volume2,
} from 'lucide-react';
import type { Name, PopularityHistoryPoint } from '@/types';

// Lazy load the chart component to reduce bundle size
const PopularityChart = dynamic(
  () => import('./PopularityChart'),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 h-[360px] w-full rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Loading chart...</p>
        </div>
      </div>
    ),
  }
);
import { useApp } from '@/components/Providers';
import NameCard from '@/components/NameCard';
import { getCurrentUsaRank, getLatestUsaPopularityYear, getUsaRankBadge } from '@/lib/namePopularity';

interface NameDetailsClientProps {
  nameData: Name;
  popularityHistory: PopularityHistoryPoint[];
  featuredInLists: Array<{
    slug: string;
    title: string;
    context: string;
  }>;
  similarNames: Name[];
}

interface ChartPoint {
  year: number;
  rank: number | null;
}

function buildChartTicks(years: number[]): number[] {
  if (years.length <= 5) {
    return years;
  }

  const checkpoints = [0, 0.25, 0.5, 0.75, 1];
  return Array.from(
    new Set(
      checkpoints.map((ratio) => {
        const index = Math.min(years.length - 1, Math.round((years.length - 1) * ratio));
        return years[index];
      })
    )
  );
}

function getYearOverYearSummary(currentYear: number, currentRank: number | null, previousYear: number | null, previousRank: number | null) {
  if (previousYear === null) {
    return {
      value: 'Start',
      detail: `SSA series begins in ${currentYear}`,
      tone: 'neutral' as const,
      Icon: Minus,
    };
  }

  if (currentRank !== null && previousRank !== null) {
    const delta = previousRank - currentRank;

    if (delta > 0) {
      return {
        value: `+${delta}`,
        detail: `better than ${previousYear}`,
        tone: 'positive' as const,
        Icon: ArrowUpRight,
      };
    }

    if (delta < 0) {
      return {
        value: `-${Math.abs(delta)}`,
        detail: `lower than ${previousYear}`,
        tone: 'negative' as const,
        Icon: ArrowDownRight,
      };
    }

    return {
      value: '0',
      detail: `same as ${previousYear}`,
      tone: 'neutral' as const,
      Icon: Minus,
    };
  }

  if (currentRank !== null) {
    return {
      value: 'New',
      detail: `entered the rankings in ${currentYear}`,
      tone: 'positive' as const,
      Icon: ArrowUpRight,
    };
  }

  if (previousRank !== null) {
    return {
      value: 'Out',
      detail: `not ranked after ${previousYear}`,
      tone: 'negative' as const,
      Icon: ArrowDownRight,
    };
  }

  return {
    value: '--',
    detail: `no national rank in ${currentYear}`,
    tone: 'neutral' as const,
    Icon: Minus,
  };
}

export default function NameDetailsClient({ nameData, popularityHistory, featuredInLists, similarNames }: NameDetailsClientProps) {
  const router = useRouter();
  const { favorites, toggleFavorite, compareList, toggleCompare } = useApp();

  const availableYears = React.useMemo(
    () => popularityHistory.map((point) => point.year).sort((a, b) => b - a),
    [popularityHistory]
  );

  const latestChartYear = availableYears[0] ?? getLatestUsaPopularityYear(nameData.popularity) ?? null;
  const [selectedYear, setSelectedYear] = React.useState<number | null>(latestChartYear);

  React.useEffect(() => {
    setSelectedYear(latestChartYear);
  }, [latestChartYear]);

  const chartData = React.useMemo<ChartPoint[]>(
    () => popularityHistory.map((point) => ({ year: point.year, rank: point.rank })),
    [popularityHistory]
  );

  const selectedIndex = React.useMemo(
    () => chartData.findIndex((point) => point.year === selectedYear),
    [chartData, selectedYear]
  );
  const selectedPoint = selectedIndex >= 0 ? chartData[selectedIndex] : null;
  const previousPoint = selectedIndex > 0 ? chartData[selectedIndex - 1] : null;

  const rankedChartPoints = React.useMemo(
    () => chartData.filter((point): point is { year: number; rank: number } => typeof point.rank === 'number'),
    [chartData]
  );
  const chartTicks = React.useMemo(() => buildChartTicks(chartData.map((point) => point.year)), [chartData]);

  const currentRank = getCurrentUsaRank(nameData.popularity);
  const latestPopularityYear = getLatestUsaPopularityYear(nameData.popularity);
  const rankBadge = getUsaRankBadge(nameData.popularity);
  const rankValues = rankedChartPoints.map((point) => point.rank);
  const yPadding = rankValues.length > 0 ? Math.max(25, Math.round(Math.max(...rankValues) * 0.05)) : 25;
  const yDomain: [number, number] =
    rankValues.length > 0
      ? [Math.max(1, Math.min(...rankValues) - yPadding), Math.max(...rankValues) + yPadding]
      : [1, 1000];

  const selectedRank = selectedPoint && typeof selectedPoint.rank === 'number' ? selectedPoint.rank : null;
  const selectedYearValue = selectedPoint?.year ?? latestChartYear ?? latestPopularityYear ?? new Date().getFullYear();
  const previousYear = previousPoint?.year ?? null;
  const yearOverYearSummary = getYearOverYearSummary(
    selectedYearValue,
    selectedRank,
    previousYear,
    previousPoint?.rank ?? null
  );

  const isFavorite = favorites.has(nameData.id);
  const isCompare = compareList.includes(nameData.id);

  const genderBg =
    nameData.gender === 'male'
      ? 'bg-blue-50 text-blue-600 border-blue-100'
      : nameData.gender === 'female'
        ? 'bg-pink-50 text-pink-600 border-pink-100'
        : 'bg-purple-50 text-purple-600 border-purple-100';

  const siblingSuggestions = {
    brothers: Array.isArray(nameData.siblingSuggestions?.brothers) ? nameData.siblingSuggestions.brothers : [],
    sisters: Array.isArray(nameData.siblingSuggestions?.sisters) ? nameData.siblingSuggestions.sisters : [],
  };

  const hasSiblingSuggestions = siblingSuggestions.brothers.length > 0 || siblingSuggestions.sisters.length > 0;

  const famousNamesakes = nameData.famousNamesakes
    .map((person) => {
      if (typeof person === 'string') {
        return { name: person, description: '' };
      }

      if (person && typeof person.name === 'string') {
        return {
          name: person.name,
          description: typeof person.description === 'string' ? person.description : '',
        };
      }

      return null;
    })
    .filter((person): person is { name: string; description: string } => Boolean(person));

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-4 py-8">
      <button
        onClick={() => router.back()}
        className="group mb-8 flex items-center font-medium text-gray-500 transition-colors hover:text-primary-600"
      >
        <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" /> Back to Search
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-card md:p-10">
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-50 opacity-60 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row">
              <div>
                <h1 className="mb-4 font-serif text-6xl font-bold tracking-tight text-gray-900 md:text-7xl">{nameData.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className={`rounded-full border px-4 py-1.5 text-sm font-bold uppercase tracking-wide ${genderBg}`}>
                    {nameData.gender}
                  </span>
                  <button 
                    className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100"
                    aria-label={`Pronunciation: ${nameData.pronunciation}`}
                  >
                    <Volume2 size={16} aria-hidden="true" /> {nameData.pronunciation}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleCompare(nameData.id)}
                  className={`rounded-full border p-3.5 transition-colors ${isCompare ? 'border-secondary-200 bg-secondary-100 text-secondary-600' : 'border-gray-200 bg-white text-gray-400 hover:bg-secondary-50 hover:text-secondary-600'}`}
                  title={isCompare ? 'Remove from comparison' : 'Add to compare'}
                  aria-label={isCompare ? 'Remove from comparison' : 'Add to compare'}
                >
                  <Scale size={22} />
                </button>
                <button 
                  className="rounded-full border border-gray-200 p-3.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Share this name"
                >
                  <Share2 size={22} />
                </button>
                <button
                  onClick={() => toggleFavorite(nameData.id)}
                  className={`rounded-full p-3.5 shadow-lg transition-transform hover:scale-105 active:scale-95 ${isFavorite ? 'bg-primary-500 text-white shadow-primary-500/30' : 'border border-gray-200 bg-white text-gray-300 hover:text-primary-500'}`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={22} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-8">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">Meaning</h3>
              <p className="mb-4 font-serif text-3xl italic leading-relaxed text-gray-800">&quot;{nameData.meaning}&quot;</p>
              <p className="text-lg leading-relaxed text-gray-600">{nameData.description}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {nameData.categories.map((category) => (
                <Link
                  key={category}
                  href={`/search?q=${encodeURIComponent(category)}`}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-primary-200 hover:text-primary-600"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {nameData.history && (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
                <BookOpen className="text-purple-500" /> Origin & History
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">{nameData.history}</p>
            </div>
          )}

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <TrendingUp className="text-primary-500" /> U.S. Popularity History
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {chartData.length > 0
                    ? `Full SSA rank history from ${chartData[0].year} to ${chartData[chartData.length - 1].year}`
                    : 'Full SSA rank history'}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="block font-serif text-4xl font-bold text-gray-900">
                  {currentRank !== null ? `#${currentRank}` : 'Unranked'}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-sm font-medium ${rankBadge.isUnranked ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-600'}`}
                >
                  {rankBadge.label}
                </span>
              </div>
            </div>

            {rankedChartPoints.length > 0 ? (
              <div className="mt-6 h-[360px] w-full">
                <PopularityChart
                  chartData={chartData}
                  chartTicks={chartTicks}
                  yDomain={yDomain}
                  selectedYear={selectedYear}
                  selectedRank={selectedRank}
                />
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
                SSA did not record this spelling in the national rankings for the available chart years. Names used fewer than 5 times in a year are omitted from the dataset.
              </div>
            )}

            <div className="mt-6 rounded-3xl border border-gray-100 bg-gray-50/80 p-5">
              <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <CalendarRange size={18} className="text-primary-500" /> Yearly Ranking Snapshot
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Pick any SSA release year to inspect that year&apos;s national ranking and how it changed from the year before.
                  </p>
                </div>
                <label className="block md:min-w-[200px]">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Year</span>
                  <select
                    value={selectedYear ?? ''}
                    onChange={(event) => setSelectedYear(Number(event.target.value))}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base font-semibold text-gray-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Selected Year Rank</div>
                  <div className="mt-4 text-4xl font-bold text-gray-900">
                    {selectedRank !== null ? `#${selectedRank}` : 'Unranked'}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {selectedRank !== null
                      ? `${nameData.name} was nationally ranked in ${selectedYearValue}.`
                      : `${nameData.name} did not appear in the national SSA rankings for ${selectedYearValue}.`}
                  </p>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Change Vs Previous Year</div>
                  <div className="mt-4 flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${yearOverYearSummary.tone === 'positive' ? 'bg-emerald-50 text-emerald-600' : yearOverYearSummary.tone === 'negative' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}
                    >
                      <yearOverYearSummary.Icon size={20} />
                    </div>
                    <div className="text-4xl font-bold text-gray-900">{yearOverYearSummary.value}</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{yearOverYearSummary.detail}</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Source: U.S. Social Security Administration{latestPopularityYear ? `, latest release ${latestPopularityYear}` : ''}. Names used fewer than 5 times in a given year are not ranked.
              </p>
            </div>
          </div>

          {nameData.nicknames.length > 0 && (
            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
              <div className="absolute left-0 top-0 h-32 w-32 -translate-x-1/3 -translate-y-1/3 rounded-full bg-secondary-100/70 blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Tag className="text-secondary-500" /> Nicknames
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Familiar short forms, playful variations, and easy everyday options for {nameData.name}.
                    </p>
                  </div>
                  <div className="inline-flex rounded-full bg-secondary-50 px-3 py-1 text-sm font-semibold text-secondary-700 border border-secondary-100">
                    {nameData.nicknames.length} ideas
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {nameData.nicknames.map((nickname) => (
                    <div
                      key={nickname}
                      className="rounded-2xl border border-secondary-100 bg-gradient-to-br from-secondary-50 via-white to-secondary-50/70 px-4 py-3 shadow-sm transition-colors hover:border-secondary-200"
                    >
                      <div className="text-base font-bold text-gray-900">{nickname}</div>
                      <div className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-secondary-600">Nickname</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {similarNames.length > 0 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
                <Sparkles className="fill-yellow-400 text-yellow-400" /> Similar Names
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {similarNames.map((similar) => (
                  <NameCard
                    key={similar.id}
                    nameData={similar}
                    isFavorite={favorites.has(similar.id)}
                    onToggleFavorite={(event) => {
                      event.stopPropagation();
                      toggleFavorite(similar.id);
                    }}
                    isCompare={compareList.includes(similar.id)}
                    onToggleCompare={(event) => {
                      event.stopPropagation();
                      toggleCompare(similar.id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {featuredInLists.length > 0 && (
            <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
              <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-primary-50 opacity-80 blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                      <BookOpen className="text-primary-500" /> Baby Name Lists That Include {nameData.name}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                      Browse every Namylab list page that currently includes {nameData.name}, from meaning and origin collections to letter, syllable, and themed baby name lists.
                    </p>
                  </div>
                  <div className="inline-flex rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
                    {featuredInLists.length} linked lists
                  </div>
                </div>

                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {featuredInLists.map((listLink) => (
                    <li key={listLink.slug}>
                      <Link
                        href={`/list/${listLink.slug}`}
                        prefetch={false}
                        className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-slate-50/70 to-primary-50/40 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary-700">
                            {listLink.title}
                          </span>
                          <ArrowUpRight
                            size={18}
                            className="mt-0.5 shrink-0 text-gray-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-500"
                          />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">{listLink.context}</p>
                        <span className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
                          View baby name list
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {famousNamesakes.length > 0 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
                <Star className="fill-yellow-400 text-yellow-400" /> Famous {nameData.name}s
              </h3>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {famousNamesakes.map((person, index) => (
                  <li key={index} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white font-serif text-xl font-bold text-primary-600 shadow-sm">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{person.name}</div>
                      <div className="text-sm text-gray-500">{person.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Info size={20} className="text-primary-500" /> Quick Facts
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <span className="text-sm text-gray-500">Origin</span>
                <span className="font-bold text-gray-900">{nameData.origins.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <span className="text-sm text-gray-500">Syllables</span>
                <span className="font-bold text-gray-900">{nameData.syllables}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <span className="text-sm text-gray-500">Length</span>
                <span className="font-bold text-gray-900">{nameData.name.length} letters</span>
              </div>
            </div>
          </div>


          {hasSiblingSuggestions && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Users size={20} className="text-primary-500" /> Sibling Ideas
              </h3>
              <div className="space-y-6">
                {siblingSuggestions.brothers.length > 0 && (
                  <div>
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">Brothers</span>
                    <div className="flex flex-wrap gap-2">
                      {siblingSuggestions.brothers.map((sibling) => (
                        <Link
                          key={sibling}
                          href={`/search?q=${encodeURIComponent(sibling)}`}
                          className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary-600"
                        >
                          {sibling}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {siblingSuggestions.sisters.length > 0 && (
                  <div>
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">Sisters</span>
                    <div className="flex flex-wrap gap-2">
                      {siblingSuggestions.sisters.map((sibling) => (
                        <Link
                          key={sibling}
                          href={`/search?q=${encodeURIComponent(sibling)}`}
                          className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary-600"
                        >
                          {sibling}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



