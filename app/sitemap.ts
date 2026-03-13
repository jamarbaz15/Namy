import { MetadataRoute } from 'next';
import { getNameById, getListBySlug, NAMES_DB } from '@/data';
import { STATIC_PAGE_DATE_METADATA } from '@/data/content-metadata';
import { getNamePath } from '@/lib/nameRoutes';
import { filterNamesByList } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://namylab.com';

type NameSitemapRecord = {
  id: string;
  publishedAt?: string;
  updatedAt?: string;
};

// Define sitemap IDs for chunking
export async function generateSitemaps() {
  // 26 sitemaps for names (A-Z)
  const nameSitemaps = Array.from({ length: 26 }, (_, i) => ({
    id: `names-${String.fromCharCode(97 + i)}`,
  }));

  return [
    { id: 'static' },
    { id: 'lists' },
    { id: 'authors' },
    ...nameSitemaps,
  ];
}

// Map of letter to JSON file import
const letterFiles: Record<string, () => Promise<{ default: NameSitemapRecord[] }>> = {
  a: () => import('@/data/names/a.json'),
  b: () => import('@/data/names/b.json'),
  c: () => import('@/data/names/c.json'),
  d: () => import('@/data/names/d.json'),
  e: () => import('@/data/names/e.json'),
  f: () => import('@/data/names/f.json'),
  g: () => import('@/data/names/g.json'),
  h: () => import('@/data/names/h.json'),
  i: () => import('@/data/names/i.json'),
  j: () => import('@/data/names/j.json'),
  k: () => import('@/data/names/k.json'),
  l: () => import('@/data/names/l.json'),
  m: () => import('@/data/names/m.json'),
  n: () => import('@/data/names/n.json'),
  o: () => import('@/data/names/o.json'),
  p: () => import('@/data/names/p.json'),
  q: () => import('@/data/names/q.json'),
  r: () => import('@/data/names/r.json'),
  s: () => import('@/data/names/s.json'),
  t: () => import('@/data/names/t.json'),
  u: () => import('@/data/names/u.json'),
  v: () => import('@/data/names/v.json'),
  w: () => import('@/data/names/w.json'),
  x: () => import('@/data/names/x.json'),
  y: () => import('@/data/names/y.json'),
  z: () => import('@/data/names/z.json'),
};

// List files - each exports { lists: Array<{ slug, publishedAt?, updatedAt? }> }
const listFiles: Array<() => Promise<{ default: { lists: Array<{ slug: string; publishedAt?: string; updatedAt?: string }> } }>> = [
  () => import('@/data/lists/core/origins.json'),
  () => import('@/data/lists/core/meanings.json'),
  () => import('@/data/lists/core/categories.json'),
  () => import('@/data/lists/core/letters.json'),
  () => import('@/data/lists/generated/combination-lists.json'),
  () => import('@/data/lists/generated/meaning-seeds.json'),
];

// Authors data
const AUTHORS = [
  { slug: 'grace-royal', publishedAt: '2019-01-15', updatedAt: '2024-01-15' },
  { slug: 'sophia-chen', publishedAt: '2020-03-10', updatedAt: '2024-01-15' },
  { slug: 'marcus-johnson', publishedAt: '2020-06-20', updatedAt: '2024-01-15' },
  { slug: 'priya-patel', publishedAt: '2021-01-10', updatedAt: '2024-01-15' },
  { slug: 'james-williams', publishedAt: '2021-08-05', updatedAt: '2024-01-15' },
  { slug: 'elena-rodriguez', publishedAt: '2022-02-14', updatedAt: '2024-01-15' },
];

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  if (id === 'static') {
    return [
      {
        url: BASE_URL,
        lastModified: STATIC_PAGE_DATE_METADATA['/'].updatedAt,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/search`,
        lastModified: STATIC_PAGE_DATE_METADATA['/search'].updatedAt,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/lists`,
        lastModified: STATIC_PAGE_DATE_METADATA['/lists'].updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/tools`,
        lastModified: STATIC_PAGE_DATE_METADATA['/tools'].updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/tools/full-name-preview`,
        lastModified: STATIC_PAGE_DATE_METADATA['/tools/full-name-preview'].updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/tools/surname-checker`,
        lastModified: STATIC_PAGE_DATE_METADATA['/tools/surname-checker'].updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/tools/sibling-matcher`,
        lastModified: STATIC_PAGE_DATE_METADATA['/tools/sibling-matcher'].updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/tools/nickname-predictor`,
        lastModified: STATIC_PAGE_DATE_METADATA['/tools/nickname-predictor'].updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/authors`,
        lastModified: STATIC_PAGE_DATE_METADATA['/authors'].updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/privacy`,
        lastModified: STATIC_PAGE_DATE_METADATA['/privacy'].updatedAt,
        changeFrequency: 'yearly',
        priority: 0.2,
      },
      {
        url: `${BASE_URL}/terms`,
        lastModified: STATIC_PAGE_DATE_METADATA['/terms'].updatedAt,
        changeFrequency: 'yearly',
        priority: 0.2,
      },
    ];
  }

  if (id === 'lists') {
    const allLists: MetadataRoute.Sitemap = [];

    for (const importFn of listFiles) {
      try {
        const module = await importFn();
        const lists = module.default?.lists || [];
        const listEntries = lists
          .filter((list: { slug: string; publishedAt?: string; updatedAt?: string }) => {
            // Only include lists with 20+ names in sitemap
            const listDef = getListBySlug(list.slug);
            if (!listDef) return false;
            const names = filterNamesByList(listDef, NAMES_DB);
            return names.length >= 20;
          })
          .map((list: { slug: string; publishedAt?: string; updatedAt?: string }) => ({
            url: `${BASE_URL}/list/${list.slug}`,
            lastModified: list.updatedAt || list.publishedAt || STATIC_PAGE_DATE_METADATA['/lists'].updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          }));
        allLists.push(...listEntries);
      } catch (error) {
        console.error('Failed to load list file:', error);
      }
    }

    return allLists;
  }

  if (id === 'authors') {
    return AUTHORS.map((author) => ({
      url: `${BASE_URL}/author/${author.slug}`,
      lastModified: author.updatedAt || author.publishedAt || STATIC_PAGE_DATE_METADATA['/authors'].updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  }

  if (id.startsWith('names-')) {
    const letter = id.replace('names-', '');
    const importFn = letterFiles[letter];

    if (!importFn) {
      return [];
    }

    try {
      const module = await importFn();
      const names: Array<{
        canonicalName: NonNullable<ReturnType<typeof getNameById>>;
        publishedAt?: string;
        updatedAt?: string;
      }> = [];

      for (const name of module.default || []) {
        const canonicalName = getNameById(name.id);
        if (!canonicalName) {
          continue;
        }

        names.push({
          canonicalName,
          publishedAt: name.publishedAt,
          updatedAt: name.updatedAt,
        });
      }

      return names.map(({ canonicalName, publishedAt, updatedAt }) => ({
        url: `${BASE_URL}${getNamePath(canonicalName)}`,
        lastModified: updatedAt || publishedAt || STATIC_PAGE_DATE_METADATA['/search'].updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    } catch (error) {
      console.error(`Failed to load names for letter ${letter}:`, error);
      return [];
    }
  }

  return [];
}