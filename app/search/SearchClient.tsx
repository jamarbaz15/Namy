'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, Filter, X, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { NAMES_DB } from '@/data';
import { filterNames, getUniqueOrigins } from '@/lib/utils';
import { useApp } from '@/components/Providers';
import NameCard from '@/components/NameCard';
import type { FilterState } from '@/types';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PAGE_SIZE = 100;
const SYLLABLE_FILTER_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
] as const;

const parseGenderFromSearchParams = (value: string | null): FilterState['gender'] => (
  value === 'male' || value === 'female' || value === 'unisex' || value === 'all'
    ? value
    : 'all'
);

const getFiltersFromSearchParams = (searchParams: ReturnType<typeof useSearchParams>): FilterState => ({
  gender: parseGenderFromSearchParams(searchParams.get('gender')),
  query: searchParams.get('q') || '',
  letter: searchParams.get('letter') || undefined,
  origin: searchParams.get('origin') || undefined,
  syllables: searchParams.get('syllables') ? Number(searchParams.get('syllables')) : undefined,
  lengthMin: searchParams.get('lengthMin') ? Number(searchParams.get('lengthMin')) : undefined,
  lengthMax: searchParams.get('lengthMax') ? Number(searchParams.get('lengthMax')) : undefined,
  popularityMax: searchParams.get('popularityMax') ? Number(searchParams.get('popularityMax')) : undefined,
});

const getPageFromSearchParams = (searchParams: ReturnType<typeof useSearchParams>): number => {
  const page = Number(searchParams.get('page') || '1');
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
};


function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { favorites, toggleFavorite, compareList, toggleCompare } = useApp();

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => getFiltersFromSearchParams(searchParams));
  const [page, setPage] = useState<number>(() => getPageFromSearchParams(searchParams));

  const origins = useMemo(() => getUniqueOrigins(NAMES_DB), []);


  // Sync local filter state when URL query changes externally (links/back-forward navigation)
  useEffect(() => {
    const nextFilters = getFiltersFromSearchParams(searchParams);
    const nextPage = getPageFromSearchParams(searchParams);
    setFilters((prev) => {
      const prevSerialized = JSON.stringify(prev);
      const nextSerialized = JSON.stringify(nextFilters);
      return prevSerialized === nextSerialized ? prev : nextFilters;
    });
    setPage((prev) => (prev === nextPage ? prev : nextPage));
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.gender && filters.gender !== 'all') params.set('gender', filters.gender);
    if (filters.query) params.set('q', filters.query);
    if (filters.letter) params.set('letter', filters.letter);
    if (filters.origin) params.set('origin', filters.origin);
    if (filters.syllables) params.set('syllables', String(filters.syllables));
    if (filters.lengthMin) params.set('lengthMin', String(filters.lengthMin));
    if (filters.lengthMax) params.set('lengthMax', String(filters.lengthMax));
    if (filters.popularityMax) params.set('popularityMax', String(filters.popularityMax));
    if (page > 1) params.set('page', String(page));

    const queryString = params.toString();
    router.replace(`/search${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [filters, page, router]);

  const filteredNames = useMemo(() => filterNames(NAMES_DB, filters), [filters]);
  const totalPages = Math.max(1, Math.ceil(filteredNames.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedNames = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredNames.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredNames]);

  const updateFilter = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      gender: 'all',
      query: '',
      letter: undefined,
      origin: undefined,
      syllables: undefined,
      lengthMin: undefined,
      lengthMax: undefined,
      popularityMax: undefined
    });
    setPage(1);
  };

  const activeFilterCount = Object.keys(filters).filter(k => {
    if (k === 'gender') return filters.gender !== 'all';
    if (k === 'query') return filters.query !== '';
    return filters[k as keyof FilterState] !== undefined;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center mb-4 sticky top-24 z-20 bg-gray-50/90 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-xl font-serif font-bold text-gray-900">Search Results</h1>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors ${showMobileFilters ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}
          >
            <Filter size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Filters Sidebar */}
        <aside className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                <SlidersHorizontal size={20} className="text-primary-500" /> Filters
              </h2>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-primary-500 font-bold hover:text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  RESET
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Keywords</label>
                <div className="relative">
                  <SearchIcon size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => updateFilter('query', e.target.value)}
                    placeholder="Name or meaning..."
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-shadow"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['all', 'male', 'female', 'unisex'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => updateFilter('gender', g)}
                      className={`px-3 py-2.5 rounded-xl text-sm capitalize transition-all border ${filters.gender === g
                        ? 'bg-gray-900 text-white border-gray-900 font-semibold shadow-md'
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Origin */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Origin</label>
                <div className="relative">
                  <select
                    value={filters.origin || ''}
                    onChange={(e) => updateFilter('origin', e.target.value || undefined)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none bg-white cursor-pointer"
                  >
                    <option value="">Any Origin</option>
                    {origins.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Syllables */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Syllables</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter('syllables', undefined)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${!filters.syllables ? 'bg-primary-500 text-white border-primary-500' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    Any
                  </button>
                  {SYLLABLE_FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter('syllables', filters.syllables === option.value ? undefined : option.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${filters.syllables === option.value
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popularity */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Max Popularity Rank</label>
                <div className="relative">
                  <select
                    value={filters.popularityMax || ''}
                    onChange={(e) => updateFilter('popularityMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none bg-white cursor-pointer"
                  >
                    <option value="">Any Rank</option>
                    <option value="10">Top 10</option>
                    <option value="50">Top 50</option>
                    <option value="100">Top 100</option>
                    <option value="500">Top 500</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Name Length</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.lengthMin || ''}
                    onChange={(e) => updateFilter('lengthMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none"
                  />
                  <span className="text-gray-300 font-bold">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.lengthMax || ''}
                    onChange={(e) => updateFilter('lengthMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="flex-grow min-w-0">
          {/* A-Z Filter */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 overflow-x-auto shadow-sm no-scrollbar">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => updateFilter('letter', undefined)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${!filters.letter ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
              >
                All
              </button>
              {LETTERS.map(l => (
                <button
                  key={l}
                  onClick={() => updateFilter('letter', filters.letter === l ? undefined : l)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${filters.letter === l ? 'bg-primary-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 flex justify-between items-end px-2">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">
              {filteredNames.length} {filteredNames.length === 1 ? 'Name' : 'Names'} Found
            </h2>
            {filters.letter && (
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full flex items-center gap-2 border border-primary-100">
                Starts with &quot;{filters.letter}&quot;
                <button onClick={() => updateFilter('letter', undefined)} className="hover:bg-primary-100 rounded-full p-0.5"><X size={12} /></button>
              </span>
            )}
          </div>

          {filteredNames.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedNames.map(name => (
                <NameCard
                  key={name.id}
                  nameData={name}
                  isFavorite={favorites.has(name.id)}
                  onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(name.id); }}
                  isCompare={compareList.includes(name.id)}
                  onToggleCompare={(e) => { e.stopPropagation(); toggleCompare(name.id); }}
                />
              ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredNames.length)} of {filteredNames.length}
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <span className="text-sm text-gray-600 px-2">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <SearchIcon size={40} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">No matching names</h3>
              <p className="text-gray-500 mb-8 max-w-md">
                We couldn&apos;t find any names matching your specific criteria. Try adjusting your filters to see more results.
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchClient() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

