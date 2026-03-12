'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Layers, Heart, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import ListHeroBanner from '@/components/ListHeroBanner';
import { useApp } from '@/components/Providers';
import type { Author } from '@/data/authors';
import { AuthorCard } from '@/components/Author';
import { getNamePath } from '@/lib/nameRoutes';
import type { ListDefinition, Name } from '@/types';

const SECTION_BATCH_SIZE = 100;
const SECTION_STAGGER_LIMIT = 12;
const SECTION_STAGGER_DELAY_MS = 40;

const getSectionAnimationDelay = (index: number) => {
  const batchIndex = index % SECTION_BATCH_SIZE;
  const staggerIndex = Math.min(batchIndex, SECTION_STAGGER_LIMIT - 1);
  return String(staggerIndex * SECTION_STAGGER_DELAY_MS) + 'ms';
};
const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const WHY_CHOOSE_VARIANTS = [
  'Choosing from {topic} gives your child a story-rich start. These names often carry a clear emotional meaning, making your final choice feel both personal and intentional.',
  'Parents often gravitate toward {topic} when they want a name that sounds beautiful and also feels meaningful in everyday life. It balances heart, identity, and long-term fit.',
  '{topicCap} are popular because they communicate values at first introduction. A thoughtful name can become a lifelong source of pride and confidence.',
  'If you want a name with purpose, {topic} are a strong place to begin. They often blend timeless appeal with distinctive character.',
  'Many families choose from {topic} to reflect their beliefs, hopes, or heritage. The result is usually a name that feels both memorable and deeply personal.',
  '{topicCap} can make naming decisions easier by giving you a clear theme to compare style, pronunciation, and meaning side by side.',
  'When parents explore {topic}, they usually find options that feel emotionally resonant and practical for everyday use across different ages.',
  'A great baby name should feel special today and still fit years later. {topicCap} often deliver that balance of meaning, sound, and longevity.',
  '{topicCap} are frequently selected by parents who want a name that carries symbolism while still feeling modern and usable.',
  'Starting with {topic} helps narrow choices quickly without losing depth. It gives you a clear framework while leaving room for personality.',
  'Names from {topic} tend to feel intentional and expressive, which is why they remain a favorite for parents seeking both beauty and substance.',
  'Exploring {topic} can reveal names that are meaningful across cultures and generations, making your final shortlist stronger and more versatile.',
];

const POPULARITY_TRENDS_VARIANTS = [
  'Some options in {topic} remain timeless classics, while others are quickly rising. Watching trend signals can help you decide between familiar and fresh.',
  'Popularity in {topic} usually shifts with culture, media, and family naming preferences. Reviewing current rankings helps you spot names gaining momentum.',
  '{topicCap} often include a mix of enduring favorites and new standouts. Trend patterns are useful when you want a name that feels current but not overused.',
  'Across recent years, {topic} have shown both stable staples and fast-moving newcomers. This makes the list ideal for comparing classic vs. modern choices.',
  'If uniqueness matters, trend movement in {topic} can guide you toward names that are climbing but not yet everywhere.',
  'Parents tracking {topic} usually look for the sweet spot: recognizable names with room to feel individual. Trend data helps identify that balance.',
  'Popularity trends for {topic} reveal which names are becoming family favorites and which are quietly fading from the spotlight.',
  'By checking trend direction in {topic}, you can prioritize names that match your style, whether traditional, modern, or somewhere in between.',
  'Names in {topic} often cycle over time. Looking at trend context helps you choose whether to embrace a revival or pick an emerging option.',
  'Trend insights for {topic} are especially helpful when you are deciding between multiple favorites with similar meanings or sounds.',
  '{topicCap} continue to evolve each year, offering fresh alternatives while preserving beloved classics. That variety is great for final shortlists.',
  'From chart-toppers to hidden gems, trend patterns in {topic} make it easier to choose a name that feels right for your family right now.',
];

const POPULAR_NAMES_VARIANTS = [
  'Below is a visual overview of the most popular {topic} for boys and girls. Use this snapshot to compare top picks at a glance.',
  'This chart highlights the top-ranked {topic} from our curated collection, organized by boys and girls to make comparison easy.',
  'Explore the most searched {topic} side by side. The infographic below shows the leading names for both boys and girls.',
  'Here is a quick visual guide to the most popular {topic}, organized by gender so you can spot trends and favorites instantly.',
  'The chart below showcases the standout {topic} ranked by popularity, giving you a fast overview of the best options.',
  'Use this visual breakdown to discover which {topic} are trending most for boys and girls right now.',
  'A quick look at popularity across {topic} can help you shortlist names that feel both meaningful and well-recognised.',
  'See which {topic} are leading the charts. The infographic below is a useful starting point before browsing the full list.',
];

