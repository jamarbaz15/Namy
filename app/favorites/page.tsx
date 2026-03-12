import type { Metadata } from 'next';
import FavoritesClient from './FavoritesClient';
import StructuredData from '@/components/StructuredData';
import { createSimpleWebPageGraph } from '@/lib/schema';
import { SITE_SHARE_ASSET, buildPageMetadata, toSchemaImage } from '@/lib/seo';

const title = 'Your Favorite Names';
const description = 'View and manage your saved favorite baby names. Compare, share, and organize your top name picks.';

const baseMetadata = buildPageMetadata({
  title,
  description,
  path: '/favorites',
  twitterCard: 'summary',
});

export const metadata: Metadata = {
  ...baseMetadata,
  robots: {
    index: false,
    follow: true,
  },
};

export default function FavoritesPage() {
  return (
    <>
      <StructuredData
        data={createSimpleWebPageGraph({
          path: '/favorites',
          title,
          description,
          imageUrl: toSchemaImage(SITE_SHARE_ASSET),
        })}
      />
      <FavoritesClient />
    </>
  );
}
