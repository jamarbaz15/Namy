'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Author } from '@/data/authors';

interface AuthorCardProps {
  author: Author;
  variant?: 'compact' | 'full';
}

// Generate a randomuser.me image URL based on author ID
function getAuthorImageUrl(authorId: string): string {
  // Use a consistent seed based on author ID for same image every time
  // randomuser.me API has portraits from 0-71 for males and females
  const seed = authorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const portraitNumber = seed % 72;
  return `https://api.randomuser.me/portraits/med/${portraitNumber}.jpg`;
}

export default function AuthorCard({ author, variant = 'compact' }: AuthorCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/author/${author.slug}`}
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors group"
      >
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
          <Image
            src={getAuthorImageUrl(author.id)}
            alt={author.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
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
    <div className="bg-gradient-to-br from-gray-50 to-pink-50 rounded-xl p-5 sm:p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Avatar */}
        <Link href={`/author/${author.slug}`} className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <Image
              src={getAuthorImageUrl(author.id)}
              alt={author.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Written by</span>
          </div>
          <Link
            href={`/author/${author.slug}`}
            className="text-lg font-bold text-gray-900 hover:text-pink-600 transition-colors block"
          >
            {author.name}
          </Link>
          <p className="text-sm text-pink-600 font-medium mb-2">{author.title}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{author.shortBio}</p>

          {/* Expertise - responsive grid */}
          <div className="flex flex-wrap gap-1.5 mb-4 justify-center sm:justify-start">
            {author.expertise.slice(0, 3).map((area, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-white text-gray-600 text-xs rounded-full border border-gray-200 whitespace-nowrap"
              >
                {area}
              </span>
            ))}
          </div>

          {/* Social and profile link - stacked on mobile */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
            <Link
              href={`/author/${author.slug}`}
              className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
            >
              View Profile →
            </Link>

            {author.social && (
              <div className="flex gap-4">
                {author.social.twitter && (
                  <a
                    href={`https://twitter.com/${author.social.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={`${author.name} on Twitter`}
                    title={`Follow ${author.name} on Twitter`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
                    aria-label={`${author.name} on LinkedIn`}
                    title={`Connect with ${author.name} on LinkedIn`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {author.social.instagram && (
                  <a
                    href={`https://instagram.com/${author.social.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                    aria-label={`${author.name} on Instagram`}
                    title={`Follow ${author.name} on Instagram`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
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

