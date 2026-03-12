import type { Metadata } from 'next';
import SurnameClient from './SurnameClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { TOOLS_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';

const title = 'Surname Flow Checker';
const description = 'Check how well a first name flows with your surname. Analyze phonetic harmony, rhythm, and avoid awkward combinations.';

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/tools/surname-checker',
  twitterCard: 'summary',
});

export default function SurnameCheckerPage() {
  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/tools/surname-checker',
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
      <SurnameClient />
    </>
  );
}