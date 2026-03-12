/**
 * Names Database Loader
 *
 * Loads names from letter-based JSON files for better performance
 * and easier maintenance. Each letter has its own JSON file (a.json, b.json, etc.)
 */

import type { Name } from '@/types';
import { DEFAULT_NAME_DATES } from '@/data/content-metadata';
import generatedPopularityCurrentJson from '@/data/generated/name-popularity-current.json';
import { isExcludedWrongGenderNameId } from '@/lib/nameDataSanitization';

// Import all letter JSON files
import namesA from './a.json';
import namesB from './b.json';
import namesC from './c.json';
import namesD from './d.json';
import namesE from './e.json';
import namesF from './f.json';
import namesG from './g.json';
import namesH from './h.json';
import namesI from './i.json';
import namesJ from './j.json';
import namesK from './k.json';
import namesL from './l.json';
import namesM from './m.json';
import namesN from './n.json';
import namesO from './o.json';
import namesP from './p.json';
import namesQ from './q.json';
import namesR from './r.json';
import namesS from './s.json';
import namesT from './t.json';
import namesU from './u.json';
import namesV from './v.json';
import namesW from './w.json';
import namesX from './x.json';
import namesY from './y.json';
import namesZ from './z.json';

type LetterNamesFile = unknown;

// Cast JSON imports to proper type (TypeScript JSON imports have loose types)
const letterFiles: Record<string, LetterNamesFile> = {
  A: namesA as unknown as LetterNamesFile,
  B: namesB as unknown as LetterNamesFile,
  C: namesC as unknown as LetterNamesFile,
  D: namesD as unknown as LetterNamesFile,
  E: namesE as unknown as LetterNamesFile,
  F: namesF as unknown as LetterNamesFile,
  G: namesG as unknown as LetterNamesFile,
  H: namesH as unknown as LetterNamesFile,
  I: namesI as unknown as LetterNamesFile,
  J: namesJ as unknown as LetterNamesFile,
  K: namesK as unknown as LetterNamesFile,
  L: namesL as unknown as LetterNamesFile,
  M: namesM as unknown as LetterNamesFile,
  N: namesN as unknown as LetterNamesFile,
  O: namesO as unknown as LetterNamesFile,
  P: namesP as unknown as LetterNamesFile,
  Q: namesQ as unknown as LetterNamesFile,
  R: namesR as unknown as LetterNamesFile,
  S: namesS as unknown as LetterNamesFile,
  T: namesT as unknown as LetterNamesFile,
  U: namesU as unknown as LetterNamesFile,
  V: namesV as unknown as LetterNamesFile,
  W: namesW as unknown as LetterNamesFile,
  X: namesX as unknown as LetterNamesFile,
  Y: namesY as unknown as LetterNamesFile,
  Z: namesZ as unknown as LetterNamesFile,
};

const KNOWN_COLLECTION_KEYS = ['names', 'data', 'items'] as const;

interface GeneratedPopularityRecord {
  usa: number;
  trend: Name['popularity']['trend'];
  latestYear: number;
}

const UNRANKED_POPULARITY = 999999;

const generatedPopularityById: Record<string, GeneratedPopularityRecord> = (
  generatedPopularityCurrentJson as { byId: Record<string, GeneratedPopularityRecord> }
).byId;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function toGender(value: unknown): Name['gender'] {
  if (value === 'male' || value === 'female' || value === 'unisex') {
    return value;
  }
  return 'unisex';
}

function toPopularity(value: unknown): Name['popularity'] {
  if (!isRecord(value)) {
    return { usa: UNRANKED_POPULARITY, trend: 'stable' };
  }

  const usa = typeof value.usa === 'number' ? value.usa : UNRANKED_POPULARITY;
  const trend = value.trend === 'rising' || value.trend === 'falling' || value.trend === 'stable'
    ? value.trend
    : 'stable';

  return { usa, trend };
}

function toNameSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function compareNameSlugPriority(a: Name, b: Name): number {
  const aRank = typeof a.popularity.usa === 'number' ? a.popularity.usa : UNRANKED_POPULARITY;
  const bRank = typeof b.popularity.usa === 'number' ? b.popularity.usa : UNRANKED_POPULARITY;

  if (aRank !== bRank) {
    return aRank - bRank;
  }

  return a.id.localeCompare(b.id);
}

function buildUniqueSlugFromId(id: string, usedSlugs: Set<string>): string {
  const baseSlug = toNameSlug(id);
  let slug = baseSlug;
  let suffix = 2;

  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  usedSlugs.add(slug);
  return slug;
}

function ensureUniqueNameSlugs(names: Name[]): Name[] {
  const namesBySlug = new Map<string, Name[]>();

  for (const name of names) {
    const slugMatches = namesBySlug.get(name.slug);
    if (slugMatches) {
      slugMatches.push(name);
    } else {
      namesBySlug.set(name.slug, [name]);
    }
  }

  const assignedSlugs = new Map<string, string>();
  const secondaryNames: Name[] = [];
  const usedSlugs = new Set<string>();

  for (const [slug, slugNames] of namesBySlug) {
    const sortedNames = [...slugNames].sort(compareNameSlugPriority);
    const [primaryName, ...otherNames] = sortedNames;

    assignedSlugs.set(primaryName.id, slug);
    usedSlugs.add(slug);
    secondaryNames.push(...otherNames);
  }

  for (const name of secondaryNames) {
    assignedSlugs.set(name.id, buildUniqueSlugFromId(name.id, usedSlugs));
  }

  return names.map((name) => {
    const slug = assignedSlugs.get(name.id) || name.slug;
    return slug === name.slug ? name : { ...name, slug };
  });
}

function normalizeName(value: unknown): Name | null {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.id !== 'string' || typeof value.name !== 'string') {
    return null;
  }

  const slugSource = typeof value.slug === 'string' && value.slug.trim()
    ? value.slug
    : value.name;
  const slug = toNameSlug(slugSource) || toNameSlug(value.id);

  const siblings = isRecord(value.siblingSuggestions) ? value.siblingSuggestions : {};
  const famousNamesakesInput = Array.isArray(value.famousNamesakes) ? value.famousNamesakes : [];
  const famousNamesakes = famousNamesakesInput
    .filter(isRecord)
    .map(item => ({
      name: typeof item.name === 'string' ? item.name : '',
      description: typeof item.description === 'string' ? item.description : '',
    }))
    .filter(item => item.name && item.description);

  const generatedPopularity = generatedPopularityById[value.id];

  return {
    id: value.id,
    name: value.name,
    slug,
    gender: toGender(value.gender),
    origins: toStringArray(value.origins),
    meaning: typeof value.meaning === 'string' ? value.meaning : '',
    meaningKeywords: toStringArray(value.meaningKeywords),
    pronunciation: typeof value.pronunciation === 'string' ? value.pronunciation : '',
    syllables: typeof value.syllables === 'number' ? value.syllables : 0,
    popularity: generatedPopularity
      ? {
          usa: generatedPopularity.usa,
          trend: generatedPopularity.trend,
          latestYear: generatedPopularity.latestYear,
        }
      : toPopularity(value.popularity),
    nicknames: toStringArray(value.nicknames),
    siblingSuggestions: {
      brothers: toStringArray(siblings.brothers),
      sisters: toStringArray(siblings.sisters),
    },
    categories: toStringArray(value.categories),
    famousNamesakes,
    description: typeof value.description === 'string' ? value.description : '',
    history: typeof value.history === 'string' ? value.history : undefined,
    publishedAt: DEFAULT_NAME_DATES.publishedAt,
    updatedAt: DEFAULT_NAME_DATES.updatedAt,
  };
}

function normalizeNames(entries: unknown[]): Name[] {
  return entries
    .map(normalizeName)
    .filter((name): name is Name => name !== null && !isExcludedWrongGenderNameId(name.id));
}

