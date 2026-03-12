export interface ContentDateFields {
  publishedAt: string;
  updatedAt: string;
}

export const HOME_PAGE_DATES: ContentDateFields = {
  publishedAt: '2025-01-14T09:00:00.000Z',
  updatedAt: '2025-11-14T15:30:00.000Z',
};

export const SEARCH_PAGE_DATES: ContentDateFields = {
  publishedAt: '2025-02-04T09:00:00.000Z',
  updatedAt: '2025-10-21T14:10:00.000Z',
};

export const CORE_LIST_DATES: ContentDateFields = {
  publishedAt: '2025-02-18T10:00:00.000Z',
  updatedAt: '2025-10-08T16:20:00.000Z',
};

export const GENERATED_MEANING_SEED_LIST_DATES: ContentDateFields = {
  publishedAt: '2025-04-09T11:15:00.000Z',
  updatedAt: '2025-10-29T13:40:00.000Z',
};

export const GENERATED_COMBINATION_LIST_DATES: ContentDateFields = {
  publishedAt: '2025-05-22T12:00:00.000Z',
  updatedAt: '2025-12-05T17:05:00.000Z',
};

export const LIST_SOURCE_DATE_METADATA: Record<string, ContentDateFields> = {
  'data/lists/core/meanings.json': CORE_LIST_DATES,
  'data/lists/core/meaning-pillars.json': CORE_LIST_DATES,
  'data/lists/core/origins.json': CORE_LIST_DATES,
  'data/lists/core/categories.json': CORE_LIST_DATES,
  'data/lists/core/letters.json': CORE_LIST_DATES,
  'data/lists/generated/meaning-seeds.json': GENERATED_MEANING_SEED_LIST_DATES,
  'data/lists/generated/combination-lists.json': GENERATED_COMBINATION_LIST_DATES,
};

export const AUTO_LETTER_LIST_DATES: ContentDateFields = CORE_LIST_DATES;

export const DEFAULT_NAME_DATES: ContentDateFields = {
  publishedAt: '2025-01-20T08:45:00.000Z',
  updatedAt: '2025-09-26T12:30:00.000Z',
};

export const LISTS_HUB_DATES: ContentDateFields = {
  publishedAt: '2025-03-06T10:20:00.000Z',
  updatedAt: '2025-11-19T16:10:00.000Z',
};

export const TOOLS_HUB_DATES: ContentDateFields = {
  publishedAt: '2025-03-27T09:50:00.000Z',
  updatedAt: '2025-10-07T14:55:00.000Z',
};

export const AUTHORS_HUB_DATES: ContentDateFields = {
  publishedAt: '2025-02-12T08:30:00.000Z',
  updatedAt: '2025-08-28T13:25:00.000Z',
};

export const AUTHOR_PROFILE_DATES: ContentDateFields = {
  publishedAt: '2025-02-12T08:30:00.000Z',
  updatedAt: '2025-09-11T15:05:00.000Z',
};

export const PRIVACY_PAGE_DATES: ContentDateFields = {
  publishedAt: '2025-06-17T09:00:00.000Z',
  updatedAt: '2025-11-03T11:35:00.000Z',
};

export const TERMS_PAGE_DATES: ContentDateFields = {
  publishedAt: '2025-06-17T09:00:00.000Z',
  updatedAt: '2025-11-03T11:35:00.000Z',
};

export const STATIC_PAGE_DATE_METADATA: Record<string, ContentDateFields> = {
  '/': HOME_PAGE_DATES,
  '/search': SEARCH_PAGE_DATES,
  '/lists': LISTS_HUB_DATES,
  '/tools': TOOLS_HUB_DATES,
  '/tools/full-name-preview': TOOLS_HUB_DATES,
  '/tools/surname-checker': TOOLS_HUB_DATES,
  '/tools/sibling-matcher': TOOLS_HUB_DATES,
  '/tools/nickname-predictor': TOOLS_HUB_DATES,
  '/authors': AUTHORS_HUB_DATES,
  '/privacy': PRIVACY_PAGE_DATES,
  '/terms': TERMS_PAGE_DATES,
};
