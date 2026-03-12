import type { Author } from '@/data/authors';
import type { Name } from '@/types';
import {
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_LOGO_ASSET,
  SITE_NAME,
  SITE_SAME_AS,
  SITE_SHARE_ASSET,
  absoluteUrl,
  toSchemaImage,
} from '@/lib/seo';
import { getNamePath } from '@/lib/nameRoutes';

type SchemaNode = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  path?: string;
  url?: string;
}

export interface ItemListEntry {
  name: string;
  url: string;
}

export interface SchemaImageInput {
  url: string;
  width?: number;
  height?: number;
  caption?: string;
  description?: string;
}

interface PageGraphInput {
  type: 'WebPage' | 'CollectionPage' | 'ProfilePage';
  path: string;
  title: string;
  description: string;
  breadcrumbItems?: BreadcrumbItem[];
  imageUrl?: string | SchemaImageInput;
  author?: Author;
  datePublished?: string;
  dateModified?: string;
  mainEntityId?: string;
  itemList?: {
    name?: string;
    items: ItemListEntry[];
    numberOfItems?: number;
    idSuffix?: string;
  };
}

function getWebsiteId() {
  return absoluteUrl('/#website');
}

function getOrganizationId() {
  return absoluteUrl('/#organization');
}

function getOrganizationLogoId() {
  return absoluteUrl('/#organization-logo');
}

function getOrganizationImageId() {
  return absoluteUrl('/#organization-image');
}

function getPersonId(author: Author) {
  return absoluteUrl(`/author/${author.slug}#person`);
}

function getPageUrl(path: string) {
  return absoluteUrl(path);
}

function getBreadcrumbId(path: string) {
  return `${getPageUrl(path)}#breadcrumb`;
}

function getPrimaryImageId(path: string) {
  return `${getPageUrl(path)}#primaryimage`;
}

function getArticleId(path: string) {
  return `${getPageUrl(path)}#article`;
}

function getItemListId(path: string, suffix = 'itemlist') {
  return `${getPageUrl(path)}#${suffix}`;
}

function normalizeImageInput(image?: string | SchemaImageInput | null) {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    return { url: image } satisfies SchemaImageInput;
  }

  return image;
}

function toGraph(nodes: Array<SchemaNode | null | undefined>) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node): node is SchemaNode => Boolean(node)),
  };
}

