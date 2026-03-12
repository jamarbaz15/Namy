'use client';

import React from 'react';
import Link from 'next/link';
import { NAMES_DB } from '@/data';
import { useApp } from '@/components/Providers';
import { ArrowLeft, Scale, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatUsaRank, getCurrentUsaRank } from '@/lib/namePopularity';
import { getNamePath } from '@/lib/nameRoutes';

export default function CompareClient() {
  const { compareList, toggleCompare } = useApp();
  const namesToCompare = NAMES_DB.filter(name => compareList.includes(name.id));

  const getTrendIcon = (trend: 'rising' | 'falling' | 'stable') => {
    switch (trend) {
      case 'rising': return <TrendingUp size={16} className="text-green-500" />;
      case 'falling': return <TrendingDown size={16} className="text-red-500" />;
      default: return <Minus size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <Link href="/" className="flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors font-medium group">
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-secondary-100 rounded-2xl text-secondary-600">
          <Scale size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-gray-900">Compare Names</h1>
      </div>

      {namesToCompare.length > 0 ? (
        <div className="overflow-x-auto pb-4">
           <div className="min-w-[800px] bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
             <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(250px,1fr))]">
                <div className="bg-gray-50/50 p-6 border-r border-gray-100 flex flex-col gap-8 font-bold text-gray-400 text-sm uppercase tracking-wider pt-24">
                   <div className="h-8 flex items-center">Gender</div>
                   <div className="h-8 flex items-center">Origin</div>
                   <div className="h-8 flex items-center">Meaning</div>
                   <div className="h-8 flex items-center">Popularity</div>
                   <div className="h-8 flex items-center">Syllables</div>
                   <div className="h-8 flex items-center">Length</div>
                   <div className="h-8 flex items-center">Pronunciation</div>
                </div>

                {namesToCompare.map(name => (
                  <div key={name.id} className="p-6 border-r border-gray-100 min-w-[250px] relative hover:bg-gray-50/30 transition-colors">
                     <button
                       onClick={() => toggleCompare(name.id)}
                       className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                       aria-label={`Remove ${name.name} from comparison`}
                     >
                       <X size={20} />
                     </button>

                     <Link href={getNamePath(name)} className="mb-8 text-center block">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary-600 transition-colors">{name.name}</h2>
                        <div className="flex justify-center gap-2">
                           {name.categories.slice(0, 2).map(cat => (
                             <span key={cat} className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{cat}</span>
                           ))}
                        </div>
                     </Link>

                     <div className="flex flex-col gap-8 text-center">
                        <div className="h-8 flex items-center justify-center">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              name.gender === 'male' ? 'bg-boy/10 text-boy' :
                              name.gender === 'female' ? 'bg-girl/10 text-girl' :
                              'bg-unisex/10 text-unisex'
                           }`}>
                              {name.gender}
                           </span>
                        </div>
                        <div className="h-8 flex items-center justify-center font-medium text-gray-700">{name.origins.join(', ')}</div>
                        <div className="h-8 flex items-center justify-center text-sm italic text-gray-600 line-clamp-1" title={name.meaning}>&quot;{name.meaning}&quot;</div>
                        <div className="h-8 flex items-center justify-center gap-2 font-bold text-gray-900">
                           {formatUsaRank(name.popularity)} {getCurrentUsaRank(name.popularity) !== null ? getTrendIcon(name.popularity.trend) : null}
                        </div>
                        <div className="h-8 flex items-center justify-center font-medium text-gray-700">{name.syllables}</div>
                        <div className="h-8 flex items-center justify-center font-medium text-gray-700">{name.name.length} letters</div>
                        <div className="h-8 flex items-center justify-center text-sm text-gray-500">{name.pronunciation}</div>
                     </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <Scale size={40} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Add names to compare</h3>
          <p className="text-gray-500 mb-8 max-w-md">
            Click the scale icon on any name card to add it to this comparison table.
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