"use client";

import React from 'react';
import { Creation } from '../types';

interface MyCreationsPageProps {
  creations: Creation[];
}

const MyCreationsPage: React.FC<MyCreationsPageProps> = ({ creations }) => (
  <div className="py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-16 festive-font">My Creations</h1>
      {creations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="text-8xl mb-8 opacity-20">📸</div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">No creations yet</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Go to the homepage and create your first festive portrait!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {creations.map((c) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-xl transition-all">
              <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
                <img src={c.generatedImage} alt={c.style} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-xl text-[10px] font-bold text-red-600 dark:text-red-400 uppercase shadow-md tracking-widest">{c.style}</div>
              </div>
              <div className="p-6 flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{c.date}</span>
                <button 
                  onClick={() => { const link = document.createElement('a'); link.href = c.generatedImage; link.download = `pet-${c.id}.png`; link.click(); }}
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default MyCreationsPage;

