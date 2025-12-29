"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/motion';
import {
  fadeIn,
  staggerContainer,
  staggerItem,
  accordionContent,
  arrowRotate
} from '@/components/motion';

const FAQ_KEYS = [
  'editingSkills',
  'bestPhotos',
  'howLong',
  'multipleStyles',
  'isFree',
  'storePhotos'
];

interface FAQItemProps {
  questionKey: string;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ questionKey, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('faq.questions');

  return (
    <motion.div
      className="border-b border-slate-100 dark:border-slate-800"
      variants={staggerItem}
      custom={index}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          className={`text-lg font-semibold transition-colors ${
            isOpen
              ? 'text-red-600 dark:text-red-400'
              : 'text-slate-900 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400'
          }`}
        >
          {t(`${questionKey}.q`)}
        </motion.span>
        <motion.span
          animate={isOpen ? "open" : "closed"}
          variants={arrowRotate}
          className={isOpen ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            variants={accordionContent}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            className="overflow-hidden"
          >
            <motion.p
              className="text-slate-600 dark:text-slate-400 leading-relaxed pb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {t(`${questionKey}.a`)}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ: React.FC = () => {
  const t = useTranslations('faq');

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 - 淡入动画 */}
        <ScrollReveal className="text-center mb-16">
          <motion.div variants={fadeIn}>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('title')}</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium">{t('subtitle')}</p>
          </motion.div>
        </ScrollReveal>

        {/* FAQ 列表 - 错开入场动画 */}
        <motion.div
          className="space-y-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {FAQ_KEYS.map((key, i) => (
            <FAQItem key={key} questionKey={key} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
