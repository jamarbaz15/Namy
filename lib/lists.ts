/**
 * Hybrid List Loader
 *
 * Combines:
 * - Core lists (500) - Manually defined in JSON with custom intros
 * - Generated lists (19,500+) - Programmatically created from combinations
 *
 * This module provides unified access to all list definitions.
 */

import type { ListDefinition, IntroTemplate, Name } from '@/types';

// Import core lists from JSON
import coreMeanings from '@/data/lists/core/meanings.json';
import meaningPillars from '@/data/lists/core/meaning-pillars.json';
import coreOrigins from '@/data/lists/core/origins.json';
import coreCategories from '@/data/lists/core/categories.json';
import coreLetters from '@/data/lists/core/letters.json';

// Import generated JSON list datasets
import generatedMeaningSeedsJson from '@/data/lists/generated/meaning-seeds.json';
import generatedCombinationListsJson from '@/data/lists/generated/combination-lists.json';
import { AUTO_LETTER_LIST_DATES, LIST_SOURCE_DATE_METADATA } from '@/data/content-metadata';

// Import content templates
import contentTemplates from '@/data/lists/content/templates.json';

// Type for core list JSON structure
interface CoreListsFile {
  lists: ListDefinition[];
}

interface MeaningPillarDefinition {
  slug: string;
  title: string;
  description: string;
  intro: string;
  childSlugs: string[];
  keywords: string[];
  canonicalSlug?: string;
}

