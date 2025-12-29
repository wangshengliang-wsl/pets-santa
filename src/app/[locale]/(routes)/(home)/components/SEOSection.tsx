"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

const SEOSection = () => {
  const t = useTranslations('seo');

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">{t('title')}</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
          {t('description')}
        </p>
      </div>
    </section>
  );
};

export default SEOSection;
