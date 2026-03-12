import type { Metadata } from 'next';

export const SITE_NAME = 'NamyLab';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://namylab.com').replace(/\/+$/, '');
export const SITE_LANGUAGE = 'en-US';
export const SITE_LOCALE = 'en_US';
export const HOME_PAGE_TITLE = `${SITE_NAME} - Baby Name Generator 2026 | Find Perfect Names`;
export const SITE_DESCRIPTION =
  'Discover the perfect baby name from 100,000+ names. Search by meaning, origin, popularity, and smart tools.';
export const SITE_SAME_AS = [
  process.env.NEXT_PUBLIC_SITE_FACEBOOK_URL,
  process.env.NEXT_PUBLIC_SITE_INSTAGRAM_URL,
  process.env.NEXT_PUBLIC_SITE_PINTEREST_URL,
  process.env.NEXT_PUBLIC_SITE_TIKTOK_URL,
  process.env.NEXT_PUBLIC_SITE_YOUTUBE_URL,
  process.env.NEXT_PUBLIC_SITE_LINKEDIN_URL,
].filter((value): value is string => Boolean(value));

export interface SchemaImageAsset {
  path: string;
  width: number;
  height: number;
  caption: string;
  description?: string;
}

export const SITE_LOGO_ASSET: SchemaImageAsset = {
  path: '/images/schema/namylab-logo.png',
  width: 512,
  height: 512,
  caption: 'NamyLab logo',
  description: 'NamyLab brand mark.',
};

export const SITE_SHARE_ASSET: SchemaImageAsset = {
  path: '/images/schema/site-share.png',
  width: 1200,
  height: 630,
  caption: 'NamyLab baby name search and discovery',
  description: 'NamyLab helps parents explore baby names, meanings, origins, and tools.',
};

export const LISTS_SHARE_ASSET: SchemaImageAsset = {
  path: '/images/schema/lists-share.png',
  width: 1200,
  height: 630,
  caption: 'Baby name lists and collections',
  description: 'Curated baby name lists by meaning, origin, letter, and style.',
};

export const TOOLS_SHARE_ASSET: SchemaImageAsset = {
  path: '/images/schema/tools-share.png',
  width: 1200,
  height: 630,
  caption: 'Baby name tools from NamyLab',
  description: 'NamyLab tools for full-name preview, sibling matching, surname flow, and nickname ideas.',
};

export const AUTHORS_SHARE_ASSET: SchemaImageAsset = {
  path: '/images/schema/authors-share.png',
  width: 1200,
  height: 630,
  caption: 'NamyLab editorial team',
  description: 'The NamyLab team of baby name writers, editors, and researchers.',
};

export const NAMES_SHARE_ASSET: SchemaImageAsset = {
  path: '/images/schema/names-share.png',
  width: 1200,
  height: 630,
  caption: 'Baby name meanings and origins',
  description: 'Baby name meanings, origins, popularity, and related ideas on NamyLab.',
};

type OpenGraphType = 'website' | 'article' | 'profile';
type TwitterCard = 'summary' | 'summary_large_image';

interface BuildPageMetadataInput {
  title: string;
  description: string;
  path: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphType?: OpenGraphType;
  openGraphImage?: SchemaImageAsset;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterCard?: TwitterCard;
  twitterImage?: SchemaImageAsset;
}

export function absoluteUrl(path = ''): string {
  if (!path) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function toSchemaImage(asset: SchemaImageAsset, overrides?: Partial<Pick<SchemaImageAsset, 'caption' | 'description'>>) {
  return {
    url: absoluteUrl(asset.path),
    width: asset.width,
    height: asset.height,
    caption: overrides?.caption || asset.caption,
    description: overrides?.description || asset.description,
  };
}

function usesSiteBranding(title: string): boolean {
  const normalizedTitle = title.trim();

  return normalizedTitle === SITE_NAME
    || normalizedTitle.startsWith(`${SITE_NAME} `)
    || normalizedTitle.endsWith(` | ${SITE_NAME}`)
    || normalizedTitle.endsWith(` - ${SITE_NAME}`);
}

export function buildPageMetadata({
  title,
  description,
  path,
  openGraphTitle,
  openGraphDescription,
  openGraphType = 'website',
  openGraphImage,
  twitterTitle,
  twitterDescription,
  twitterCard = 'summary_large_image',
  twitterImage,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = openGraphImage ? toSchemaImage(openGraphImage) : toSchemaImage(SITE_SHARE_ASSET);
  const twImage = twitterImage ? toSchemaImage(twitterImage) : ogImage;

  return {
    title: usesSiteBranding(title) ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: openGraphTitle || title,
      description: openGraphDescription || description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: openGraphType,
      images: [{
        url: ogImage.url,
        width: ogImage.width,
        height: ogImage.height,
        alt: ogImage.caption || title,
      }],
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle || openGraphTitle || title,
      description: twitterDescription || openGraphDescription || description,
      images: [{
        url: twImage.url,
        width: twImage.width,
        height: twImage.height,
        alt: twImage.caption || title,
      }],
    },
  };
}