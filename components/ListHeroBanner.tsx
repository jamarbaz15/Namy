import type { ListDefinition } from '@/types';

interface ListHeroBannerProps {
  list: Pick<ListDefinition, 'slug' | 'title' | 'updatedAt'>;
  nameCount: number;
}

export default function ListHeroBanner({ list, nameCount }: ListHeroBannerProps) {
  const altText = `${list.title} — ${nameCount}+ baby names with meanings, origins and popularity`;

  return (
    <figure className="rounded-2xl overflow-hidden mb-10 shadow-md" aria-label={altText}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/banner/${list.slug}?v=${list.updatedAt ?? 'v1'}`}
        alt={altText}
        width={1200}
        height={480}
        className="w-full h-auto block"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </figure>
  );
}