function inferImageEncodingFormat(url: string) {
  if (/\.png(?:$|[?#])/i.test(url)) {
    return 'image/png';
  }

  if (/\.jpe?g(?:$|[?#])/i.test(url)) {
    return 'image/jpeg';
  }

  if (/\.webp(?:$|[?#])/i.test(url)) {
    return 'image/webp';
  }

  return null;
}

function createLinkedImageNode({
  id,
  image,
  caption,
  representativeOfPage = false,
}: {
  id: string;
  image?: string | SchemaImageInput | null;
  caption?: string;
  representativeOfPage?: boolean;
}) {
  const normalizedImage = normalizeImageInput(image);
  if (!normalizedImage) {
    return null;
  }

  const resolvedCaption = normalizedImage.caption || caption;
  const encodingFormat = inferImageEncodingFormat(normalizedImage.url);

  return {
    '@type': 'ImageObject',
    '@id': id,
    inLanguage: SITE_LANGUAGE,
    url: normalizedImage.url,
    contentUrl: normalizedImage.url,
    ...(normalizedImage.width ? { width: normalizedImage.width } : {}),
    ...(normalizedImage.height ? { height: normalizedImage.height } : {}),
    ...(encodingFormat ? { encodingFormat } : {}),
    ...(resolvedCaption ? { caption: resolvedCaption, name: resolvedCaption } : {}),
    ...(normalizedImage.description ? { description: normalizedImage.description } : {}),
    ...(representativeOfPage ? { representativeOfPage: true } : {}),
  };
}

export function createSiteGraph() {
  const logoImage = toSchemaImage(SITE_LOGO_ASSET);
  const brandImage = toSchemaImage(SITE_SHARE_ASSET);

  return toGraph([
    {
      '@type': 'WebSite',
      '@id': getWebsiteId(),
      url: absoluteUrl('/'),
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: {
        '@id': getOrganizationId(),
      },
      inLanguage: SITE_LANGUAGE,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${absoluteUrl('/search')}?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': getOrganizationId(),
      name: SITE_NAME,
      url: absoluteUrl('/'),
      description: SITE_DESCRIPTION,
      logo: {
        '@id': getOrganizationLogoId(),
        url: logoImage.url,
      },
      image: {
        '@id': getOrganizationImageId(),
        url: brandImage.url,
      },
      ...(SITE_SAME_AS.length > 0 ? { sameAs: SITE_SAME_AS } : {}),
    },
    createLinkedImageNode({
      id: getOrganizationLogoId(),
      image: logoImage,
      caption: SITE_LOGO_ASSET.caption,
    }),
    createLinkedImageNode({
      id: getOrganizationImageId(),
      image: brandImage,
      caption: SITE_SHARE_ASSET.caption,
    }),
  ]);
}

export function createBreadcrumbNode(path: string, items: BreadcrumbItem[]) {
  if (items.length === 0) {
    return null;
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': getBreadcrumbId(path),
    itemListElement: items.map((item, index) => {
      const url = item.url || (item.path ? absoluteUrl(item.path) : undefined);

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(url ? { item: url } : {}),
      };
    }),
  };
}

export function createPersonNode(author: Author) {
  const sameAs = [
    author.social?.twitter ? `https://twitter.com/${author.social.twitter}` : null,
    author.social?.linkedin ? `https://linkedin.com/in/${author.social.linkedin}` : null,
    author.social?.instagram ? `https://instagram.com/${author.social.instagram}` : null,
  ].filter((value): value is string => Boolean(value));

  return {
    '@type': 'Person',
    '@id': getPersonId(author),
    name: author.name,
    description: author.shortBio,
    jobTitle: author.title,
    url: absoluteUrl(`/author/${author.slug}`),
    image: absoluteUrl(author.avatar),
    worksFor: {
      '@id': getOrganizationId(),
    },
    ...(author.expertise.length > 0 ? { knowsAbout: author.expertise } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

function createImageNode(path: string, imageUrl?: string | SchemaImageInput, caption?: string) {
  return createLinkedImageNode({
    id: getPrimaryImageId(path),
    image: imageUrl,
    caption,
    representativeOfPage: true,
  });
}

function createItemListNode(path: string, itemList?: PageGraphInput['itemList']) {
  if (!itemList || itemList.items.length === 0) {
    return null;
  }

  return {
    '@type': 'ItemList',
    '@id': getItemListId(path, itemList.idSuffix),
    ...(itemList.name ? { name: itemList.name } : {}),
    ...(typeof itemList.numberOfItems === 'number' ? { numberOfItems: itemList.numberOfItems } : {}),
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: itemList.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        '@id': item.url,
        name: item.name,
        url: item.url,
      },
    })),
  };
}

function buildPageGraphNodes({
  type,
  path,
  title,
  description,
  breadcrumbItems = [],
  imageUrl,
  author,
  datePublished,
  dateModified,
  mainEntityId,
  itemList,
}: PageGraphInput) {
  const pageUrl = getPageUrl(path);
  const breadcrumbNode = createBreadcrumbNode(path, breadcrumbItems);
  const imageNode = createImageNode(path, imageUrl, title);
  const authorNode = author ? createPersonNode(author) : null;
  const itemListNode = createItemListNode(path, itemList);
  const resolvedImage = normalizeImageInput(imageUrl);
  const resolvedMainEntityId = mainEntityId || (itemListNode ? getItemListId(path, itemList?.idSuffix) : undefined);

  const pageNode: SchemaNode = {
    '@type': type,
    '@id': pageUrl,
    url: pageUrl,
    name: title,
    description,
    isPartOf: {
      '@id': getWebsiteId(),
    },
    inLanguage: SITE_LANGUAGE,
  };

  if (breadcrumbNode) {
    pageNode.breadcrumb = {
      '@id': getBreadcrumbId(path),
    };
  }

  if (imageNode && resolvedImage) {
    pageNode.primaryImageOfPage = {
      '@id': getPrimaryImageId(path),
    };
    pageNode.image = {
      '@id': getPrimaryImageId(path),
    };
    pageNode.thumbnailUrl = resolvedImage.url;
  }

  if (author) {
    pageNode.author = {
      '@id': getPersonId(author),
    };
  }

  if (datePublished) {
    pageNode.datePublished = datePublished;
  }

  if (dateModified) {
    pageNode.dateModified = dateModified;
  }

  if (resolvedMainEntityId) {
    pageNode.mainEntity = {
      '@id': resolvedMainEntityId,
    };
  }


  pageNode.potentialAction = [
    {
      '@type': 'ReadAction',
      target: [pageUrl],
    },
  ];
  return {
    path,
    pageUrl,
    pageNode,
    breadcrumbNode,
    imageNode,
    authorNode,
    itemListNode,
    resolvedImage,
  };
}

export function createPageGraph(input: PageGraphInput) {
  const { pageNode, breadcrumbNode, imageNode, authorNode, itemListNode } = buildPageGraphNodes(input);

  return toGraph([pageNode, breadcrumbNode, imageNode, authorNode, itemListNode]);
}

export function createAuthorProfileGraph(author: Author, dates?: { datePublished?: string; dateModified?: string }) {
  return createPageGraph({
    type: 'ProfilePage',
    path: `/author/${author.slug}`,
    title: `${author.name} - ${author.role}`,
    description: author.shortBio,
    breadcrumbItems: [
      { name: 'Home', path: '/' },
      { name: 'Authors', path: '/authors' },
      { name: author.name },
    ],
    imageUrl: {
      url: absoluteUrl(author.avatar),
      width: 512,
      height: 512,
      caption: `${author.name} portrait`,
      description: `${author.name}, ${author.role} at NamyLab.`,
    },
    author,
    mainEntityId: getPersonId(author),
    ...dates,
  });
}

export function createListPageGraph({
  slug,
  title,
  description,
  author,
  imageUrl,
  datePublished,
  dateModified,
  itemListItems = [],
  totalItems,
  keywords = [],
  articleSections = [],
}: {
  slug: string;
  title: string;
  description: string;
  author: Author;
  imageUrl?: string | SchemaImageInput;
  datePublished?: string;
  dateModified?: string;
  itemListItems?: ItemListEntry[];
  totalItems?: number;
  keywords?: string[];
  articleSections?: string[];
}) {
  const path = `/list/${slug}`;
  const { pageNode, breadcrumbNode, imageNode, authorNode, itemListNode } = buildPageGraphNodes({
    type: 'CollectionPage',
    path,
    title,
    description,
    breadcrumbItems: [
      { name: 'Home', path: '/' },
      { name: 'Lists', path: '/lists' },
      { name: title },
    ],
    author,
    imageUrl,
    datePublished,
    dateModified,
    itemList: {
      name: `${title} names`,
      items: itemListItems,
      numberOfItems: totalItems,
    },
  });

  const normalizedKeywords = [...new Set([title, ...keywords].map((keyword) => keyword.trim()).filter(Boolean))];
  const normalizedSections = [...new Set(articleSections.map((section) => section.trim()).filter(Boolean))];

  if (normalizedKeywords.length > 0) {
    pageNode.keywords = normalizedKeywords;
  }

  if (normalizedSections.length > 0) {
    pageNode.about = normalizedSections.map((section) => ({
      '@type': 'Thing',
      name: section,
    }));
  }

  pageNode.publisher = {
    '@id': getOrganizationId(),
  };

  return toGraph([pageNode, breadcrumbNode, imageNode, authorNode, itemListNode]);
}

function getNameBreadcrumbItems(name: Name): BreadcrumbItem[] {
  const genderBreadcrumb = name.gender === 'male'
    ? { name: 'Boy Names', path: '/search?gender=male' }
    : name.gender === 'female'
      ? { name: 'Girl Names', path: '/search?gender=female' }
      : { name: 'Unisex Names', path: '/search?gender=unisex' };

  return [
    { name: 'Home', path: '/' },
    genderBreadcrumb,
    { name: name.name },
  ];
}

export function createNamePageGraph(
  name: Name,
  description: string,
  dates?: { datePublished?: string; dateModified?: string },
  imageUrl?: string | SchemaImageInput,
  author?: Author
) {
  return createPageGraph({
    type: 'WebPage',
    path: getNamePath(name),
    title: `${name.name} - Baby Name Meaning and Origin`,
    description,
    breadcrumbItems: getNameBreadcrumbItems(name),
    imageUrl,
    author,
    ...dates,
  });
}

export function createSimpleWebPageGraph({
  path,
  title,
  description,
  breadcrumbItems,
  datePublished,
  dateModified,
  imageUrl,
}: {
  path: string;
  title: string;
  description: string;
  breadcrumbItems?: BreadcrumbItem[];
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string | SchemaImageInput;
}) {
  return createPageGraph({
    type: 'WebPage',
    path,
    title,
    description,
    breadcrumbItems,
    datePublished,
    dateModified,
    imageUrl,
  });
}

export function createSimpleCollectionPageGraph({
  path,
  title,
  description,
  breadcrumbItems,
  datePublished,
  dateModified,
  imageUrl,
  itemListItems = [],
  totalItems,
}: {
  path: string;
  title: string;
  description: string;
  breadcrumbItems?: BreadcrumbItem[];
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string | SchemaImageInput;
  itemListItems?: ItemListEntry[];
  totalItems?: number;
}) {
  return createPageGraph({
    type: 'CollectionPage',
    path,
    title,
    description,
    breadcrumbItems,
    datePublished,
    dateModified,
    imageUrl,
    itemList: {
      name: `${title} items`,
      items: itemListItems,
      numberOfItems: totalItems,
    },
  });
}


