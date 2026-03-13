import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CONTENT_TEMPLATES, getListBySlug, NAMES_DB } from '@/data';
import { getAllListSlugs } from '@/lib/lists';
import { getAuthorForList } from '@/data/authors';
import StructuredData from '@/components/StructuredData';
import ListPageClient from './ListPageClient';
import { createListPageGraph } from '@/lib/schema';
import { absoluteUrl, buildPageMetadata, SITE_NAME } from '@/lib/seo';
import { getListContentDates } from '@/lib/contentDates';
import { getNamePath } from '@/lib/nameRoutes';
import { filterNamesByList, generateListContent, stripGenderSuffix } from '@/lib/utils';
import type { Name } from '@/types';

const MAX_SCHEMA_ITEMS = 20;
const COUNT_TOKEN_PATTERN = /\b[\d,]+\+/;
const SITE_BRANDING_SUFFIX = new RegExp(`\\s+[|\\-]\\s+${escapeRegExp(SITE_NAME)}\\s*$`, 'i');

type ListPageNameData = Pick<Name, 'id' | 'name' | 'slug' | 'gender' | 'origins' | 'meaning' | 'description'>;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeListTitleLabel(value: string | undefined | null) {
  if (!value) return '';
  return value.replace(SITE_BRANDING_SUFFIX, '').trim();
}

function formatCountedListTitle(value: string, count: number) {
  const normalizedValue = normalizeListTitleLabel(value);
  return COUNT_TOKEN_PATTERN.test(normalizedValue) ? normalizedValue : `${count}+ ${normalizedValue}`;
}

function toSectionLabel(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toListPageName(name: Name): ListPageNameData {
  return {
    id: name.id,
    name: name.name,
    slug: name.slug,
    gender: name.gender,
    origins: name.origins,
    meaning: name.meaning,
    description: name.description,
  };
}

function getListPageDescription(slug: string) {
  const list = getListBySlug(slug);
  if (!list) {
    return null;
  }

  const nameCount = filterNamesByList(list, NAMES_DB).length;
  const listTitle = (list.title || list.slug.replace(/-/g, ' ')).toLowerCase();
  return list.seoDescription || `Browse ${nameCount}+ ${listTitle}. Find the perfect baby name with meanings, origins, popularity rankings, and more.`;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const list = getListBySlug(params.slug);

  if (!list) {
    return { title: 'List Not Found' };
  }

  const nameCount = filterNamesByList(list, NAMES_DB).length;
  const title = formatCountedListTitle(list.title, nameCount);
  const description = getListPageDescription(params.slug) ?? `Browse ${nameCount}+ ${list.title.toLowerCase()}. Find the perfect baby name with meanings, origins, and popularity rankings.`;

  return buildPageMetadata({
    title,
    description,
    path: `/list/${params.slug}`,
    openGraphTitle: formatCountedListTitle(list.seoTitle || list.title, nameCount),
    openGraphDescription: `Explore our curated collection of ${list.title.toLowerCase()}.`,
    twitterCard: 'summary',
  });
}

export function generateStaticParams() {
  // Pre-build lists with 20+ names only (~1,200 lists) — manageable size with excellent SEO coverage.
  // Tiny lists with <20 names are rendered on demand (dynamicParams defaults to true).
  return getAllListSlugs()
    .filter((slug) => {
      const list = getListBySlug(slug);
      if (!list) return false;
      const names = filterNamesByList(list, NAMES_DB);
      return names.length >= 20;
    })
    .map((slug) => ({ slug }));
}

export default function ListPage({ params }: { params: { slug: string } }) {
  const list = getListBySlug(params.slug);
  if (!list) {
    notFound();
  }

  const allNames = filterNamesByList(list, NAMES_DB);
  // Only show lists with 20+ names; smaller lists are not valid content
  if (allNames.length < 20) {
    notFound();
  }
  const girlNames = allNames.filter((name) => name.gender === 'female');
  const boyNames = allNames.filter((name) => name.gender === 'male');
  const unisexNames = allNames.filter((name) => name.gender === 'unisex');
  const orderedNames = [...girlNames, ...boyNames, ...unisexNames];
  const itemListItems = orderedNames.slice(0, MAX_SCHEMA_ITEMS).map((name) => ({
    name: name.name,
    url: absoluteUrl(getNamePath(name)),
  }));

  const title = formatCountedListTitle(list.title, allNames.length);
  const description = getListPageDescription(params.slug) as string;
  const author = getAuthorForList(list.category, list.keywords);
  const dates = getListContentDates(list);
  const articleSections = [...new Set(['Baby Name Lists', list.category, list.type].filter(Boolean).map((section) => toSectionLabel(section as string)))];
  const content = generateListContent(list, allNames.length, CONTENT_TEMPLATES);
  const introParagraphs = content.intro.split(/\n\n+/).filter(Boolean);
  const relatedLists = content.relatedLists
    .map((relatedSlug) => {
      const relatedList = getListBySlug(relatedSlug);
      if (!relatedList) return null; // Filter out non-existent lists
      return {
        slug: relatedSlug,
        title: relatedList.title,
      };
    })
    .filter((item): item is { slug: string; title: string } => item !== null);

  return (
    <>
      <StructuredData
        data={createListPageGraph({
          slug: params.slug,
          title,
          description,
          author,
          imageUrl: list.featuredImage,
          itemListItems,
          totalItems: orderedNames.length,
          keywords: list.keywords,
          articleSections,
          ...dates,
        })}
      />
      <ListPageClient
        list={{
          slug: list.slug,
          title: list.title,
          updatedAt: list.updatedAt,
        }}
        author={author}
        displayTitle={stripGenderSuffix(list.title)}
        introParagraphs={introParagraphs}
        girlNames={girlNames.map(toListPageName)}
        boyNames={boyNames.map(toListPageName)}
        unisexNames={unisexNames.map(toListPageName)}
        relatedLists={relatedLists}
      />
    </>
  );
}