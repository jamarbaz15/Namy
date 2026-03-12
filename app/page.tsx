import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { HOME_PAGE_TITLE, SITE_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';
import { getHomePageContentDates } from '@/lib/contentDates';

const title = HOME_PAGE_TITLE;
const description =
  'Discover the perfect baby name from thousands of curated options. Search by meaning, origin, popularity. Free tools for full name preview, surname compatibility, and sibling matching.';

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/',
  twitterCard: 'summary',
});

export default function HomePage() {
  const dates = getHomePageContentDates();

  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/',
          title,
          description,
          imageUrl: toSchemaImage(SITE_SHARE_ASSET),
          ...dates,
        })}
      />
      <HomeClient />
    </>
  );
}