const toAnchorId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const applyTemplate = (template: string, topic: string) => {
  const topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  return template
    .replaceAll('{topic}', topic)
    .replaceAll('{topicCap}', topicCap);
};

const formatDisplayDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return DISPLAY_DATE_FORMATTER.format(date);
};

interface ListPageClientProps {
  list: Pick<ListDefinition, 'slug' | 'title' | 'updatedAt'>;
  author: Author;
  displayTitle: string;
  introParagraphs: string[];
  girlNames: Array<Pick<Name, 'id' | 'name' | 'slug' | 'gender' | 'origins' | 'meaning' | 'description'>>;
  boyNames: Array<Pick<Name, 'id' | 'name' | 'slug' | 'gender' | 'origins' | 'meaning' | 'description'>>;
  unisexNames: Array<Pick<Name, 'id' | 'name' | 'slug' | 'gender' | 'origins' | 'meaning' | 'description'>>;
  relatedLists: Array<{
    slug: string;
    title: string;
  }>;
}

export default function ListPageClient({
  list,
  author,
  displayTitle,
  introParagraphs,
  girlNames,
  boyNames,
  unisexNames,
  relatedLists,
}: ListPageClientProps) {
  const { favorites, toggleFavorite } = useApp();
  const nameCount = girlNames.length + boyNames.length + unisexNames.length;

  const [visibleCounts, setVisibleCounts] = useState({
    girls: Math.min(SECTION_BATCH_SIZE, girlNames.length),
    boys: Math.min(SECTION_BATCH_SIZE, boyNames.length),
    unisex: Math.min(SECTION_BATCH_SIZE, unisexNames.length),
  });

  const [isTocOpen, setIsTocOpen] = useState(true);

  useEffect(() => {
    setVisibleCounts({
      girls: Math.min(SECTION_BATCH_SIZE, girlNames.length),
      boys: Math.min(SECTION_BATCH_SIZE, boyNames.length),
      unisex: Math.min(SECTION_BATCH_SIZE, unisexNames.length),
    });
  }, [girlNames.length, boyNames.length, unisexNames.length]);

  const dynamicSections = useMemo(() => {
    const topic = displayTitle.toLowerCase();
    const seed = hashString(list.slug);

    return [
      {
        title: `Why Choose ${displayTitle}?`,
        content: applyTemplate(WHY_CHOOSE_VARIANTS[seed % WHY_CHOOSE_VARIANTS.length], topic),
      },
    ];
  }, [displayTitle, list.slug]);

  const popularNamesText = useMemo(() => {
    const topic = displayTitle.toLowerCase();
    const seed = hashString(list.slug);
    return applyTemplate(POPULAR_NAMES_VARIANTS[seed % POPULAR_NAMES_VARIANTS.length], topic);
  }, [displayTitle, list.slug]);

  const tocItems = useMemo(() => {
    const items: Array<{ id: string; label: string }> = [];

    // Popular Names infographic is always shown when there are names
    if (girlNames.length + boyNames.length + unisexNames.length > 0) {
      items.push({ id: 'popular-names', label: 'Popular Names' });
    }

    if (girlNames.length > 0) {
      items.push({ id: toAnchorId(`${displayTitle} for Girls`), label: `${displayTitle} for Girls` });
    }
    if (boyNames.length > 0) {
      items.push({ id: toAnchorId(`${displayTitle} for Boys`), label: `${displayTitle} for Boys` });
    }
    if (unisexNames.length > 0) {
      items.push({ id: toAnchorId(`Unisex ${displayTitle}`), label: `Unisex ${displayTitle}` });
    }

    dynamicSections.forEach((section) => {
      items.push({ id: toAnchorId(section.title), label: section.title });
    });

    return items;
  }, [boyNames.length, dynamicSections, displayTitle, girlNames.length, unisexNames.length]);

  const updatedLabel = formatDisplayDate(list.updatedAt);
  const renderRichText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\n)/g);
    return parts.map((part, i) => {
      if (part === '\n') return <br key={i} />;
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in min-h-screen">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10 font-medium overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/lists" className="hover:text-primary-600 transition-colors">Lists</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 truncate">{displayTitle}</span>
        </nav>

        <header className="mb-16 text-center md:text-left">
          <h1 className="text-[36px] md:text-[42px] font-serif font-black text-gray-900 leading-tight mb-8">
            {`${nameCount}+ ${displayTitle}`}
          </h1>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 mb-10 border-b border-gray-100 pb-10">
            <Link href={`/author/${author.slug}`} className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-primary-200 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                {author.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-50">
                <div className="bg-primary-50 rounded-full p-0.5">
                  <Heart size={10} className="text-primary-500 fill-primary-500" />
                </div>
              </div>
            </Link>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-lg text-gray-900 mb-1.5">
                <span className="font-medium text-gray-600">By</span>
                <Link
                  href={`/author/${author.slug}`}
                  className="font-bold underline decoration-primary-300 decoration-2 underline-offset-4 font-serif text-xl hover:text-primary-600 transition-colors"
                >
                  {author.name}
                </Link>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-gray-500 font-medium">
                <span className="text-primary-600">{author.role}</span>
                {updatedLabel ? (
                  <>
                    <span className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1.5">Updated {updatedLabel}</span>
                  </>
                ) : null}
                <span className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1.5">
                  <Layers size={14} className="text-primary-500" />
                  {nameCount} Names
                </span>
              </div>
            </div>
          </div>

          <ListHeroBanner list={list} nameCount={nameCount} />

          <div className="max-w-none text-gray-600">
            {introParagraphs[0] && (
              <p className="text-[17px] text-gray-800 mb-8 leading-[1.8]">
                {renderRichText(introParagraphs[0])}
              </p>
            )}

            {tocItems.length > 0 && (
              <nav className="mb-10 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                {/* TOC header row */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors text-left"
                  onClick={() => setIsTocOpen((prev) => !prev)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">On this page</span>
                    <span className="text-[11px] font-semibold text-gray-300">· {tocItems.length} sections</span>
                  </div>
                  {isTocOpen
                    ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
                </button>

                {isTocOpen && (
                  <div className="bg-white px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    {tocItems.map((item, idx) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 group"
                      >
                        <span className="flex-shrink-0 w-[22px] h-[22px] rounded-full border border-gray-200 text-gray-400 text-[10px] font-black flex items-center justify-center group-hover:border-primary-400 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all">
                          {idx + 1}
                        </span>
                        <span className="text-[14px] font-semibold text-gray-600 group-hover:text-primary-600 transition-colors leading-snug">
                          {item.label}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </nav>
            )}

            {introParagraphs.slice(1).map((paragraph, idx) => (
              <p key={idx} className="text-[17px] text-gray-800 mb-6 leading-[1.8]">
                {renderRichText(paragraph)}
              </p>
            ))}
          </div>
        </header>

        {/* ── Popular Names infographic ── */}
        {nameCount > 0 && (
          <section id="popular-names" className="mb-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="px-6 md:px-8 pt-7 pb-5">
              <h2 className="text-[24px] md:text-[28px] font-serif font-black text-gray-900 mb-3">
                Popular Names
              </h2>
              <p className="text-[16px] text-slate-700 leading-[1.75]">
                {popularNamesText}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/list/${list.slug}/infographic-image`}
              alt={`Top ${displayTitle} ranked by popularity`}
              width={1200}
              height={720}
              className="w-full h-auto block"
            />
          </section>
        )}

        <div className="mb-20">
          {nameCount > 0 ? (
            <div className="space-y-16">
              {[
                {
                  key: 'girls' as const,
                  heading: `${displayTitle} for Girls`,
                  names: girlNames,
                  visibleCount: visibleCounts.girls,
                  favoriteClasses: {
                    active: 'bg-pink-50 border-pink-200 text-pink-600',
                    idle: 'bg-pink-50 border-pink-100 text-pink-400',
                  },
                },
                {
                  key: 'boys' as const,
                  heading: `${displayTitle} for Boys`,
                  names: boyNames,
                  visibleCount: visibleCounts.boys,
                  favoriteClasses: {
                    active: 'bg-sky-50 border-sky-200 text-sky-600',
                    idle: 'bg-sky-50 border-sky-100 text-sky-400',
                  },
                },
                {
                  key: 'unisex' as const,
                  heading: `Unisex ${displayTitle}`,
                  names: unisexNames,
                  visibleCount: visibleCounts.unisex,
                  favoriteClasses: {
                    active: 'bg-purple-50 border-purple-200 text-purple-600',
                    idle: 'bg-purple-50 border-purple-100 text-purple-400',
                  },
                },
              ].map((section) => (
                section.names.length > 0 && (
                  <section key={section.key} className="space-y-8">
                    <h2 id={toAnchorId(section.heading)} className="text-[24px] md:text-[28px] font-serif font-black text-gray-900">{section.heading}</h2>

                    <div className="space-y-5">
                      {section.names.slice(0, section.visibleCount).map((name, idx) => {
                        const isFav = favorites.has(name.id);
                        return (
                          <div key={name.id} className="group animate-slide-up bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200" style={{ animationDelay: getSectionAnimationDelay(idx) }}>
                            <div className="mb-6 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-6">
                              <div className="flex-grow">
                                <Link
                                  href={getNamePath(name)}
                                  className="text-[26px] md:text-[30px] font-serif font-black text-gray-900 cursor-pointer hover:text-primary-600 transition-colors inline-block mb-1"
                                >
                                  {name.name}
                                </Link>
                              </div>

                              <div className="flex-shrink-0">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleFavorite(name.id); }}
                                  className={`group/btn p-2 rounded-full border transition-colors ${isFav ? section.favoriteClasses.active : section.favoriteClasses.idle}`}
                                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                  <Heart size={18} className={`transition-transform duration-300 ${isFav ? 'fill-current scale-110' : 'group-hover/btn:scale-110'}`} />
                                </button>
                              </div>
                            </div>

                            <ul className="space-y-3 text-gray-700 leading-relaxed text-[15px] list-disc pl-5 marker:text-gray-300 marker:text-sm">
                              <li className="pl-2">
                                <span className="font-bold text-gray-900 mr-2">Origin:</span>
                                {name.origins.join(', ')}
                              </li>
                              <li className="pl-2">
                                <span className="font-bold text-gray-900 mr-2">Meaning:</span>
                                &quot;{name.meaning}&quot;
                              </li>
                              <li className="pl-2">
                                <span className="font-bold text-gray-900 mr-2">Description:</span>
                                {name.description}
                              </li>
                            </ul>

                            <div className="mt-6 flex justify-end">
                              <Link
                                href={getNamePath(name)}
                                className="text-xs font-bold tracking-widest text-gray-400 hover:text-primary-600 uppercase flex items-center gap-1 transition-colors group/link"
                              >
                                VIEW FULL ANALYSIS
                                <ChevronRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {section.names.length > SECTION_BATCH_SIZE && section.visibleCount < section.names.length && (
                      <div className="pt-2">
                        <button
                          onClick={() => setVisibleCounts((prev) => ({
                            ...prev,
                            [section.key]: Math.min(prev[section.key] + SECTION_BATCH_SIZE, section.names.length),
                          }))}
                          className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                        >
                          Load more {section.key === 'girls' ? 'girl' : section.key === 'boys' ? 'boy' : 'unisex'} names
                        </button>
                      </div>
                    )}
                  </section>
                )
              ))}
            </div>
          ) : (
            <div className="p-16 bg-gray-50 rounded-2xl text-center text-gray-500">
              No names found matching this specific list criteria.
            </div>
          )}
        </div>

        <section className="border-t border-gray-100 pt-16 mb-16 space-y-12">
          {dynamicSections.map((section) => (
            <div key={section.title} id={toAnchorId(section.title)}>
              <h2 className="text-[24px] md:text-[28px] font-serif font-black text-slate-900 mb-4 leading-tight">{section.title}</h2>
              <p className="text-[16px] text-slate-700 leading-[1.8]">{section.content}</p>
            </div>
          ))}
        </section>

        <div className="border-t border-gray-100 pt-12 mb-12">
          <AuthorCard author={author} variant="full" />
        </div>

        {relatedLists.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <h3 className="font-serif font-black text-gray-900 mb-6 text-[20px] text-center tracking-tight">You might also like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedLists.map((relatedList) => (
                <Link
                  key={relatedList.slug}
                  href={`/list/${relatedList.slug}`}
                  className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl hover:border-primary-200 hover:shadow-md transition-all text-left group"
                >
                  <span className="font-medium text-gray-800 group-hover:text-primary-700">
                    {relatedList.title}
                  </span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}





