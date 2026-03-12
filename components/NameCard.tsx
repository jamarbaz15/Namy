'use client';

import React from 'react';
import Link from 'next/link';
import type { Name } from '@/types';
import { Heart, TrendingUp, TrendingDown, Minus, ArrowRight, Scale } from 'lucide-react';
import { formatUsaRank, getCurrentUsaRank } from '@/lib/namePopularity';
import { getNamePath } from '@/lib/nameRoutes';

interface NameCardProps {
  nameData: Name;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  isCompare?: boolean;
  onToggleCompare?: (e: React.MouseEvent) => void;
}

export default function NameCard({
  nameData,
  isFavorite = false,
  onToggleFavorite,
  isCompare = false,
  onToggleCompare
}: NameCardProps) {
  const genderColor =
    nameData.gender === 'male' ? 'bg-boy' :
    nameData.gender === 'female' ? 'bg-girl' :
    'bg-unisex';

  const trendIcon =
    nameData.popularity.trend === 'rising' ? <TrendingUp size={14} className="text-green-500" /> :
    nameData.popularity.trend === 'falling' ? <TrendingDown size={14} className="text-red-500" /> :
    <Minus size={14} className="text-gray-400" />;

  const currentRank = getCurrentUsaRank(nameData.popularity);

  return (
    <div className="group relative bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-card-hover border border-gray-100 hover:border-primary-100 overflow-hidden">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${genderColor} opacity-20 group-hover:opacity-100 transition-opacity`}></div>

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${genderColor}`}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{nameData.gender}</span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleCompare && (
            <button
              onClick={onToggleCompare}
              className={`p-1.5 rounded-full transition-all ${isCompare ? 'bg-secondary-100 text-secondary-600' : 'text-gray-300 hover:text-secondary-500 hover:bg-secondary-50'}`}
              title={isCompare ? 'Remove from comparison' : 'Add to compare'}
              aria-label={isCompare ? 'Remove from comparison' : 'Add to compare'}
            >
              <Scale size={18} />
            </button>
          )}
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-full transition-all ${isFavorite ? 'bg-primary-50 text-primary-500' : 'text-gray-300 hover:text-primary-500 hover:bg-primary-50'}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      <Link href={getNamePath(nameData)} className="block">
        <div className="mb-4">
          <h3 className="text-3xl font-serif font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {nameData.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 font-medium">{nameData.pronunciation}</p>
        </div>

        <p className="text-gray-600 italic mb-6 line-clamp-2 text-sm leading-relaxed">
          &ldquo;{nameData.meaning}&rdquo;
        </p>

        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-md">
              <span className="font-semibold text-gray-700">{formatUsaRank(nameData.popularity)}</span>
              {currentRank !== null ? trendIcon : null}
            </div>
            <span className="text-gray-400">|</span>
            <span>{nameData.origins[0]}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight size={16} />
          </div>
        </div>
      </Link>
    </div>
  );
}