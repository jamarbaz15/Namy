'use client';

import Link from 'next/link';
import { Author } from '@/data/authors';

interface AuthorCardProps {
  author: Author;
  variant?: 'compact' | 'full';
}

export default function AuthorCard({ author, variant = 'full' }: AuthorCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/author/${author.slug}`}
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors group"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold flex-shrink-0">
          {author.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
            {author.name}
          </h3>
          <p className="text-sm text-gray-500">{author.role}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-pink-50 rounded-xl p-6 border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link href={`/author/${author.slug}`} className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xl font-bold shadow-md hover:shadow-lg transition-shadow">
            {author.name.split(' ').map(n => n[0]).join('')}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Written by</span>
          </div>
          <Link
            href={`/author/${author.slug}`}
            className="text-lg font-bold text-gray-900 hover:text-pink-600 transition-colors"
          >
            {author.name}
          </Link>
          <p className="text-sm text-pink-600 font-medium mb-2">{author.title}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{author.shortBio}</p>

          {/* Expertise */}
          <div className="flex flex-wrap gap-1 mb-3">
            {author.expertise.slice(0, 3).map((area, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-white text-gray-600 text-xs rounded-full border border-gray-200"
              >
                {area}
              </span>
            ))}
          </div>

          {/* Social and profile link */}
          <div className="flex items-center gap-4">
            <Link
              href={`/author/${author.slug}`}
              className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
            >
              View Profile {'->'}
            </Link>

            {author.social && (
              <div className="flex gap-3">
                {author.social.twitter && (
                  <a
                    href={`https://twitter.com/${author.social.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label="Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {author.social.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${author.social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

