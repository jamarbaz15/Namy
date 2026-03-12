'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-serif font-bold">
                N
              </div>
              <span className="text-xl font-serif font-bold text-gray-900">NamyLab</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Beautifully designed to help expecting parents find the perfect name through data, meanings, and smart tools.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 font-serif text-lg">Discover</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/search?popularityMax=10" className="hover:text-primary-600 transition-colors">
                  Popular Names
                </Link>
              </li>
              <li>
                <Link href="/search?popularityMax=100" className="hover:text-primary-600 transition-colors">
                  Unique Names
                </Link>
              </li>
              <li>
                <Link href="/lists" className="hover:text-primary-600 transition-colors">
                  Name Lists
                </Link>
              </li>
              <li>
                <Link href="/search?origin=Biblical" className="hover:text-primary-600 transition-colors">
                  Biblical Names
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 font-serif text-lg">Tools</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/tools/full-name-preview" className="hover:text-primary-600 transition-colors">
                  Full Name Preview
                </Link>
              </li>
              <li>
                <Link href="/tools/sibling-matcher" className="hover:text-primary-600 transition-colors">
                  Sibling Matcher
                </Link>
              </li>
              <li>
                <Link href="/tools/surname-checker" className="hover:text-primary-600 transition-colors">
                  Surname Flow
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 font-serif text-lg">About</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/authors" className="hover:text-primary-600 transition-colors">
                  Our Expert Team
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 NamyLab. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1">
              Made with <Heart size={12} className="text-primary-500 fill-current" /> for parents
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
