import type { Metadata } from 'next';
import FullNameClient from './FullNameClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { TOOLS_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';

const title = 'Full Name Preview Tool';
const description = 'Preview how your baby\'s full name will look and sound. Check initials, analyze name flow, and get middle name suggestions.';

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/tools/full-name-preview',
  twitterCard: 'summary',
});

export default function FullNamePreviewPage() {
  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/tools/full-name-preview',
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
      <FullNameClient />
    </>
  );
}