function extractNamesFromFile(file: LetterNamesFile): Name[] {
  if (Array.isArray(file)) {
    return normalizeNames(file);
  }

  if (!isRecord(file)) {
    return [];
  }

  for (const key of KNOWN_COLLECTION_KEYS) {
    const value = file[key];
    if (Array.isArray(value)) {
      return normalizeNames(value);
    }
  }

  const groupedNames: unknown[] = [];
  for (const [key, value] of Object.entries(file)) {
    if (/^[A-Za-z]$/.test(key) && Array.isArray(value)) {
      groupedNames.push(...value);
    }
  }

  return normalizeNames(groupedNames);
}

// Cache for all names
let allNamesCache: Name[] | null = null;
let namesByIdCache: Map<string, Name> | null = null;
let namesBySlugCache: Map<string, Name> | null = null;

/**
 * Get all names from all letter files
 * Results are cached for performance
 */
export function getAllNames(): Name[] {
  if (allNamesCache) {
    return allNamesCache;
  }

  const allNames: Name[] = [];
  for (const letter of Object.keys(letterFiles).sort()) {
    const file = letterFiles[letter];
    allNames.push(...extractNamesFromFile(file));
  }

  allNamesCache = ensureUniqueNameSlugs(allNames);
  return allNamesCache;
}

/**
 * Get names by starting letter
 */
export function getNamesByLetter(letter: string): Name[] {
  const upperLetter = letter.toUpperCase();
  return getAllNames().filter((name) => name.name.charAt(0).toUpperCase() === upperLetter);
}

/**
 * Get a name by ID
 */
export function getNameById(id: string): Name | undefined {
  if (!namesByIdCache) {
    namesByIdCache = new Map();
    for (const name of getAllNames()) {
      namesByIdCache.set(name.id, name);
    }
  }
  return namesByIdCache.get(id);
}

/**
 * Get a name by slug
 */
export function getNameBySlug(slug: string): Name | undefined {
  if (!namesBySlugCache) {
    namesBySlugCache = new Map();
    for (const name of getAllNames()) {
      if (namesBySlugCache.has(name.slug)) {
        throw new Error(`Duplicate name slug detected after normalization: ${name.slug}`);
      }
      namesBySlugCache.set(name.slug, name);
    }
  }
  return namesBySlugCache.get(slug);
}

export function getNameByPathSegment(segment: string): Name | undefined {
  return getNameBySlug(segment) || getNameById(segment);
}

/**
 * Get names by gender
 */
export function getNamesByGender(gender: 'male' | 'female' | 'unisex'): Name[] {
  return getAllNames().filter(name => name.gender === gender);
}

/**
 * Get names by origin
 */
export function getNamesByOrigin(origin: string): Name[] {
  const lowerOrigin = origin.toLowerCase();
  return getAllNames().filter(name =>
    name.origins.some(o => o.toLowerCase() === lowerOrigin)
  );
}

/**
 * Get names by category
 */
export function getNamesByCategory(category: string): Name[] {
  const lowerCategory = category.toLowerCase();
  return getAllNames().filter(name =>
    name.categories.some(c => c.toLowerCase() === lowerCategory)
  );
}

/**
 * Get names by meaning keywords
 */
export function getNamesByMeaning(keywords: string[]): Name[] {
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  return getAllNames().filter(name => {
    const nameMeaningWords = name.meaning.toLowerCase().split(/\s+/);
    const nameKeywords = name.meaningKeywords?.map(k => k.toLowerCase()) || [];
    const allWords = [...nameMeaningWords, ...nameKeywords];

    return lowerKeywords.some(keyword =>
      allWords.some(word => word.includes(keyword))
    );
  });
}

/**
 * Search names by query
 */
