"use client";

import React from 'react';

interface CTASectionProps {
  onScrollToTop: () => void;
  onGoPricing: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onScrollToTop, onGoPricing }) => (
  <section className="py-32 bg-slate-900 dark:bg-black text-white relative overflow-hidden transition-colors duration-300">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.2)_0%,_transparent_70%)]"></div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <h2 className="text-5xl font-bold mb-6 festive-font">Ready to Make Your Pet&apos;s Christmas Portrait?</h2>
      <p className="text-xl text-slate-400 mb-12">Upload a photo and generate your first festive look in seconds.</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button onClick={onScrollToTop} className="w-full sm:w-auto px-12 py-5 bg-red-600 text-white rounded-full font-bold text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-900/40 transform hover:-translate-y-1">
          Upload & Generate
        </button>
        <button onClick={onGoPricing} className="w-full sm:w-auto px-12 py-5 bg-transparent border-2 border-slate-700 dark:border-slate-600 text-white rounded-full font-bold text-xl hover:bg-white hover:text-slate-900 hover:border-white transition-all">
          See Pricing
        </button>
      </div>
      <p className="mt-10 text-slate-500 font-medium tracking-wide">No credit card required to try.</p>
    </div>
  </section>
);

export default CTASection;

