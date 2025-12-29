"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/motion';
import {
  fadeIn,
  staggerContainer,
  staggerCard,
  hoverLift
} from '@/components/motion';

const FEATURE_KEYS = [
  { key: 'oneClick', icon: '👘' },
  { key: 'holidayScenes', icon: '🕯️' },
  { key: 'highQuality', icon: '💎' },
  { key: 'multipleStyles', icon: '🎨' },
  { key: 'fastSimple', icon: '⚡' },
  { key: 'privateDefault', icon: '🛡️' }
];

const Features: React.FC = () => {
  const t = useTranslations('features');

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 - 淡入动画 */}
        <ScrollReveal className="text-center mb-16">
          <motion.div variants={fadeIn}>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('title')}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </ScrollReveal>

        {/* 卡片网格 - 错开入场动画 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {FEATURE_KEYS.map((feature, i) => (
            <motion.div
              key={i}
              variants={staggerCard}
              whileHover={{
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.3 }
              }}
              className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors group cursor-default"
            >
              {/* 图标 - hover 缩放旋转 */}
              <motion.div
                className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-100 dark:border-slate-600 transition-colors"
                whileHover={{
                  scale: 1.15,
                  rotate: 8,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {t(`${feature.key}.title`)}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(`${feature.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
