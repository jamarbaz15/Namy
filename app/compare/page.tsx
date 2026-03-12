import type { Metadata } from 'next';
import CompareClient from './CompareClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { SITE_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';

const title = 'Compare Baby Names';
const description = 'Compare baby names side by side. See meanings, origins, popularity, and more to help you choose the perfect name.';

const baseMetadata = buildPageMetadata({
  title,
  description,
  path: '/compare',
  twitterCard: 'summary',
});

export const metadata: Metadata = {
  ...baseMetadata,
  robots: {
    index: false,
    follow: true,
  },
};

export default function ComparePage() {
  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/compare',
          title,
          description,
          imageUrl: toSchemaImage(SITE_SHARE_ASSET),
        })}
      />
      <CompareClient />
    </>
  );
}
