'use client';

import React from 'react';
import Link from 'next/link';

interface LetterGridProps {
  selectedLetter?: string;
  baseUrl?: string;
  onLetterClick?: (letter: string) => void;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function LetterGrid({ selectedLetter, baseUrl = '/search', onLetterClick }: LetterGridProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {LETTERS.map((letter) => {
        const isSelected = selectedLetter === letter;

        if (onLetterClick) {
          return (
            <button
              key={letter}
              onClick={() => onLetterClick(letter)}
              className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {letter}
            </button>
          );
        }

        return (
          <Link
            key={letter}
            href={`${baseUrl}?letter=${letter}`}
            className={`w-10 h-10 rounded-lg font-semibold text-sm flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-600 border border-gray-200 hover:border-primary-300'
            }`}
          >
            {letter}
          </Link>
        );
      })}
    </div>
  );
}
