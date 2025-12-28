"use client";

import React from 'react';

const AboutSection = () => (
  <section className="py-24 bg-red-600 dark:bg-red-700 text-white transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 festive-font">Made for Pet Lovers, Built for the Holidays</h2>
        <p className="text-red-100 text-xl leading-relaxed mb-10">
          Pets helps you turn everyday pet photos into festive holiday portraits you&apos;ll actually want to share. No complicated tools—just upload and generate.
        </p>
        <div className="grid gap-6">
          {["Perfect for holiday cards and gifts", "Great for social posts and family sharing", "Works for dogs, cats, and other pets"].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-8 h-8 bg-white/20 flex items-center justify-center rounded-full text-white text-sm">✓</span>
              <span className="text-lg font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000" alt="Dog Portrait" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-slate-900 dark:text-white border border-slate-50 dark:border-slate-700">
          <div className="text-3xl mb-3">🎁</div>
          <div className="font-bold text-xl">Instant Magic</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Perfect gift for owners</div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;

