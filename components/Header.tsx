'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Heart,
  Sparkles,
  ChevronDown,
  Layout,
  Activity,
  Users,
  Tag
} from 'lucide-react';

interface HeaderProps {
  favoritesCount: number;
  compareCount: number;
}

export default function Header({ favoritesCount, compareCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg shadow-primary-500/30 transform group-hover:rotate-3 transition-transform duration-300">
              N
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles size={12} className="text-yellow-400 fill-yellow-400 animate-pulse" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">
            NamyLab
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className={`text-sm font-semibold tracking-wide hover:text-primary-600 transition-colors ${isActive('/') && pathname === '/' ? 'text-primary-600' : 'text-gray-600'}`}
          >
            EXPLORE
          </Link>
          <Link
            href="/lists"
            className={`text-sm font-semibold tracking-wide hover:text-primary-600 transition-colors ${isActive('/lists') || isActive('/list') ? 'text-primary-600' : 'text-gray-600'}`}
          >
            LISTS
          </Link>
          <Link
            href="/search"
            className={`text-sm font-semibold tracking-wide hover:text-primary-600 transition-colors ${isActive('/search') ? 'text-primary-600' : 'text-gray-600'}`}
          >
            SEARCH
          </Link>

          {/* Tools Dropdown */}
          <div className="relative group">
            <Link
              href="/tools"
              className={`flex items-center gap-1 text-sm font-semibold tracking-wide hover:text-primary-600 transition-colors ${isActive('/tools') ? 'text-primary-600' : 'text-gray-600'}`}
            >
              TOOLS <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform" />
            </Link>

            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-72 z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                <Link href="/tools/full-name-preview" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group/item">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                    <Layout size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Name Preview</div>
                    <div className="text-xs text-gray-500">Full name analyzer</div>
                  </div>
                </Link>
                <Link href="/tools/surname-checker" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group/item">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                    <Activity size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Surname Flow</div>
                    <div className="text-xs text-gray-500">Check compatibility</div>
                  </div>
                </Link>
                <Link href="/tools/sibling-matcher" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group/item">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center group-hover/item:bg-pink-600 group-hover/item:text-white transition-colors">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Sibling Matcher</div>
                    <div className="text-xs text-gray-500">Find matching names</div>
                  </div>
                </Link>
                <Link href="/tools/nickname-predictor" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group/item">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover/item:bg-teal-600 group-hover/item:text-white transition-colors">
                    <Tag size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Nickname Predictor</div>
                    <div className="text-xs text-gray-500">Find playful variations</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/compare"
            className={`text-sm font-semibold tracking-wide hover:text-primary-600 transition-colors ${isActive('/compare') ? 'text-primary-600' : 'text-gray-600'}`}
          >
            COMPARE {isMounted && compareCount > 0 && <span className="ml-1 bg-secondary-100 text-secondary-600 px-1.5 py-0.5 rounded-full text-xs">{compareCount}</span>}
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/search"
            className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-all"
            aria-label="Search names"
          >
            <Search size={20} />
          </Link>
          <Link
            href="/favorites"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white font-medium hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Heart size={16} className={isMounted && favoritesCount > 0 ? "fill-current text-primary-400" : "fill-current"} />
            <span className="text-sm">Favorites {isMounted && favoritesCount > 0 && `(${favoritesCount})`}</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-primary-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full left-0 shadow-xl flex flex-col p-4 z-40 animate-fade-in">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors">
            Explore
          </Link>
          <Link href="/lists" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors">
            Lists
          </Link>
          <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors">
            Search Names
          </Link>
          <div className="border-t border-gray-100 my-2"></div>
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider py-2">Tools</p>
          <Link href="/tools/full-name-preview" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors pl-6">
            Name Preview
          </Link>
          <Link href="/tools/surname-checker" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors pl-6">
            Surname Flow
          </Link>
          <Link href="/tools/sibling-matcher" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors pl-6">
            Sibling Matcher
          </Link>
          <Link href="/tools/nickname-predictor" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors pl-6">
            Nickname Predictor
          </Link>
          <div className="border-t border-gray-100 my-2"></div>
          <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors">
            Compare ({compareCount})
          </Link>
          <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="text-left font-medium p-3 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors">
            Favorites ({favoritesCount})
          </Link>
        </div>
      )}
    </header>
  );
}