interface MeaningPillarsFile {
  pillars: MeaningPillarDefinition[];
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MEANING_PILLAR_STOP_WORDS = new Set([
  'and',
  'baby',
  'mean',
  'meaning',
  'name',
  'names',
  'that',
  'the',
  'with',
]);

const BABY_FEATURED_IMAGES = [
  'https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=1200',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200',
  'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?q=80&w=1200',
  'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?q=80&w=1200',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200',
  'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b9f?q=80&w=1200',
  'https://images.unsplash.com/photo-1522850968212-ab12050c75db?q=80&w=1200',
];

// Cache for all lists (loaded once)
let allListsCache: ListDefinition[] | null = null;
let listsBySlugCache: Map<string, ListDefinition> | null = null;
let listMatchesByNameIdCache: Map<string, ListDefinition[]> | null = null;

const LIST_PRIORITY_WEIGHTS: Record<NonNullable<ListDefinition['priority']>, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

interface ListNormalizationOverride extends Partial<Omit<ListDefinition, 'filter'>> {
  filter?: Partial<ListDefinition['filter']>;
}

const LIST_NORMALIZATION_OVERRIDES: Record<string, ListNormalizationOverride> = {
  'names-that-mean-nature': {
    seoTitle: 'Baby Names That Mean Nature, Earth & Forest | Namylab',
    seoDescription: 'Find baby names whose literal meanings connect to nature, earth, forests, rivers, oceans, and the natural world.',
  },
  'nature-baby-names': {
    seoTitle: 'Nature-Themed Baby Names Inspired by Flowers, Trees & Earth | Namylab',
    seoDescription: 'Browse baby names grouped by a nature theme, including botanical, earth, and outdoors-inspired options.',
    keywords: ['Nature', 'Botanical', 'Earth', 'Outdoors', 'Natural'],
  },
  'names-that-mean-strength': {
    seoTitle: 'Baby Names That Mean Strength, Power & Resilience | Namylab',
    seoDescription: 'Find baby names that literally mean strength, power, resilience, might, or endurance.',
    keywords: ['Strength', 'Power', 'Resilience', 'Might'],
    filter: {
      matchAny: ['strength', 'strong', 'power', 'might', 'resilience', 'resilient', 'fortitude', 'endurance'],
    },
  },
  'strong-baby-names': {
    seoTitle: 'Strong Baby Names with Bold, Powerful Style | Namylab',
    seoDescription: 'Browse bold and powerful baby names chosen for a strong style, confident sound, and commanding feel.',
  },
  'celestial-baby-names': {
    seoTitle: 'Cosmic & Celestial Baby Names Inspired by Space and Sky | Namylab',
    seoDescription: 'Explore baby names themed around the cosmos, astronomy, planets, and the night sky.',
    keywords: ['Celestial', 'Cosmic', 'Space', 'Sky', 'Astronomy'],
    relatedLists: ['names-that-mean-star', 'names-that-mean-moon', 'names-that-mean-sun'],
  },
  'hebrew-baby-names': {
    seoTitle: 'Hebrew Baby Names - Jewish and Hebrew Origins | Namylab',
    seoDescription: 'Find Hebrew and Jewish baby names with meanings, origins, and cultural significance.',
    keywords: ['Hebrew', 'Jewish', 'Israeli'],
  },
  'names-that-mean-light': {
    seoTitle: 'Baby Names That Mean Light, Brightness & Glow | Namylab',
    seoDescription: 'Discover baby names that literally mean light, brightness, radiance, or glow.',
    keywords: ['Light', 'Bright', 'Shine', 'Glow'],
    filter: {
      matchAny: ['light', 'bright', 'shine', 'radiant', 'luminous', 'glow', 'illumination'],
    },
  },
  'names-that-mean-sun': {
    seoTitle: 'Baby Names That Mean Sun, Solar & Sunshine | Namylab',
    seoDescription: 'Discover baby names that literally mean sun, solar light, warmth, or sunshine.',
    keywords: ['Sun', 'Solar', 'Sunshine', 'Sunny'],
    filter: {
      matchAny: ['sun', 'solar', 'sunshine', 'sunny', 'sunrise'],
    },
  },
  'names-that-mean-star': {
    seoTitle: 'Baby Names That Mean Star, Stellar & Astral | Namylab',
    seoDescription: 'Find baby names that literally mean star, stellar light, or astral brilliance.',
    keywords: ['Star', 'Stellar', 'Astral', 'Constellation'],
    filter: {
      matchAny: ['star', 'stellar', 'astral', 'constellation', 'galaxy'],
    },
  },
  'names-that-mean-moon': {
    seoTitle: 'Baby Names That Mean Moon, Lunar & Moonlight | Namylab',
    seoDescription: 'Find baby names that literally mean moon, lunar light, moonlight, or crescent.',
    keywords: ['Moon', 'Lunar', 'Moonlight', 'Crescent'],
    filter: {
      matchAny: ['moon', 'lunar', 'moonlight', 'crescent'],
    },
  },
};

const GENERATED_MEANING_SEED_ORIGIN_PREFIXES = [
  {
    slugPrefix: 'japanese-names-that-mean-',
    origin: 'Japanese',
  },
] as const;

/**
 * Get all core lists from JSON files
 */
export function getCoreLists(): ListDefinition[] {
  const coreMeaningLists = (coreMeanings as CoreListsFile).lists.map((list) =>
    normalizeLoadedListDefinition(ensureListDates(list, 'data/lists/core/meanings.json'))
  );
  const meaningPillarLists = getMeaningPillarLists(coreMeaningLists);
  const meaningPillarSlugSet = new Set(meaningPillarLists.map((list) => list.slug));
  const baseCore: ListDefinition[] = [
    ...meaningPillarLists,
    ...coreMeaningLists.filter((list) => !meaningPillarSlugSet.has(list.slug)),
    ...(coreOrigins as CoreListsFile).lists.map((list) => normalizeLoadedListDefinition(ensureListDates(list, 'data/lists/core/origins.json'))),
    ...(coreCategories as CoreListsFile).lists.map((list) => normalizeLoadedListDefinition(ensureListDates(list, 'data/lists/core/categories.json'))),
    ...(coreLetters as CoreListsFile).lists.map((list) => normalizeLoadedListDefinition(ensureListDates(list, 'data/lists/core/letters.json'))),
  ];

  const withAllLetters = ensureAllLetterLists(baseCore);
  const coreWithImages = withAllLetters.map(ensureFeaturedImage);

  const existingSlugs = new Set(coreWithImages.map(list => list.slug));
  const generatedMeaningSeeds = (generatedMeaningSeedsJson as CoreListsFile).lists.filter(
    (list) => !existingSlugs.has(list.slug)
  ).map((list) => normalizeGeneratedMeaningSeedList(ensureListDates(list, 'data/lists/generated/meaning-seeds.json')));
  const generatedWithImages = generatedMeaningSeeds.map(ensureFeaturedImage);

  return [...coreWithImages, ...generatedWithImages];
}

/**
 * Get all lists (core + generated)
 * Results are cached for performance
 */
export function getAllLists(): ListDefinition[] {
  if (allListsCache) {
    return allListsCache;
  }

  const coreLists = getCoreLists();
  const generatedLists = (generatedCombinationListsJson as CoreListsFile).lists.map((list) =>
    ensureListDates(list, 'data/lists/generated/combination-lists.json')
  );

  // Core lists take priority - filter out generated lists with same slug
  const coreSlugSet = new Set(coreLists.map(list => list.slug));
  const filteredGenerated = generatedLists.filter(
    list => !coreSlugSet.has(list.slug)
  );

  const generatedWithImages = filteredGenerated.map(ensureFeaturedImage);

  allListsCache = [...coreLists, ...generatedWithImages];
  return allListsCache;
}

function getMeaningPillarLists(coreMeaningLists: ListDefinition[]): ListDefinition[] {
  const coreMeaningBySlug = new Map(coreMeaningLists.map((list) => [list.slug, list]));

  return (meaningPillars as MeaningPillarsFile).pillars.map((pillar) =>
    normalizeLoadedListDefinition(
      ensureListDates(
        createMeaningPillarList(pillar, coreMeaningBySlug.get(pillar.slug)),
        'data/lists/core/meaning-pillars.json'
      )
    )
  );
}

function normalizeGeneratedMeaningSeedList(list: ListDefinition): ListDefinition {
  if (list.filter?.type !== 'meaning') {
    return list;
  }

  for (const entry of GENERATED_MEANING_SEED_ORIGIN_PREFIXES) {
    if (!list.slug.startsWith(entry.slugPrefix)) {
      continue;
    }

    const normalizedMatchAny = uniqueStrings(
      (list.filter.matchAny || [])
        .map((term) => term.trim())
        .filter(Boolean)
        .filter((term) => !term.toLowerCase().includes(entry.origin.toLowerCase()))
    );
    const fallbackMeaningTerm = list.slug.slice(entry.slugPrefix.length).replace(/-/g, ' ');

    return {
      ...list,
      filter: {
        ...list.filter,
        origin: entry.origin,
        matchAny: normalizedMatchAny.length > 0 ? normalizedMatchAny : [fallbackMeaningTerm],
      },
    };
  }

  return list;
}

function normalizeLoadedListDefinition(list: ListDefinition): ListDefinition {
  const override = LIST_NORMALIZATION_OVERRIDES[list.slug];
  if (!override) {
    return list;
  }

  const normalizedFilter = override.filter
    ? {
        ...list.filter,
        ...override.filter,
        ...(override.filter.matchAny ? { matchAny: uniqueStrings(override.filter.matchAny) } : {}),
        ...(override.filter.meaningKeywords ? { meaningKeywords: uniqueStrings(override.filter.meaningKeywords) } : {}),
      }
    : list.filter;

  return {
    ...list,
    ...override,
    filter: normalizedFilter,
    keywords: override.keywords ? uniqueStrings(override.keywords) : list.keywords,
    relatedLists: override.relatedLists ? uniqueStrings(override.relatedLists) : list.relatedLists,
  };
}

function createMeaningPillarList(
  pillar: MeaningPillarDefinition,
  sourceList?: ListDefinition
): ListDefinition {
  const slug = pillar.canonicalSlug || pillar.slug;

  return {
    id: sourceList?.id || slug,
    slug,
    title: pillar.title,
    seoTitle: sourceList?.seoTitle || `${pillar.title} | Namylab`,
    seoDescription: pillar.description,
    category: sourceList?.category || 'meaning',
    type: sourceList?.type || 'meaning',
    keywords: uniqueStrings([...(sourceList?.keywords || []), ...pillar.keywords]),
    filter: sourceList?.filter || buildMeaningPillarFilter(pillar),
    relatedLists: pillar.childSlugs.length > 0 ? uniqueStrings(pillar.childSlugs) : (sourceList?.relatedLists || []),
    featuredImage: sourceList?.featuredImage,
    priority: sourceList?.priority || 'high',
    customIntro: pillar.intro,
    publishedAt: sourceList?.publishedAt,
    updatedAt: sourceList?.updatedAt,
  };
}

function buildMeaningPillarFilter(pillar: MeaningPillarDefinition): ListDefinition['filter'] {
  const terms = new Set<string>();
  const canonicalMeaning = (pillar.canonicalSlug || pillar.slug)
    .replace(/^names-that-mean-/, '')
    .replace(/-/g, ' ')
    .trim()
    .toLowerCase();

  if (canonicalMeaning) {
    terms.add(canonicalMeaning);
  }

  addMeaningPillarTerms(terms, pillar.title);
  pillar.keywords.forEach((keyword) => addMeaningPillarTerms(terms, keyword));

  return {
    type: 'meaning',
    matchAny: Array.from(terms),
  };
}

function addMeaningPillarTerms(target: Set<string>, value: string): void {
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .forEach((term) => {
      if (term.length < 3 || MEANING_PILLAR_STOP_WORDS.has(term)) {
        return;
      }

      target.add(term);
    });
}

function ensureAllLetterLists(lists: ListDefinition[]): ListDefinition[] {
  const existingByLetter = new Map<string, ListDefinition>();

  for (const list of lists) {
    if (list.category !== 'letter' || list.type !== 'letter') {
      continue;
    }

    const startsWith = (list.filter?.startsWith || '').toUpperCase();
    if (startsWith && !existingByLetter.has(startsWith)) {
      existingByLetter.set(startsWith, list);
    }
  }

  const missingLetterLists: ListDefinition[] = [];

  for (let i = 0; i < LETTERS.length; i += 1) {
    const letter = LETTERS[i];
    if (existingByLetter.has(letter)) {
      continue;
    }

    const previousLetter = LETTERS[(i + LETTERS.length - 1) % LETTERS.length].toLowerCase();
    const nextLetter = LETTERS[(i + 1) % LETTERS.length].toLowerCase();
    const slug = `names-starting-with-${letter.toLowerCase()}`;

    missingLetterLists.push({
      id: slug,
      slug,
      title: `Baby Names Starting with ${letter}`,
      seoTitle: `Baby Names That Start With ${letter} | Namylab`,
      seoDescription: `Browse baby names starting with ${letter}. Find popular and unique names beginning with ${letter} for boys and girls.`,
      category: 'letter',
      type: 'letter',
      keywords: [`${letter} names`, `Starts with ${letter}`],
      filter: {
        type: 'letter',
        startsWith: letter,
      },
      relatedLists: [`names-starting-with-${previousLetter}`, `names-starting-with-${nextLetter}`],
      priority: 'medium',
      publishedAt: AUTO_LETTER_LIST_DATES.publishedAt,
      updatedAt: AUTO_LETTER_LIST_DATES.updatedAt,
    });
  }

  return [...lists, ...missingLetterLists];
}

function ensureListDates(list: ListDefinition, sourcePath: string): ListDefinition {
  const dates = LIST_SOURCE_DATE_METADATA[sourcePath];
  if (!dates) {
    return list;
  }

  return {
    ...list,
    publishedAt: list.publishedAt || dates.publishedAt,
    updatedAt: list.updatedAt || dates.updatedAt,
  };
}

function ensureFeaturedImage(list: ListDefinition): ListDefinition {
  if (list.featuredImage) {
    return list;
  }

  return {
    ...list,
    featuredImage: getBabyFeaturedImage(list.slug || list.id || list.title || 'namylab')
  };
}

function getBabyFeaturedImage(seed: string): string {
  let hash = 0;
  for (const ch of seed) {
    hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  }

  const index = Math.abs(hash) % BABY_FEATURED_IMAGES.length;
  return BABY_FEATURED_IMAGES[index];
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

/**
 * Get list by slug
 * Core lists are prioritized over generated lists
 */
export function getListBySlug(slug: string): ListDefinition | undefined {
  // Build cache if needed
  if (!listsBySlugCache) {
    listsBySlugCache = new Map();
    const allLists = getAllLists();
    for (const list of allLists) {
      listsBySlugCache.set(list.slug, list);
    }
  }

  return listsBySlugCache.get(slug);
}

/**
 * Get all list slugs (for static generation)
 */
export function getAllListSlugs(): string[] {
  return getAllLists().map(list => list.slug);
}

/**
 * Get lists by category/type
 */
export function getListsByCategory(category: string): ListDefinition[] {
  return getAllLists().filter(list => list.category === category);
}

/**
 * Get lists by type
 */
export function getListsByType(type: string): ListDefinition[] {
  return getAllLists().filter(list => list.type === type);
}

/**
 * Get content for a list
 * Uses custom intro if available, otherwise generates from template
 */
export function getListContent(
  list: ListDefinition,
  nameCount: number
): {
  intro: string;
  seoTitle: string;
  seoDescription: string;
  sections: Array<{ title: string; content: string }>;
  relatedSearches: string[];
} {
  // Check if list has custom content (core lists)
  if (list.customIntro) {
    return {
      intro: replaceVariables(list.customIntro, list, nameCount),
      seoTitle: list.seoTitle || `${list.title} | Namylab`,
      seoDescription: list.seoDescription || list.title,
      sections: [],
      relatedSearches: []
    };
  }

  // Use template based on list type (cast through unknown for loose JSON types)
  const templates = contentTemplates.templates as unknown as Record<string, Partial<IntroTemplate>>;
  const template = templates[list.type || ''] || templates.default;

  if (!template) {
    return {
      intro: `Discover ${nameCount}+ names in this collection.`,
      seoTitle: `${list.title} | Namylab`,
      seoDescription: list.title,
      sections: [],
      relatedSearches: []
    };
  }

  return {
    intro: replaceVariables(template.intro || '', list, nameCount),
    seoTitle: replaceVariables(template.seoTitle || `${list.title} | Namylab`, list, nameCount),
    seoDescription: replaceVariables(template.seoDescription || list.title, list, nameCount),
    sections: (template.sections || []).map(section => ({
      title: replaceVariables(section.title, list, nameCount),
      content: replaceVariables(section.content, list, nameCount)
    })),
    relatedSearches: template.relatedSearches || []
  };
}

/**
 * Replace template variables with actual values
 */
function replaceVariables(
  text: string,
  list: ListDefinition,
  nameCount: number
): string {
  const filter = list.filter || {};

  // Extract values from list
  const origin = filter.origin || (list.keywords?.[0] || '');
  const gender = filter.gender || 'all';
  const meaning = filter.meaningKeywords?.[0] || (list.keywords?.[0] || '');
  const letter = filter.startsWith || '';
  const category = filter.category || list.category || '';
  const country = filter.country || 'USA';

  // Gender noun mapping
  const genderNoun = gender === 'male' ? 'boy' :
                     gender === 'female' ? 'girl' : 'child';

  // Syllable label
  const syllables = filter.syllables || 0;
  const syllableLabel = syllables === 1 ? 'One-Syllable' :
                        syllables === 2 ? 'Two-Syllable' :
                        syllables === 3 ? 'Three-Syllable' :
                        syllables === 4 ? 'Four-Syllable' : '';

  // Variable replacements
  const variables: Record<string, string> = {
    '{origin}': capitalize(origin),
    '{gender}': capitalize(gender === 'male' ? 'Boy' : gender === 'female' ? 'Girl' : 'Unisex'),
    '{meaning}': capitalize(meaning),
    '{letter}': letter.toUpperCase(),
    '{category}': capitalize(category),
    '{country}': country.toUpperCase(),
    '{count}': nameCount.toString(),
    '{genderNoun}': genderNoun,
    '{keyword}': capitalize(list.keywords?.[0] || ''),
    '{title}': list.title,
    '{syllableLabel}': syllableLabel
  };

  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }

  return result;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get statistics about available lists
 */
export function getListStats(): {
  total: number;
  core: number;
  generated: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
} {
  const coreLists = getCoreLists();
  const allLists = getAllLists();

  const byCategory: Record<string, number> = {};
  const byType: Record<string, number> = {};

  for (const list of allLists) {
    const cat = list.category || 'unknown';
    const type = list.type || 'unknown';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
    byType[type] = (byType[type] || 0) + 1;
  }

  return {
    total: allLists.length,
    core: coreLists.length,
    generated: Math.max(0, allLists.length - coreLists.length),
    byCategory,
    byType
  };
}

/**
 * Search lists by query
 */
export function searchLists(query: string): ListDefinition[] {
  const q = query.toLowerCase();
  return getAllLists().filter(list =>
    list.title.toLowerCase().includes(q) ||
    list.slug.includes(q) ||
    list.keywords?.some(k => k.toLowerCase().includes(q))
  );
}

function normalizeFilterTerms(terms?: string[]): string[] {
  return (terms || [])
    .map(term => term.toLowerCase().trim())
    .filter(Boolean);
}

function matchesMeaningTerms(name: Name, terms?: string[]): boolean {
  const normalizedTerms = normalizeFilterTerms(terms);
  if (normalizedTerms.length === 0) {
    return true;
  }

  const normalizedKeywords = (name.meaningKeywords || [])
    .map(keyword => keyword.toLowerCase());
  const meaningText = `${name.meaning || ''} ${name.description || ''}`.toLowerCase();

  return normalizedTerms.some(term =>
    normalizedKeywords.some(keyword => keyword.includes(term)) ||
    meaningText.includes(term)
  );
}

function matchesOriginTerms(name: Name, terms?: string[]): boolean {
  const normalizedTerms = normalizeFilterTerms(terms);
  if (normalizedTerms.length === 0) {
    return true;
  }

  return name.origins.some(origin =>
    normalizedTerms.some(term => origin.toLowerCase().includes(term))
  );
}

function matchesCategoryTerms(name: Name, terms?: string[]): boolean {
  const normalizedTerms = normalizeFilterTerms(terms);
  if (normalizedTerms.length === 0) {
    return true;
  }

  return (name.categories || []).some(category =>
    normalizedTerms.some(term => category.toLowerCase() === term)
  );
}

function getListSpecificityScore(list: ListDefinition): number {
  const filter = list.filter || {};

  return [
    filter.gender && filter.gender !== 'all' ? 1 : 0,
    filter.startsWith ? 1 : 0,
    filter.origin ? 1 : 0,
    filter.category ? 1 : 0,
    filter.syllables ? 1 : 0,
    filter.maxRank ? 1 : 0,
    filter.meaningKeywords?.length || 0,
    filter.matchAny?.length || 0,
  ].reduce((total, value) => total + value, 0);
}

function compareListMatches(a: ListDefinition, b: ListDefinition): number {
  const priorityDelta =
    (LIST_PRIORITY_WEIGHTS[a.priority || 'low'] ?? LIST_PRIORITY_WEIGHTS.low) -
    (LIST_PRIORITY_WEIGHTS[b.priority || 'low'] ?? LIST_PRIORITY_WEIGHTS.low);

  if (priorityDelta !== 0) {
    return priorityDelta;
  }

  const specificityDelta = getListSpecificityScore(b) - getListSpecificityScore(a);
  if (specificityDelta !== 0) {
    return specificityDelta;
  }

  return a.title.localeCompare(b.title);
}

export function doesNameMatchList(name: Name, list: ListDefinition): boolean {
  const { filter } = list;

  if (!filter) {
    return false;
  }

  if (filter.gender && filter.gender !== 'all' && name.gender !== filter.gender) {
    return false;
  }

  if (filter.startsWith && !name.name.toUpperCase().startsWith(filter.startsWith.toUpperCase())) {
    return false;
  }

  if (filter.origin) {
    const targetOrigin = filter.origin.toLowerCase();
    const hasOrigin = name.origins.some(origin => origin.toLowerCase().includes(targetOrigin));
    if (!hasOrigin) {
      return false;
    }
  }

  if (filter.category) {
    const targetCategory = filter.category.toLowerCase();
    const hasCategory = (name.categories || []).some(category => category.toLowerCase() === targetCategory);
    if (!hasCategory) {
      return false;
    }
  }

  if (filter.syllables && name.syllables !== filter.syllables) {
    return false;
  }

  if (filter.maxRank && name.popularity.usa > filter.maxRank) {
    return false;
  }

  if (filter.meaningKeywords && !matchesMeaningTerms(name, filter.meaningKeywords)) {
    return false;
  }

  switch (filter.type) {
    case 'meaning':
      return matchesMeaningTerms(name, filter.matchAny);

    case 'origin':
      return matchesOriginTerms(name, filter.matchAny);

    case 'category':
      return matchesCategoryTerms(name, filter.matchAny);

    case 'letter':
    case 'gender':
    case 'popularity':
      return true;

    case 'custom':
    default:
      return matchesMeaningTerms(name, filter.matchAny);
  }
}

export function getListsForName(name: Name): ListDefinition[] {
  if (!listMatchesByNameIdCache) {
    listMatchesByNameIdCache = new Map();
  }

  const cached = listMatchesByNameIdCache.get(name.id);
  if (cached) {
    return cached;
  }

  const matches = getAllLists()
    .filter(list => doesNameMatchList(name, list))
    .sort(compareListMatches);

  listMatchesByNameIdCache.set(name.id, matches);
  return matches;
}

/**
 * Get related lists for a given list
 */
export function getRelatedLists(list: ListDefinition, limit = 5): ListDefinition[] {
  const related: ListDefinition[] = [];

  // First, add explicitly related lists
  if (list.relatedLists) {
    for (const slug of list.relatedLists) {
      const relatedList = getListBySlug(slug);
      if (relatedList && relatedList.slug !== list.slug) {
        related.push(relatedList);
      }
      if (related.length >= limit) break;
    }
  }

  // If we need more, find lists with similar keywords
  if (related.length < limit && list.keywords) {
    const allLists = getAllLists();
    for (const otherList of allLists) {
      if (
        otherList.slug !== list.slug &&
        !related.some(r => r.slug === otherList.slug) &&
        otherList.keywords?.some(k =>
          list.keywords!.some(lk =>
            k.toLowerCase() === lk.toLowerCase()
          )
        )
      ) {
        related.push(otherList);
        if (related.length >= limit) break;
      }
    }
  }

  return related.slice(0, limit);
}

// Export for backwards compatibility with old data/lists.ts
export const LIST_DEFINITIONS = getAllLists();




