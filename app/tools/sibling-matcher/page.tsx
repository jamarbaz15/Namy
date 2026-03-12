import type { Metadata } from 'next';
import SiblingClient from './SiblingClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { TOOLS_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';

const title = 'Sibling Name Matcher';
const description = 'Find baby names that match your existing children\'s names. Get suggestions based on style, origin, and sound harmony.';

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/tools/sibling-matcher',
  twitterCard: 'summary',
});

export default function SiblingMatcherPage() {
  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/tools/sibling-matcher',
          title,
          description,
          breadcrumbItems: [
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: title },
          ],
          imageUrl: toSchemaImage(TOOLS_SHARE_ASSET),
        })}
      />
      <SiblingClient />
    </>
  );
}