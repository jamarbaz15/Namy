import type { Metadata } from 'next';
import ListsClient from './ListsClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleCollectionPageGraph } from '@/lib/schema';
import { LISTS_SHARE_ASSET, buildPageMetadata, absoluteUrl, toSchemaImage } from '@/lib/seo';
import { LIST_DEFINITIONS } from '@/data';
import { getListsHubContentDates } from '@/lib/contentDates';

const title = 'Baby Name Lists & Collections';
const description = 'Browse curated baby name lists by origin, meaning, category, and more. Find Greek names, nature names, biblical names, and unique collections.';
const MAX_SCHEMA_ITEMS = 20;

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/lists',
  twitterCard: 'summary',
});

export default function ListsPage() {
  const categories = {
    origin: LIST_DEFINITIONS.filter((list) => list.category === 'origin'),
    meaning: LIST_DEFINITIONS.filter((list) => list.category === 'meaning'),
    category: LIST_DEFINITIONS.filter((list) => list.category === 'category'),
    letter: LIST_DEFINITIONS.filter((list) => list.category === 'letter'),
  };

  const orderedLists = [
    ...categories.origin,
    ...categories.meaning,
    ...categories.category,
    ...categories.letter,
  ];

  const itemListItems = orderedLists.slice(0, MAX_SCHEMA_ITEMS).map((list) => ({
    name: list.title,
    url: absoluteUrl(`/list/${list.slug}`),
  }));

  const dates = getListsHubContentDates();

  return (
    <>
      <StructuredData
        data={createSimpleCollectionPageGraph({
          path: '/lists',
          title,
          description,
          breadcrumbItems: [
            { name: 'Home', path: '/' },
            { name: 'Lists' },
          ],
          imageUrl: toSchemaImage(LISTS_SHARE_ASSET),
          itemListItems,
          totalItems: orderedLists.length,
          ...dates,
        })}
      />
      <ListsClient />
    </>
  );
}

