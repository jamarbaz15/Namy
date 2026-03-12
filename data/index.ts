// Re-export all data
export { CONTENT_TEMPLATES } from './content';
export { CATEGORIES } from './categories';
export type { Category } from './categories';

// Re-export names from letter-based JSON system
export {
  NAMES_DB,
  getAllNames,
  getNamesByLetter,
  getNameById,
  getNameBySlug,
  getNameByPathSegment,
  getNamesByGender,
  getNamesByOrigin,
  getNamesByCategory,
  getNamesByMeaning,
  searchNames,
  getRandomNames,
  getPopularNames,
  filterNamesByListFilter,
  getNamesStats
} from './names';

// Re-export hybrid list system from lib/lists.ts
// This provides both core (500) and generated (19,500+) lists
export {
  getAllLists,
  getListBySlug,
  getAllListSlugs,
  getListsByCategory,
  getListsByType,
  getListContent,
  getListStats,
  searchLists,
  getRelatedLists,
  getCoreLists,
  LIST_DEFINITIONS
} from '@/lib/lists';

// Re-export generators for direct access if needed
export {
  generateCombinationLists,
  ORIGINS,
  GENDERS,
  MEANINGS,
  LETTERS,
  CATEGORIES as LIST_CATEGORIES,
  GENERATED_LISTS_COUNT
} from './lists/generators';

// Re-export authors
export {
  AUTHORS,
  AUTHOR_ASSIGNMENTS,
  getAuthorById,
  getAuthorBySlug,
  getAllAuthors,
  getAuthorForList,
  getAuthorForName
} from './authors';
export type { Author } from './authors';

// Re-export types that are commonly used with data
export type { Name, ListDefinition, IntroTemplate } from '@/types';