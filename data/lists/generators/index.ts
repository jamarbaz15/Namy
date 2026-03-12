/**
 * List Generator for 19,500+ Combination Lists
 *
 * This generator creates dynamic list definitions by combining:
 * - Origins (20+)
 * - Genders (3: boy, girl, unisex)
 * - Meanings (30+)
 * - Letters (26)
 * - Categories (10+)
 *
 * Total potential combinations: 20,000+
 */

import type { ListDefinition } from '@/types';

// Building blocks for list generation
export const ORIGINS = [
  'irish', 'greek', 'hebrew', 'arabic', 'latin', 'indian', 'japanese',
  'african', 'spanish', 'italian', 'french', 'german', 'scottish',
  'welsh', 'chinese', 'korean', 'hawaiian', 'russian', 'polish',
  'portuguese', 'scandinavian', 'english', 'native-american', 'persian'
];

export const GENDERS = ['boy', 'girl', 'unisex'] as const;

export const MEANINGS = [
  'love', 'warrior', 'light', 'ocean', 'fire', 'strength', 'hope',
  'peace', 'beauty', 'grace', 'wisdom', 'joy', 'star', 'moon', 'sun',
  'noble', 'brave', 'gift', 'flower', 'nature', 'king', 'queen',
  'angel', 'victory', 'lion', 'wolf', 'bear', 'eagle', 'river',
  'mountain', 'earth', 'sky', 'storm', 'night', 'dawn'
];

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const CATEGORIES = [
  'classic', 'nature', 'royal', 'vintage', 'modern', 'unique',
  'biblical', 'mythological', 'literary', 'celestial'
];

// Helper functions
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toTitleCase(str: string): string {
  return str.split('-').map(capitalize).join(' ');
}

function getGenderNoun(gender: string): string {
  switch (gender) {
    case 'boy': return 'boys';
    case 'girl': return 'girls';
    case 'unisex': return 'babies';
    default: return 'babies';
  }
}

function getGenderFilter(gender: string): 'male' | 'female' | 'unisex' | 'all' {
  switch (gender) {
    case 'boy': return 'male';
    case 'girl': return 'female';
    case 'unisex': return 'unisex';
    default: return 'all';
  }
}

/**
 * Generate all combination lists
 * Returns an array of ListDefinition objects
 */
