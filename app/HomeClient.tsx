'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { NAMES_DB, CATEGORIES } from '@/data';
import { useApp } from '@/components/Providers';
import NameCard from '@/components/NameCard';

export default function HomeClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { favorites, toggleFavorite, compareList, toggleCompare } = useApp();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/search');
    }
  };

  const handleGenderSearch = (gender: string) => {
    router.push(`/search?gender=${gender}`);
  };

  const handlePopularitySearch = (max: number) => {
    router.push(`/search?popularityMax=${max}`);
  };

  const handleCategorySearch = (category: string) => {
    router.push(`/search?q=${category}`);
  };

  const trendingNames = NAMES_DB.filter(n => n.popularity.trend === 'rising').slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-primary-100 shadow-sm text-primary-600 text-sm font-bold mb-8 animate-fade-in">
            <Sparkles size={14} className="fill-current" />
            <span>2026 Edition Updated</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 font-serif leading-tight tracking-tight animate-slide-up">
            Find the Perfect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">Baby Name</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Explore thousands of curated names, meanings, and origins to find the one that speaks to your heart.
          </p>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8 group">
              <div className="absolute inset-0 bg-primary-200 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <input
                type="text"
                placeholder="Search names, meanings, or origins..."
                className="w-full pl-8 pr-16 py-5 rounded-full border-2 border-white bg-white/80 backdrop-blur-sm focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-100 outline-none text-lg shadow-xl shadow-primary-900/5 transition-all placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 aspect-square bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center"
              >
                <Search size={24} />
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleGenderSearch('male')}
                className="bg-white border border-gray-100 hover:border-boy/30 hover:bg-boy/5 text-gray-600 hover:text-boy px-8 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-boy"></span> Boys
              </button>
              <button
                onClick={() => handleGenderSearch('female')}
                className="bg-white border border-gray-100 hover:border-girl/30 hover:bg-girl/5 text-gray-600 hover:text-girl px-8 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-girl"></span> Girls
              </button>
              <button
                onClick={() => handleGenderSearch('unisex')}
                className="bg-white border border-gray-100 hover:border-unisex/30 hover:bg-unisex/5 text-gray-600 hover:text-unisex px-8 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-unisex"></span> Unisex
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 font-serif mb-2">Trending Now</h2>
            <p className="text-gray-500 text-lg">Names rising quickly in the 2026 charts.</p>
          </div>
          <button
            onClick={() => handlePopularitySearch(50)}
            className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
          >
            View Top 50 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingNames.map(name => (
            <NameCard
              key={name.id}
              nameData={name}
              isFavorite={favorites.has(name.id)}
              onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(name.id); }}
              isCompare={compareList.includes(name.id)}
              onToggleCompare={(e) => { e.stopPropagation(); toggleCompare(name.id); }}
            />
          ))}
        </div>
        <button
          onClick={() => handlePopularitySearch(50)}
          className="md:hidden w-full mt-6 flex items-center justify-center gap-2 text-primary-600 font-semibold border border-primary-100 py-3 rounded-xl"
        >
          View Top 50 <ArrowRight size={20} />
        </button>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-bold text-gray-900 font-serif text-center md:text-left">Browse by Collection</h2>
          <Link
            href="/lists"
            className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
          >
            View All Lists <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySearch(cat.id)}
              className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-200 transition-all text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">{cat.icon}</div>
                <div className="font-bold text-gray-800 text-lg mb-1 group-hover:text-primary-600 transition-colors">{cat.name}</div>
                <div className="text-xs text-gray-400 font-medium">{cat.count} names</div>
              </div>
            </button>
          ))}
        </div>
        <Link
          href="/lists"
          className="md:hidden w-full mt-6 flex items-center justify-center gap-2 text-primary-600 font-semibold border border-primary-100 py-3 rounded-xl"
        >
          View All Lists <ArrowRight size={20} />
        </Link>
      </section>

      {/* Tools Teaser */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 opacity-20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600 opacity-20 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-left max-w-xl">
              <div className="inline-block px-3 py-1 rounded-lg bg-white/10 text-primary-200 text-sm font-bold mb-4 backdrop-blur-md">NEW FEATURE</div>
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">Visualize the Full Name</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Not sure how &quot;Alexander James Smith&quot; sounds? Check compatibility with surnames, spot awkward initials, and analyze flow with our preview tool.
              </p>
              <Link
                href="/tools/full-name-preview"
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-primary-50 transition-colors shadow-lg shadow-white/10 flex items-center gap-3 group inline-flex"
              >
                Try Name Preview <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Decorative visual for tool */}
            <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-12 bg-white/20 rounded-lg w-full"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="flex gap-2 mt-4">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <div className="h-2 w-12 rounded-full bg-white/20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
