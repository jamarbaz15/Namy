'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Layout, Activity, Users, ArrowRight, Tag } from 'lucide-react';

export default function ToolsClient() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in min-h-screen">
       {/* Header */}
       <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-6 border border-primary-100">
             <Sparkles size={14} /> Name Lab
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">Baby Name Tools</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
             Advanced tools to help you analyze flow, predict nicknames, and find the perfect sibling match.
          </p>
       </div>

       {/* Tools Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card 1: Full Name */}
          <Link
             href="/tools/full-name-preview"
             className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all cursor-pointer relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>

             <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors relative z-10">
                <Layout size={28} />
             </div>

             <h3 className="text-2xl font-bold font-serif text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Full Name Preview</h3>
             <p className="text-gray-600 mb-8 leading-relaxed">
                Visualize how a full name looks in print, generate middle names, and check initials for accidental words.
             </p>

             <div className="flex items-center text-purple-600 font-bold text-sm tracking-wide">
                TRY TOOL <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </div>
          </Link>

          {/* Card 2: Surname Flow */}
          <Link
             href="/tools/surname-checker"
             className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>

             <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10">
                <Activity size={28} />
             </div>

             <h3 className="text-2xl font-bold font-serif text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Surname Flow</h3>
             <p className="text-gray-600 mb-8 leading-relaxed">
                Test the compatibility rhythm between a first name and surname with our 5-star scoring system.
             </p>

             <div className="flex items-center text-blue-600 font-bold text-sm tracking-wide">
                TRY TOOL <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </div>
          </Link>

          {/* Card 3: Sibling Matcher */}
          <Link
             href="/tools/sibling-matcher"
             className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all cursor-pointer relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>

             <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors relative z-10">
                <Users size={28} />
             </div>

             <h3 className="text-2xl font-bold font-serif text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">Sibling Matcher</h3>
             <p className="text-gray-600 mb-8 leading-relaxed">
                Find the perfect name that complements your current children&apos;s names in style, origin, and feel.
             </p>

             <div className="flex items-center text-pink-600 font-bold text-sm tracking-wide">
                TRY TOOL <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </div>
          </Link>

          {/* Card 4: Nickname Predictor */}
          <Link
             href="/tools/nickname-predictor"
             className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all cursor-pointer relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>

             <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors relative z-10">
                <Tag size={28} />
             </div>

             <h3 className="text-2xl font-bold font-serif text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">Nickname Predictor</h3>
             <p className="text-gray-600 mb-8 leading-relaxed">
                Instantly generate cute, cool, and clever nicknames based on first names, middle names, and initials.
             </p>

             <div className="flex items-center text-teal-600 font-bold text-sm tracking-wide">
                TRY TOOL <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </div>
          </Link>

       </div>
    </div>
  );
}
