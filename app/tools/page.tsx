import type { Metadata } from 'next';
import ToolsClient from './ToolsClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleCollectionPageGraph } from '@/lib/schema';
import { TOOLS_SHARE_ASSET, buildPageMetadata, absoluteUrl, toSchemaImage } from '@/lib/seo';
import { getToolsHubContentDates } from '@/lib/contentDates';

const title = 'Baby Name Tools';
const description = 'Free baby name tools: Full Name Preview, Surname Flow Checker, Sibling Name Matcher, and Nickname Predictor. Find the perfect name combination.';

const toolItems = [
  { name: 'Full Name Preview Tool', url: absoluteUrl('/tools/full-name-preview') },
  { name: 'Surname Flow Checker', url: absoluteUrl('/tools/surname-checker') },
  { name: 'Sibling Name Matcher', url: absoluteUrl('/tools/sibling-matcher') },
  { name: 'Nickname Predictor', url: absoluteUrl('/tools/nickname-predictor') },
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/tools',
  twitterCard: 'summary',
});

export default function ToolsPage() {
  const dates = getToolsHubContentDates();

  return (
    <>
      <StructuredData
        data={createSimpleCollectionPageGraph({
          path: '/tools',
          title,
          description,
          breadcrumbItems: [
            { name: 'Home', path: '/' },
            { name: 'Tools' },
          ],
          imageUrl: toSchemaImage(TOOLS_SHARE_ASSET),
          itemListItems: toolItems,
          totalItems: toolItems.length,
          ...dates,
        })}
      />
      <ToolsClient />
    </>
  );
}

