"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  floatRotate
} from '@/components/motion';

const CHECK_ITEM_KEYS = ['holidayCards', 'socialPosts', 'allPets'];

const AboutSection = () => {
  const t = useTranslations('about');

  return (
    <section className="py-24 bg-red-600 dark:bg-red-700 text-white transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* 左侧内容 - 从左滑入 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInLeft}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-bold mb-8 festive-font"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="text-red-100 text-xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('description')}
          </motion.p>

          {/* 列表项 - 错开入场 */}
          <motion.div
            className="grid gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {CHECK_ITEM_KEYS.map((key, i) => (
              <motion.div
                key={key}
                className="flex items-center gap-4"
                variants={staggerItem}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
              >
                <motion.span
                  className="w-8 h-8 bg-white/20 flex items-center justify-center rounded-full text-white text-sm"
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  ✓
                </motion.span>
                <span className="text-lg font-medium">{t(`features.${key}`)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* 右侧图片区域 - 从右滑入 */}
        <motion.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInRight}
        >
          <motion.div
            className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.4 }
            }}
          >
            <motion.img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"
              alt="Dog Portrait"
              className="w-full h-full object-cover"
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.6 }
              }}
            />
          </motion.div>

          {/* 悬浮装饰卡片 */}
          <motion.div
            className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-slate-900 dark:text-white border border-slate-50 dark:border-slate-700"
            variants={floatRotate}
            initial="initial"
            animate="animate"
            whileHover={{
              scale: 1.05,
              rotate: 0,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div
              className="text-3xl mb-3"
              animate={{
                rotate: [0, 10, -10, 0],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              🎁
            </motion.div>
            <div className="font-bold text-xl">{t('instantMagic')}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t('perfectGift')}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
