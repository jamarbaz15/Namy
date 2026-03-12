'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronRight, Globe, Layers, Star, Tag } from 'lucide-react';
import { LIST_DEFINITIONS } from '@/data';
import type { ListDefinition } from '@/types';

export default function ListsClient() {
  // Group lists by category
  const categories = {
    origin: LIST_DEFINITIONS.filter(l => l.category === 'origin'),
    meaning: LIST_DEFINITIONS.filter(l => l.category === 'meaning'),
    category: LIST_DEFINITIONS.filter(l => l.category === 'category'),
    letter: LIST_DEFINITIONS.filter(l => l.category === 'letter'),
  };

  const renderSection = (title: string, icon: React.ReactNode, lists: ListDefinition[]) => {
    if (lists.length === 0) return null;
    return (
      <section className="mb-14">
        <h2 className="text-[22px] font-black text-gray-900 mb-6 flex items-center gap-2.5 tracking-tight">
          <span className="p-2 bg-gray-100 rounded-lg text-gray-500">{icon}</span>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lists.map(list => (
            <Link
              key={list.id}
              href={`/list/${list.slug}`}
              className="text-left group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-100 transition-all flex flex-col h-full"
            >
              {/* Banner image — generated SVG via /api/banner */}
              <div className="w-full h-28 mb-4 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/banner/${list.slug}?v=${list.updatedAt ?? 'v1'}`}
                  alt={list.title}
                  width={1200}
                  height={480}
                  className="w-full h-full object-cover object-left group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="text-[15px] font-black text-gray-900 group-hover:text-primary-600 transition-colors mb-1.5 leading-snug tracking-tight">
                {list.title}
              </h3>
              <p className="text-[13px] font-light text-gray-400 mb-4 line-clamp-2 leading-relaxed">{list.seoTitle}</p>
              <div className="mt-auto flex items-center text-primary-600 text-[12px] font-black tracking-widest uppercase">
                Browse Names <ChevronRight size={13} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in min-h-screen">
      <Link href="/" className="flex items-center text-gray-400 hover:text-primary-600 mb-8 transition-colors text-[13px] font-semibold group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[12px] font-black mb-6 border border-indigo-100 uppercase tracking-widest">
          <Layers size={13} /> Name Collections
        </div>
        <h1 className="text-[38px] md:text-[48px] font-serif font-black text-gray-900 mb-5 tracking-tight leading-tight">
          Curated Name Lists
        </h1>
        <p className="text-[16px] font-light text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Explore our extensive database through carefully curated lists. From ancient origins to modern meanings.
        </p>
      </div>

      {renderSection('By Origin & Culture', <Globe size={18} />, categories.origin)}
      {renderSection('By Meaning', <BookOpen size={18} />, categories.meaning)}
      {renderSection('By Style & Category', <Tag size={18} />, categories.category)}
      {renderSection('By Letter', <Star size={18} />, categories.letter)}

    </div>
  );
}