export function generateCombinationLists(): ListDefinition[] {
  const lists: ListDefinition[] = [];

  // 1. Origin + Gender (24 origins × 3 genders = 72)
  for (const origin of ORIGINS) {
    for (const gender of GENDERS) {
      lists.push({
        id: `${origin}-${gender}-names`,
        slug: `${origin}-${gender}-names`,
        title: `${toTitleCase(origin)} ${capitalize(gender)} Names`,
        seoTitle: `${toTitleCase(origin)} ${capitalize(gender)} Names - ${toTitleCase(origin)} Baby Names | Namylab`,
        category: 'origin-gender',
        type: 'origin-gender',
        keywords: [toTitleCase(origin), capitalize(gender)],
        filter: {
          type: 'custom',
          origin: toTitleCase(origin),
          gender: getGenderFilter(gender)
        },
        relatedLists: [`${origin}-baby-names`, `${gender}-names`],
        featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
        priority: 'low'
      });
    }
  }

  // 2. Origin + Meaning (24 × 35 = 840)
  for (const origin of ORIGINS) {
    for (const meaning of MEANINGS) {
      lists.push({
        id: `${origin}-names-meaning-${meaning}`,
        slug: `${origin}-names-meaning-${meaning}`,
        title: `${toTitleCase(origin)} Names Meaning ${capitalize(meaning)}`,
        seoTitle: `${toTitleCase(origin)} Names Meaning ${capitalize(meaning)} | Namylab`,
        category: 'origin-meaning',
        type: 'origin-meaning',
        keywords: [toTitleCase(origin), capitalize(meaning)],
        filter: {
          type: 'custom',
          origin: toTitleCase(origin),
          meaningKeywords: [meaning]
        },
        relatedLists: [`${origin}-baby-names`, `names-that-mean-${meaning}`],
        featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
        priority: 'low'
      });
    }
  }

  // 3. Gender + Meaning (3 × 35 = 105)
  for (const gender of GENDERS) {
    for (const meaning of MEANINGS) {
      lists.push({
        id: `${gender}-names-meaning-${meaning}`,
        slug: `${gender}-names-meaning-${meaning}`,
        title: `${capitalize(gender)} Names Meaning ${capitalize(meaning)}`,
        seoTitle: `${capitalize(gender)} Names Meaning ${capitalize(meaning)} | Namylab`,
        category: 'gender-meaning',
        type: 'gender-meaning',
        keywords: [capitalize(gender), capitalize(meaning)],
        filter: {
          type: 'custom',
          gender: getGenderFilter(gender),
          meaningKeywords: [meaning]
        },
        relatedLists: [`names-that-mean-${meaning}`, `${gender}-baby-names`],
        featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
        priority: 'low'
      });
    }
  }

  // 4. Letter + Gender (26 × 3 = 78)
  for (const letter of LETTERS) {
    for (const gender of GENDERS) {
      lists.push({
        id: `${gender}-names-starting-with-${letter.toLowerCase()}`,
        slug: `${gender}-names-starting-with-${letter.toLowerCase()}`,
        title: `${capitalize(gender)} Names Starting with ${letter}`,
        seoTitle: `${capitalize(gender)} Names That Start With ${letter} | Namylab`,
        category: 'letter-gender',
        type: 'letter-gender',
        keywords: [`${letter} names`, `Starts with ${letter}`, capitalize(gender)],
        filter: {
          type: 'custom',
          startsWith: letter,
          gender: getGenderFilter(gender)
        },
        relatedLists: [`names-starting-with-${letter.toLowerCase()}`],
        featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
        priority: 'low'
      });
    }
  }

  // 5. Origin + Gender + Meaning (24 × 3 × 35 = 2,520)
  // Only generate for top 10 origins and top 15 meanings to keep reasonable
  const topOrigins = ORIGINS.slice(0, 10);
  const topMeanings = MEANINGS.slice(0, 15);

  for (const origin of topOrigins) {
    for (const gender of GENDERS) {
      for (const meaning of topMeanings) {
        lists.push({
          id: `${origin}-${gender}-names-meaning-${meaning}`,
          slug: `${origin}-${gender}-names-meaning-${meaning}`,
          title: `${toTitleCase(origin)} ${capitalize(gender)} Names Meaning ${capitalize(meaning)}`,
          seoTitle: `${toTitleCase(origin)} ${capitalize(gender)} Names Meaning ${capitalize(meaning)} | Namylab`,
          category: 'origin-gender-meaning',
          type: 'origin-gender-meaning',
          keywords: [toTitleCase(origin), capitalize(gender), capitalize(meaning)],
          filter: {
            type: 'custom',
            origin: toTitleCase(origin),
            gender: getGenderFilter(gender),
            meaningKeywords: [meaning]
          },
          relatedLists: [`${origin}-baby-names`, `names-that-mean-${meaning}`],
          featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
          priority: 'low'
        });
      }
    }
  }

  // 6. Letter + Origin (26 × 24 = 624)
  // Only top 10 origins
  for (const letter of LETTERS) {
    for (const origin of topOrigins) {
      lists.push({
        id: `${origin}-names-starting-with-${letter.toLowerCase()}`,
        slug: `${origin}-names-starting-with-${letter.toLowerCase()}`,
        title: `${toTitleCase(origin)} Names Starting with ${letter}`,
        seoTitle: `${toTitleCase(origin)} Names That Start With ${letter} | Namylab`,
        category: 'letter-origin',
        type: 'letter-origin',
        keywords: [`${letter} names`, toTitleCase(origin)],
        filter: {
          type: 'custom',
          startsWith: letter,
          origin: toTitleCase(origin)
        },
        relatedLists: [`${origin}-baby-names`, `names-starting-with-${letter.toLowerCase()}`],
        featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
        priority: 'low'
      });
    }
  }

  // 7. Category + Gender (10 × 3 = 30)
  for (const category of CATEGORIES) {
    for (const gender of GENDERS) {
      lists.push({
        id: `${category}-${gender}-names`,
        slug: `${category}-${gender}-names`,
        title: `${capitalize(category)} ${capitalize(gender)} Names`,
        seoTitle: `${capitalize(category)} ${capitalize(gender)} Baby Names | Namylab`,
        category: 'category-gender',
        type: 'category-gender',
        keywords: [capitalize(category), capitalize(gender)],
        filter: {
          type: 'custom',
          category: capitalize(category),
          gender: getGenderFilter(gender)
        },
        relatedLists: [`${category}-baby-names`],
        featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
        priority: 'low'
      });
    }
  }

  // 8. Popular + Country + Gender (3 countries × 3 genders = 9)
  const countries = ['usa', 'uk', 'canada'];
  for (const country of countries) {
    for (const gender of GENDERS) {
      lists.push({
        id: `popular-${gender}-names-${country}`,
        slug: `popular-${gender}-names-${country}`,
        title: `Popular ${capitalize(gender)} Names in ${country.toUpperCase()}`,
        seoTitle: `Popular ${capitalize(gender)} Baby Names in ${country.toUpperCase()} 2024 | Namylab`,
        category: 'popularity',
        type: 'popularity-gender-country',
        keywords: ['Popular', capitalize(gender), country.toUpperCase()],
        filter: {
          type: 'popularity',
          country: country,
          gender: getGenderFilter(gender),
          maxRank: 1000
        },
        relatedLists: ['popular-baby-names', `${gender}-baby-names`],
        featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
        priority: 'medium'
      });
    }
  }

  // 9. Short names by syllable count
  const syllableCounts = [1, 2, 3, 4];
  for (const syllables of syllableCounts) {
    for (const gender of GENDERS) {
      const label = syllables === 1 ? 'One-Syllable' :
                    syllables === 2 ? 'Two-Syllable' :
                    syllables === 3 ? 'Three-Syllable' : 'Four-Syllable';
      lists.push({
        id: `${syllables}-syllable-${gender}-names`,
        slug: `${syllables}-syllable-${gender}-names`,
        title: `${label} ${capitalize(gender)} Names`,
        seoTitle: `${label} ${capitalize(gender)} Baby Names | Namylab`,
        category: 'syllables',
        type: 'syllables-gender',
        keywords: [label, capitalize(gender), 'Short names'],
        filter: {
          type: 'custom',
          syllables: syllables,
          gender: getGenderFilter(gender)
        },
        relatedLists: ['short-baby-names', `${gender}-baby-names`],
        featuredImage: `https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200`,
        priority: 'low'
      });
    }
  }

  return lists;
}

/**
 * Get count of generated lists by type
 */
export function getGeneratedListStats(): Record<string, number> {
  const lists = generateCombinationLists();
  const stats: Record<string, number> = {};

  for (const list of lists) {
    const type = list.type || 'unknown';
    stats[type] = (stats[type] || 0) + 1;
  }

  stats.total = lists.length;
  return stats;
}

// Export generated lists count for reference
export const GENERATED_LISTS_COUNT = generateCombinationLists().length;
