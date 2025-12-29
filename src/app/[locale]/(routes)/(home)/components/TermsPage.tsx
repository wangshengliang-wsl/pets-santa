"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, staggerItem } from '@/components/motion/variants';

interface TermsPageProps {
  onGoHome: () => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onGoHome }) => {
  const t = useTranslations('legal');
  const tTerms = useTranslations('legal.terms');
  const tSections = useTranslations('legal.terms.sections');

  const sections = [
    'service',
    'account',
    'credits',
    'content',
    'prohibited',
    'liability',
    'changes',
    'contact'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Back button */}
        <motion.button
          variants={staggerItem}
          onClick={onGoHome}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors mb-8 group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToHome')}
        </motion.button>

        {/* Header */}
        <motion.div variants={fadeIn} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {tTerms('title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t('lastUpdated')}: December 2025
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          variants={staggerItem}
          className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8"
        >
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            {tTerms('intro')}
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section}
              variants={staggerItem}
              className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {tSections(`${section}.title`)}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tSections(`${section}.content`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          variants={staggerItem}
          className="mt-12 text-center text-slate-500 dark:text-slate-400 text-sm"
        >
          <p>Pets Santa - AI Christmas Pet Portraits</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsPage;
