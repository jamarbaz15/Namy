'use client';

import Link from 'next/link';
import { Author } from '@/data/authors';

interface AuthorBylineProps {
  author: Author;
  publishDate?: string;
  readTime?: number;
  showAvatar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AuthorByline({
  author,
  publishDate,
  readTime,
  showAvatar = true,
  size = 'md',
}: AuthorBylineProps) {
  const sizeClasses = {
    sm: {
      avatar: 'w-8 h-8 text-sm',
      name: 'text-sm',
      meta: 'text-xs',
    },
    md: {
      avatar: 'w-10 h-10 text-base',
      name: 'text-base',
      meta: 'text-sm',
    },
    lg: {
      avatar: 'w-12 h-12 text-lg',
      name: 'text-lg',
      meta: 'text-sm',
    },
  };

  const styles = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      {showAvatar && (
        <Link href={`/author/${author.slug}`}>
          <div
            className={`${styles.avatar} rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold`}
          >
            {author.name.split(' ').map(n => n[0]).join('')}
          </div>
        </Link>
      )}
      <div>
        <Link
          href={`/author/${author.slug}`}
          className={`${styles.name} font-medium text-gray-900 hover:text-pink-600 transition-colors`}
        >
          {author.name}
        </Link>
        <div className={`${styles.meta} text-gray-500 flex items-center gap-2`}>
          <span>{author.role}</span>
          {publishDate && (
            <>
              <span>·</span>
              <time dateTime={publishDate}>
                {new Date(publishDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </>
          )}
          {readTime && (
            <>
              <span>·</span>
              <span>{readTime} min read</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
