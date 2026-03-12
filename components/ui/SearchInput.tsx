'use client';

import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search names, meanings, or origins...',
  onSubmit,
  autoFocus = false,
  size = 'md'
}: SearchInputProps) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-5 text-base',
    lg: 'py-4 px-6 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search size={iconSizes[size]} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full ${sizeClasses[size]} pl-12 pr-10 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-0 focus:outline-none transition-colors bg-white`}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
        >
          <X size={iconSizes[size]} />
        </button>
      )}
    </div>
  );
}
