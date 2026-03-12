import type { Name } from '@/types';

export function getNamePath(name: Pick<Name, 'slug'>): string {
  return `/name/${name.slug}`;
}