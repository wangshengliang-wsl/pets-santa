"use client";

import React from 'react';

const FEATURE_CARDS = [
  {
    title: "One-Click Christmas Outfits",
    desc: "Instantly transform your pet into Santa, Elf, or Reindeer styles.",
    icon: "👘"
  },
  {
    title: "Holiday Scenes & Props",
    desc: "Add trees, lights, gifts, snow, and cozy backgrounds automatically.",
    icon: "🕯️"
  },
  {
    title: "High-Quality Downloads",
    desc: "Get crisp images ready for printing and sharing on social media.",
    icon: "💎"
  },
  {
    title: "Multiple Styles from One Photo",
    desc: "Generate several looks and pick your favorite holiday masterpiece.",
    icon: "🎨"
  },
  {
    title: "Fast & Simple",
    desc: "Upload → generate → download. No design skills needed at all.",
    icon: "⚡"
  },
  {
    title: "Private by Default",
    desc: "Your images aren't public unless you choose to share them.",
    icon: "🛡️"
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Features</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to create festive pet portraits in seconds. Our AI handles the lighting, shadows, and composition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURE_CARDS.map((card, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl dark:hover:shadow-red-900/10 hover:-translate-y-1 transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-100 dark:border-slate-600 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

