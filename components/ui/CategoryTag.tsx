'use client';

import React from 'react';
import Link from 'next/link';

interface CategoryTagProps {
  category: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'filled';
}

export default function CategoryTag({ category, href, onClick, variant = 'default' }: CategoryTagProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    outline: 'border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600',
    filled: 'bg-primary-100 text-primary-700 hover:bg-primary-200'
  };

  const className = `${baseClasses} ${variantClasses[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {category}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {category}
      </button>
    );
  }

  return (
    <span className={className}>
      {category}
    </span>
  );
}
