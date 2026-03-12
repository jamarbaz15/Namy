'use client';

import React from 'react';
import Link from 'next/link';
import { NAMES_DB } from '@/data';
import { useApp } from '@/components/Providers';
import NameCard from '@/components/NameCard';
import { Heart, ArrowLeft } from 'lucide-react';

export default function FavoritesClient() {
  const { favorites, toggleFavorite, compareList, toggleCompare } = useApp();
  const favoriteNames = NAMES_DB.filter(name => favorites.has(name.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <Link href="/" className="flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors font-medium group">
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-primary-100 rounded-2xl text-primary-600">
          <Heart size={32} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-gray-900">Your Favorites</h1>
        {favoriteNames.length > 0 && (
          <span className="ml-2 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-bold">
            {favoriteNames.length} {favoriteNames.length === 1 ? 'name' : 'names'}
          </span>
        )}
      </div>

      {favoriteNames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {favoriteNames.map(name => (
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
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <Heart size={40} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">No favorites yet</h3>
          <p className="text-gray-500 mb-8 max-w-md">
            Heart any name you like while browsing to save it here.
          </p>
          <Link
            href="/search"
            className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
          >
            Browse Names
          </Link>
        </div>
      )}
    </div>
  );
}
