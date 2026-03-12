'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkInitials, checkFlow, generateMiddleName, analyzeLength } from '@/lib/utils';
import {
   Printer, Sparkles, RefreshCw, ArrowLeft,
   ShieldCheck, AlertTriangle, Type, Music, Ruler, CheckCircle, Info
} from 'lucide-react';

interface FullNameLookupResult {
  name: string;
  gender: 'male' | 'female' | 'unisex';
  meaning: string;
  origins: string[];
}

export default function FullNameClient() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [dbName, setDbName] = useState<FullNameLookupResult | null>(null);

  const fullName = `${firstName} ${middleName} ${lastName}`.trim();
  const initialsData = checkInitials(firstName, middleName, lastName);
  const flowData = checkFlow(firstName, lastName);
  const lengthData = analyzeLength(firstName, middleName, lastName);
  const normalizedFirstName = firstName.trim();
  const hasContent = firstName.length > 0 && lastName.length > 0;

  useEffect(() => {
    if (!normalizedFirstName) {
      setDbName(null);
      return;
    }

    setDbName(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/names/lookup?name=${encodeURIComponent(normalizedFirstName)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setDbName(null);
          return;
        }

        const data = await response.json() as { name: FullNameLookupResult | null };
        setDbName(data.name);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setDbName(null);
        }
      }
    }, 150);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [normalizedFirstName]);

  useEffect(() => {
    if (!saveMessage) return;

    const timeoutId = window.setTimeout(() => setSaveMessage(''), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [saveMessage]);

  const handleSaveFullName = () => {
    const normalizedFullName = fullName.replace(/\s+/g, ' ').trim();
    if (!normalizedFullName) return;

    try {
      const storageKey = 'namylab-saved-full-names';
      const savedRaw = localStorage.getItem(storageKey);
      const savedNames: string[] = savedRaw ? JSON.parse(savedRaw) : [];
      const nextSavedNames = [
        normalizedFullName,
        ...savedNames.filter((savedName) => savedName !== normalizedFullName),
      ].slice(0, 50);

      localStorage.setItem(storageKey, JSON.stringify(nextSavedNames));
      setSaveMessage('Saved to this browser');
    } catch {
      setSaveMessage('Unable to save right now');
    }
  };

  const handleSuggestMiddle = () => {
    const suggestion = generateMiddleName(firstName, lastName);
    setMiddleName(suggestion);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in min-h-screen">
       <Link href="/tools" className="flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors font-medium group">
         <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Tools
       </Link>

       <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-bold mb-6 border border-purple-100">
             <Sparkles size={14} /> Full Name Analyzer
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Full Name Preview</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
             Visualize how the full name looks in print, check initials for accidental words, and analyze the flow.
          </p>
       </div>

       <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          {/* Input Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white p-8 md:p-10 border-b border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">First Name</label>
                   <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="e.g. Alexander"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg font-medium group-hover:border-gray-300"
                   />
                </div>
                <div className="group relative">
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 flex justify-between items-center">
                     Middle Name
                     <button
                        onClick={handleSuggestMiddle}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold transition-colors"
                        title="Suggest a middle name based on flow"
                     >
                        <RefreshCw size={10} /> SUGGEST
                     </button>
                   </label>
                   <input
                      type="text"
                      value={middleName}
                      onChange={e => setMiddleName(e.target.value)}
                      placeholder="e.g. James"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg font-medium group-hover:border-gray-300"
                   />
                </div>
                <div className="group">
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Last Name</label>
                   <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="e.g. Smith"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg font-medium group-hover:border-gray-300"
                   />
                </div>
             </div>
          </div>

          {hasContent ? (
             <div className="p-8 md:p-12 animate-fade-in bg-slate-50">
                {/* Hero Name Display */}
                <div className="text-center mb-12 py-10 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                   <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

                   <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-4 tracking-tight relative z-10">
                      {fullName}
                   </h2>
                   <div className="flex justify-center gap-2 text-gray-400 text-sm font-medium tracking-widest uppercase relative z-10">
                      Full Name Preview
                   </div>
                </div>

                {/* Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                   {/* 1. INITIALS CHECK */}
                   <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                         <div className={`p-2.5 rounded-xl ${initialsData.warnings.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {initialsData.warnings.length > 0 ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                         </div>
                         <h3 className="font-bold text-gray-900">Initials Safety</h3>
                      </div>

                      <div className="flex-grow space-y-4">
                         {initialsData.warnings.length > 0 ? (
                           <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 mb-4">
                              {initialsData.warnings.map((w, i) => <p key={i}>{w}</p>)}
                           </div>
                         ) : (
                           <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                             <CheckCircle size={14} className="text-green-500" /> No negative words detected.
                           </p>
                         )}

                         <div className="space-y-2">
                           {initialsData.variations.map((v, i) => (
                             <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                                <span className="text-xs text-gray-400 font-bold uppercase">{v.label}</span>
                                <span className="font-mono font-bold text-gray-800 text-lg">{v.value}</span>
                             </div>
                           ))}
                         </div>
                      </div>
                   </div>

                   {/* 2. FLOW ANALYSIS */}
                   <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                            <Music size={20} />
                         </div>
                         <h3 className="font-bold text-gray-900">Surname Flow</h3>
                      </div>

                      <div className="flex-grow space-y-4">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Overall Score</span>
                            <span className={`font-bold ${flowData.score >= 4 ? 'text-green-600' : 'text-yellow-600'}`}>{flowData.score}/5</span>
                         </div>

                         <div className="space-y-3">
                           {flowData.details.map((detail: { type: string; title: string; desc: string }, i: number) => (
                              <div key={i} className={`text-sm p-3 rounded-xl border ${
                                 detail.type === 'good' ? 'bg-green-50 border-green-100 text-green-800' :
                                 detail.type === 'warn' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                                 'bg-gray-50 border-gray-100 text-gray-700'
                              }`}>
                                 <div className="font-bold text-xs uppercase mb-1 opacity-70">{detail.title}</div>
                                 {detail.desc}
                              </div>
                           ))}
                         </div>
                      </div>
                   </div>

                   {/* 3. LENGTH ANALYSIS */}
                   <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Ruler size={20} />
                         </div>
                         <h3 className="font-bold text-gray-900">Length Analysis</h3>
                      </div>

                      <div className="flex-grow space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="text-center p-3 bg-gray-50 rounded-xl">
                              <div className="text-2xl font-bold text-gray-900">{lengthData.charCount}</div>
                              <div className="text-xs text-gray-500 uppercase font-bold">Letters</div>
                           </div>
                           <div className="text-center p-3 bg-gray-50 rounded-xl">
                              <div className="text-2xl font-bold text-gray-900">{lengthData.syllableCount}</div>
                              <div className="text-xs text-gray-500 uppercase font-bold">Syllables</div>
                           </div>
                         </div>

                         <div className={`p-4 rounded-xl border ${
                            lengthData.type === 'warn' ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'
                         }`}>
                            <div className="flex items-center gap-2 mb-2">
                               <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                                  lengthData.type === 'warn' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'
                               }`}>
                                  {lengthData.assessment}
                               </span>
                            </div>
                            <p className="text-sm text-gray-600">{lengthData.advice}</p>
                         </div>
                      </div>
                   </div>

                </div>

                {/* Footer / Database Info */}
                {dbName && (
                  <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                     <div>
                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                           <Info size={16} className="text-gray-400" /> Database Insight
                        </h4>
                        <p className="text-sm text-gray-600">
                           <span className="font-bold">{firstName}</span> is primarily {dbName.gender}, meaning &quot;{dbName.meaning}&quot;.
                        </p>
                     </div>
                     <div className="flex gap-2">
                        {dbName.origins.map(o => (
                           <span key={o} className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{o}</span>
                        ))}
                     </div>
                  </div>
                )}

                <div className="mt-12 flex justify-center gap-4">
                   <button
                     onClick={handleSaveFullName}
                     className="flex items-center gap-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                   >
                      {saveMessage || 'Save Full Name'}
                   </button>
                   <button
                     onClick={() => window.print()}
                     className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors font-medium hover:bg-white px-6 py-3 rounded-full border border-transparent hover:border-gray-200"
                   >
                      <Printer size={20} /> Print
                   </button>
                </div>
             </div>
          ) : (
             <div className="p-20 text-center text-gray-400 bg-gray-50/30">
                <Type size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Enter a first and last name above to generate the full report.</p>
             </div>
          )}
       </div>
    </div>
  );
}

