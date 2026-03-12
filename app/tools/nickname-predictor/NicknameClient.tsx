'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { predictNicknames } from '@/lib/utils';
import { NAMES_DB } from '@/data';
import { ArrowLeft, Tag, Copy, Plus } from 'lucide-react';

export default function NicknamesPredictorPage() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');

  // Find DB entry for richer suggestions
  const dbName = NAMES_DB.find(n => n.name.toLowerCase() === firstName.trim().toLowerCase());

  const generatedNicknames = predictNicknames(firstName, middleName, lastName, dbName);
  const hasContent = firstName.length > 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in min-h-screen">
      <Link href="/tools" className="flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors font-medium group">
         <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Tools
      </Link>

      <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-teal-50 text-teal-600 text-sm font-bold mb-6 border border-teal-100">
             <Tag size={14} /> Nickname Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Nickname Predictor</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
             Instantly generate cute, cool, and clever nicknames based on first names, middle names, and initials.
          </p>
       </div>

       <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-b from-gray-50 to-white p-8 md:p-10 border-b border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">First Name</label>
                   <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="e.g. Katherine"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg font-medium group-hover:border-gray-300"
                   />
                </div>
                <div className="group">
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Middle Name (Opt)</label>
                   <input
                      type="text"
                      value={middleName}
                      onChange={e => setMiddleName(e.target.value)}
                      placeholder="e.g. Rose"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg font-medium group-hover:border-gray-300"
                   />
                </div>
                <div className="group">
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Last Name (Opt)</label>
                   <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="e.g. Pierce"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg font-medium group-hover:border-gray-300"
                   />
                </div>
             </div>
          </div>

          <div className="p-8 md:p-14 min-h-[300px]">
            {hasContent ? (
               <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
                     <span className="bg-teal-100 p-2 rounded-xl text-teal-600"><Tag size={24}/></span>
                     Found {generatedNicknames.length} Suggestions
                  </h3>

                  <div className="flex flex-wrap justify-center gap-4">
                     {generatedNicknames.map((nick, idx) => (
                        <div
                           key={idx}
                           className="group relative bg-white border border-gray-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 rounded-2xl px-6 py-3 transition-all cursor-pointer select-none"
                           onClick={() => copyToClipboard(nick)}
                        >
                           <span className="text-xl font-bold text-gray-700 group-hover:text-teal-600 transition-colors">{nick}</span>
                           <span className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-sm">
                              <Copy size={12} />
                           </span>
                        </div>
                     ))}

                     <button className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 text-gray-400 px-6 py-3 rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all">
                        <Plus size={18} /> Add Custom
                     </button>
                  </div>

                  <div className="mt-12 text-center text-sm text-gray-400">
                     Click any nickname to copy to clipboard
                  </div>
               </div>
            ) : (
               <div className="text-center text-gray-400 py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Tag size={32} className="opacity-20" />
                  </div>
                  <p className="text-lg font-medium">Enter a name above to start generating nicknames.</p>
               </div>
            )}
          </div>
       </div>
    </div>
  );
}