export function searchNames(query: string): Name[] {
  const q = query.toLowerCase();
  return getAllNames().filter(name =>
    name.name.toLowerCase().includes(q) ||
    name.meaning.toLowerCase().includes(q) ||
    name.origins.some(o => o.toLowerCase().includes(q)) ||
    name.categories.some(c => c.toLowerCase().includes(q))
  );
}

/**
 * Get random names
 */
export function getRandomNames(count: number = 10): Name[] {
  const allNames = getAllNames();
  const shuffled = [...allNames].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get popular names (sorted by popularity rank)
 */
export function getPopularNames(limit: number = 100): Name[] {
  return getAllNames()
    .filter(name => name.popularity?.usa)
    .sort((a, b) => (a.popularity.usa || 999) - (b.popularity.usa || 999))
    .slice(0, limit);
}

/**
 * Filter names by list definition filter
 */
export function filterNamesByListFilter(filter: {
  type?: string;
  matchAny?: string[];
  gender?: string;
  startsWith?: string;
  origin?: string;
  meaningKeywords?: string[];
  category?: string;
  syllables?: number;
  maxRank?: number;
  country?: string;
}): Name[] {
  let results = getAllNames();

  // Filter by gender
  if (filter.gender && filter.gender !== 'all') {
    results = results.filter(name => name.gender === filter.gender);
  }

  // Filter by starting letter
  if (filter.startsWith) {
    results = results.filter(name =>
      name.name.toUpperCase().startsWith(filter.startsWith!.toUpperCase())
    );
  }

  // Filter by origin
  if (filter.origin) {
    const origin = filter.origin.toLowerCase();
    results = results.filter(name =>
      name.origins.some(o => o.toLowerCase().includes(origin))
    );
  }

  // Filter by meaning keywords (matchAny or meaningKeywords)
  const meaningWords = filter.matchAny || filter.meaningKeywords || [];
  if (meaningWords.length > 0) {
    const lowerKeywords = meaningWords.map(k => k.toLowerCase());
    results = results.filter(name => {
      const nameMeaningWords = name.meaning.toLowerCase().split(/\s+/);
      const nameKeywords = name.meaningKeywords?.map(k => k.toLowerCase()) || [];
      const allWords = [...nameMeaningWords, ...nameKeywords];

      return lowerKeywords.some(keyword =>
        allWords.some(word => word.includes(keyword))
      );
    });
  }

  // Filter by category
  if (filter.category) {
    const category = filter.category.toLowerCase();
    results = results.filter(name =>
      name.categories.some(c => c.toLowerCase().includes(category))
    );
  }

  // Filter by syllables
  if (filter.syllables) {
    results = results.filter(name => name.syllables === filter.syllables);
  }

  // Filter by popularity rank
  if (filter.maxRank) {
    results = results.filter(name =>
      name.popularity?.usa && name.popularity.usa <= filter.maxRank!
    );
    // Sort by popularity
    results.sort((a, b) => (a.popularity?.usa || 999) - (b.popularity?.usa || 999));
  }

  return results;
}

/**
 * Get stats about the names database
 */
export function getNamesStats(): {
  total: number;
  byGender: Record<string, number>;
  byLetter: Record<string, number>;
  byOrigin: Record<string, number>;
} {
  const allNames = getAllNames();

  const byGender: Record<string, number> = { male: 0, female: 0, unisex: 0 };
  const byLetter: Record<string, number> = {};
  const byOrigin: Record<string, number> = {};

  for (const name of allNames) {
    // Count by gender
    byGender[name.gender] = (byGender[name.gender] || 0) + 1;

    // Count by letter
    const letter = name.name.charAt(0).toUpperCase();
    byLetter[letter] = (byLetter[letter] || 0) + 1;

    // Count by origin
    for (const origin of name.origins) {
      byOrigin[origin] = (byOrigin[origin] || 0) + 1;
    }
  }

  return {
    total: allNames.length,
    byGender,
    byLetter,
    byOrigin,
  };
}

// Export the full database for backwards compatibility
export const NAMES_DB = getAllNames();