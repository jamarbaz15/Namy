'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Plus, X, Sparkles, Check } from 'lucide-react';
import { NAMES_DB } from '@/data';
import { getSiblingSuggestions, SiblingSuggestion } from '@/lib/utils';

export default function SiblingClient() {
  const [currentInput, setCurrentInput] = useState('');
  const [siblings, setSiblings] = useState<string[]>([]);
  const [targetGender, setTargetGender] = useState<'boy' | 'girl' | 'any'>('any');

  const suggestions: SiblingSuggestion[] = getSiblingSuggestions(siblings, targetGender, NAMES_DB);

  const addSibling = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentInput.trim()) {
      if (siblings.length >= 5) {
         alert("Max 5 siblings supported.");
         return;
      }
      setSiblings([...siblings, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const removeSibling = (index: number) => {
    const newSiblings = [...siblings];
    newSiblings.splice(index, 1);
    setSiblings(newSiblings);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in min-h-screen">
      <Link href="/tools" className="flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors font-medium group">
         <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Tools
      </Link>

      <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-50 text-pink-600 text-sm font-bold mb-6 border border-pink-100">
             <Users size={14} /> Sibling Matcher
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Sibling Name Harmony</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
             Find the perfect name that matches style, origin, and flow using our advanced harmony algorithm.
          </p>
       </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
             <div className="p-8 md:p-14">
                {/* Input Section */}
                <div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-12">
                   <div className="mb-8">
                     <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Current Children</label>

                     <div className="flex flex-wrap gap-2 mb-3">
                        {siblings.map((sib, i) => (
                           <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-800 font-bold animate-fade-in">
                              {sib}
                              <button 
                                onClick={() => removeSibling(i)} 
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                aria-label={`Remove ${sib}`}
                              >
                                 <X size={14} />
                              </button>
                           </span>
                        ))}
                     </div>

                     <form onSubmit={addSibling} className="relative">
                        <input
                           type="text"
                           value={currentInput}
                           onChange={e => setCurrentInput(e.target.value)}
                           placeholder={siblings.length === 0 ? "e.g. Emma" : "Add another..."}
                           className="w-full px-5 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-lg font-medium bg-white"
                        />
                        <button
                           type="submit"
                           disabled={!currentInput.trim()}
                           className="absolute right-2 top-2 bottom-2 aspect-square bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                           <Plus size={20} />
                        </button>
                     </form>
                     <p className="text-xs text-gray-400 mt-2 ml-1">Type a name and press Enter to add</p>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">I&apos;m looking for a...</label>
                      <div className="grid grid-cols-3 gap-3">
                         <button
                           onClick={() => setTargetGender('boy')}
                           className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${targetGender === 'boy' ? 'bg-blue-500 text-white border-blue-500 shadow-md transform scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'}`}
                         >
                           Boy
                         </button>
                         <button
                           onClick={() => setTargetGender('girl')}
                           className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${targetGender === 'girl' ? 'bg-pink-500 text-white border-pink-500 shadow-md transform scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-pink-300'}`}
                         >
                           Girl
                         </button>
                         <button
                           onClick={() => setTargetGender('any')}
                           className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${targetGender === 'any' ? 'bg-purple-500 text-white border-purple-500 shadow-md transform scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300'}`}
                         >
                           Surprise
                         </button>
                      </div>
                   </div>
                </div>

                {/* Results Section */}
                {siblings.length > 0 ? (
                   <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
                         <Sparkles className="text-yellow-400 fill-yellow-400" /> Best Matches
                      </h3>

                      {suggestions.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {suggestions.map((suggestion, idx) => (
                               <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                                  <div className={`absolute top-0 left-0 w-1 h-full ${suggestion.name.gender === 'male' ? 'bg-blue-400' : suggestion.name.gender === 'female' ? 'bg-pink-400' : 'bg-purple-400'}`}></div>

                                  <div className="flex justify-between items-start mb-4">
                                     <div>
                                        <h4 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{suggestion.name.name}</h4>
                                        <p className="text-sm text-gray-500">{suggestion.name.origins.join(', ')} &bull; {suggestion.name.meaning}</p>
                                     </div>
                                     <div className="flex flex-col items-end">
                                        <span className="text-2xl font-bold text-green-600">{Math.min(100, Math.round(suggestion.score))}%</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Match</span>
                                     </div>
                                  </div>

                                  <div className="space-y-2">
                                     {suggestion.reasons.map((reason, rIdx) => (
                                        <div key={rIdx} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                           <Check size={14} className="text-green-500" /> {reason}
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            ))}
                         </div>
                      ) : (
                         <div className="text-center p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                           <p className="text-gray-500">No strong matches found in our demo database. Try different genders or names!</p>
                         </div>
                      )}
                   </div>
                ) : (
                   <div className="text-center text-gray-400 py-8">
                      <Users size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-lg">Add your children&apos;s names above to see harmony suggestions.</p>
                   </div>
                )}
             </div>
      </div>
    </div>
  );
}
