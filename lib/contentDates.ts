import 'server-only';

import type { Author } from '@/data/authors';
import {
  AUTHORS_HUB_DATES,
  HOME_PAGE_DATES,
  LISTS_HUB_DATES,
  PRIVACY_PAGE_DATES,
  SEARCH_PAGE_DATES,
  TERMS_PAGE_DATES,
  TOOLS_HUB_DATES,
} from '@/data/content-metadata';
import type { ListDefinition, Name } from '@/types';

export interface ContentDates {
  datePublished?: string;
  dateModified?: string;
}

function toContentDates(value?: { publishedAt?: string; updatedAt?: string }): ContentDates {
  if (!value) {
    return {};
  }

  return {
    ...(value.publishedAt ? { datePublished: value.publishedAt } : {}),
    ...(value.updatedAt ? { dateModified: value.updatedAt } : {}),
  };
}

export function getListContentDates(list: ListDefinition): ContentDates {
  return toContentDates(list);
}

export function getHomePageContentDates(): ContentDates {
  return toContentDates(HOME_PAGE_DATES);
}

export function getSearchPageContentDates(): ContentDates {
  return toContentDates(SEARCH_PAGE_DATES);
}

export function getListsHubContentDates(): ContentDates {
  return toContentDates(LISTS_HUB_DATES);
}

export function getAuthorsHubContentDates(): ContentDates {
  return toContentDates(AUTHORS_HUB_DATES);
}

export function getAuthorContentDates(author: Author): ContentDates {
  return toContentDates(author);
}

export function getToolsHubContentDates(): ContentDates {
  return toContentDates(TOOLS_HUB_DATES);
}

export function getNameContentDates(name: Name): ContentDates {
  return toContentDates(name);
}

export function getPrivacyPageContentDates(): ContentDates {
  return toContentDates(PRIVACY_PAGE_DATES);
}

export function getTermsPageContentDates(): ContentDates {
  return toContentDates(TERMS_PAGE_DATES);
}
