'use client';

import React from 'react';
import type { Name } from '@/types';
import NameCard from './NameCard';
import { useApp } from './Providers';

interface NameGridProps {
  names: Name[];
  columns?: 1 | 2 | 3;
}

export default function NameGrid({ names, columns = 2 }: NameGridProps) {
  const { favorites, toggleFavorite, compareList, toggleCompare } = useApp();

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  if (names.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No names found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {names.map((name) => (
        <NameCard
          key={name.id}
          nameData={name}
          isFavorite={favorites.has(name.id)}
          onToggleFavorite={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(name.id);
          }}
          isCompare={compareList.includes(name.id)}
          onToggleCompare={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(name.id);
          }}
        />
      ))}
    </div>
  );
}
