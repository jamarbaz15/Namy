import type { Metadata } from 'next';
import NicknameClient from './NicknameClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { TOOLS_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';

const title = 'Nickname Predictor';
const description = 'Discover potential nicknames for any baby name. See common shortenings, diminutives, and playful variations.';

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/tools/nickname-predictor',
  twitterCard: 'summary',
});

export default function NicknameToolPage() {
  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/tools/nickname-predictor',
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
      <NicknameClient />
    </>
  );
}