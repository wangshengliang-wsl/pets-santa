"use client";

import React from 'react';

const TestimonialSection = () => (
  <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center mb-16 dark:text-white">What Pet Owners Are Saying</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            text: "My cat looks incredible in the elf outfit—instant holiday vibe.", 
            author: "Emma", 
            role: "Cat Lover", 
            avatar: "https://i.pravatar.cc/150?u=emma" 
          },
          { 
            text: "We made Christmas portraits for our dog and rabbit. Super fun and easy.", 
            author: "Lucas", 
            role: "Dog Dad", 
            avatar: "https://i.pravatar.cc/150?u=lucas" 
          },
          { 
            text: "Perfect for our pet shop's holiday promo—customers loved it.", 
            author: "Nina", 
            role: "Shop Owner", 
            avatar: "https://i.pravatar.cc/150?u=nina" 
          }
        ].map((t, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-red-900/10 transition-all group">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400 text-lg">★</span>)}
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8 italic">&quot;{t.text}&quot;</p>
            <div className="flex items-center gap-4">
              <img 
                src={t.avatar} 
                alt={t.author} 
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-600 group-hover:scale-110 transition-transform" 
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white leading-tight">{t.author}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mt-1">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSection;

