'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { checkFlow } from '@/lib/utils';
import { ArrowLeft, Activity, Star } from 'lucide-react';

export default function SurnameClient() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const flowData = checkFlow(firstName, lastName);
  const hasContent = firstName.length > 0 && lastName.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in min-h-screen">
      <Link href="/tools" className="flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors font-medium group">
         <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Tools
      </Link>

      <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 border border-blue-100">
             <Activity size={14} /> Compatibility Check
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Surname Flow Checker</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
             Test the rhythm and flow between a first name and surname. We analyze syllables, ending sounds, and cadence.
          </p>
       </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="group">
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">First Name</label>
                          <input
                             type="text"
                             value={firstName}
                             onChange={e => setFirstName(e.target.value)}
                             placeholder="e.g. Oliver"
                             className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg font-medium"
                          />
                       </div>
                       <div className="group">
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Surname</label>
                          <input
                             type="text"
                             value={lastName}
                             onChange={e => setLastName(e.target.value)}
                             placeholder="e.g. Twist"
                             className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg font-medium"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 h-full flex flex-col justify-center min-h-[300px]">
                    {hasContent ? (
                       <div className="text-center animate-slide-up">
                          <div className="text-6xl font-bold text-gray-900 mb-2">{flowData.score}<span className="text-gray-300 text-4xl">/5</span></div>
                          <div className="flex justify-center gap-2 mb-6 text-yellow-400">
                             {[1,2,3,4,5].map(s => <Star key={s} size={24} className={s <= flowData.score ? 'fill-current' : 'text-gray-200'} />)}
                          </div>

                          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-8 ${
                             flowData.score >= 4 ? 'bg-green-100 text-green-700' :
                             flowData.score === 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                             {flowData.score >= 5 ? 'Perfect Match' : flowData.score >= 4 ? 'Great Flow' : flowData.score === 3 ? 'Good' : 'Needs Work'}
                          </div>

                          <div className="text-left space-y-3">
                             {flowData.details.map((detail: { type: string; title: string; desc: string }, i: number) => (
                                <div key={i} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                   <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                      detail.type === 'good' ? 'bg-green-500' :
                                      detail.type === 'warn' ? 'bg-amber-500' : 'bg-gray-300'
                                   }`}></div>
                                   <div>
                                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{detail.title}</p>
                                      <p className="text-sm text-gray-700">{detail.desc}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    ) : (
                       <div className="text-center text-gray-400">
                          <Activity size={48} className="mx-auto mb-4 opacity-20" />
                          <p>Enter both names to calculate their compatibility score.</p>
                       </div>
                    )}
                 </div>
              </div>
            </div>
      </div>
    </div>
  );
}
