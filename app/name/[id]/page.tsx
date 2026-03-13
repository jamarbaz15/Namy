import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAuthorForName, getNameByPathSegment, NAMES_DB } from '@/data';
import { getListsForName } from '@/lib/lists';
import { getSimilarNames } from '@/lib/utils';
import NameDetailsClient from './NameDetailsClient';
import StructuredData from '@/components/StructuredData';
import { createNamePageGraph } from '@/lib/schema';
import { NAMES_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';
import { getNameContentDates } from '@/lib/contentDates';
import { getUsaPopularityDescription } from '@/lib/namePopularity';
import { getNamePopularityHistory } from '@/lib/namePopularityHistory';
import { getNamePath } from '@/lib/nameRoutes';
import type { ListDefinition } from '@/types';

function getNamePageDescription(nameData: (typeof NAMES_DB)[number]) {
  return `${nameData.name} means "${nameData.meaning}". Discover origin, popularity, nicknames, and similar names. ${nameData.origins.join(', ')} origin, ${getUsaPopularityDescription(nameData)}.`;
}

function toTitleCase(value: string) {
  return value
    .split(/[-\s]+/g)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function toGenderLabel(gender: ListDefinition['filter']['gender']) {
  switch (gender) {
    case 'male':
      return 'Boy names';
    case 'female':
      return 'Girl names';
    case 'unisex':
      return 'Unisex names';
    default:
      return null;
  }
}

function buildListContext(list: ListDefinition) {
  const parts: string[] = [];
  const { filter } = list;

  if (filter.origin) {
    parts.push(`${toTitleCase(filter.origin)} origin`);
  }

  const genderLabel = toGenderLabel(filter.gender);
  if (genderLabel) {
    parts.push(genderLabel);
  }

  if (filter.startsWith) {
    parts.push(`Starts with ${filter.startsWith.toUpperCase()}`);
  }

  if (filter.category) {
    parts.push(`${toTitleCase(filter.category)} theme`);
  }

  const primaryMeaning = filter.meaningKeywords?.[0] || filter.matchAny?.[0];
  if (primaryMeaning && (filter.type === 'meaning' || list.category.includes('meaning') || filter.meaningKeywords)) {
    parts.push(`Meaning: ${toTitleCase(primaryMeaning)}`);
  }

  if (filter.syllables) {
    parts.push(`${filter.syllables} syllables`);
  }

  if (filter.maxRank) {
    parts.push(`Top ${filter.maxRank.toLocaleString()}`);
  }

  if (parts.length === 0) {
    parts.push(toTitleCase(list.category));
  }

  return parts.slice(0, 3).join(' | ');
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const nameData = getNameByPathSegment(params.id);

  if (!nameData) {
    return { title: 'Name Not Found' };
  }

  const genderLabel = nameData.gender === 'male' ? 'Boy' : nameData.gender === 'female' ? 'Girl' : 'Unisex';
  const title = `${nameData.name} - ${genderLabel} Name Meaning & Origin`;
  const description = getNamePageDescription(nameData);

  return buildPageMetadata({
    title,
    description,
    path: getNamePath(nameData),
    openGraphTitle: `${nameData.name} - Baby Name Meaning`,
    openGraphDescription: `${nameData.name}: ${nameData.meaning}`,
    twitterCard: 'summary',
  });
}

export function generateStaticParams() {
  // Pre-build the top 10,000 names by popularity (~22% of total) to keep deployment size manageable.
  // Since we're only pre-generating ~1,341 list pages (instead of 19k+), we have room for many more name pages.
  // All other name pages are rendered on demand (dynamicParams defaults to true).
  return NAMES_DB
    .filter((name) => typeof name.popularity?.usa === 'number')
    .sort((a, b) => a.popularity.usa - b.popularity.usa)
    .slice(0, 10000)
    .map((name) => ({ id: name.slug }));
}

export default function NameDetailsPage({ params }: { params: { id: string } }) {
  const nameData = getNameByPathSegment(params.id);
  if (!nameData) {
    notFound();
  }

  if (params.id !== nameData.slug) {
    redirect(getNamePath(nameData));
  }

  const description = getNamePageDescription(nameData);
  const author = getAuthorForName(nameData);
  const dates = getNameContentDates(nameData);
  const popularityHistory = getNamePopularityHistory(nameData.id);
  const similarNames = getSimilarNames(nameData, NAMES_DB);
  const featuredInLists = getListsForName(nameData).map((list) => ({
    slug: list.slug,
    title: list.title,
    context: buildListContext(list),
  }));

  return (
    <>
      <StructuredData
        data={createNamePageGraph(
          nameData,
          description,
          dates,
          toSchemaImage(NAMES_SHARE_ASSET, {
            caption: `${nameData.name} baby name meaning and origin`,
            description: `Meaning, origin, popularity, and related name ideas for ${nameData.name}.`,
          }),
          author
        )}
      />
      <NameDetailsClient
        nameData={nameData}
        popularityHistory={popularityHistory}
        featuredInLists={featuredInLists}
        similarNames={similarNames}
      />
    </>
  );
}