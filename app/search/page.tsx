import type { Metadata } from 'next';
import SearchClient from './SearchClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { SITE_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';
import { getSearchPageContentDates } from '@/lib/contentDates';

const title = 'Search Baby Names';
const description = 'Search thousands of baby names by meaning, origin, popularity, and more. Filter by gender, first letter, syllables, and find the perfect name for your baby.';

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/search',
  twitterCard: 'summary',
});

export default function SearchPage() {
  const dates = getSearchPageContentDates();

  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/search',
          title,
          description,
          breadcrumbItems: [
            { name: 'Home', path: '/' },
            { name: title },
          ],
          imageUrl: toSchemaImage(SITE_SHARE_ASSET),
          ...dates,
        })}
      />
      <SearchClient />
    </>
  );
}