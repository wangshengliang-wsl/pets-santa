"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/motion';
import {
  fadeIn,
  staggerContainer,
  staggerCard
} from '@/components/motion';

const TESTIMONIAL_KEYS = ['emma', 'lucas', 'nina'];
const AVATARS = {
  emma: "https://i.pravatar.cc/150?u=emma",
  lucas: "https://i.pravatar.cc/150?u=lucas",
  nina: "https://i.pravatar.cc/150?u=nina"
};

// 星级动画变体
const starVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 300,
      damping: 15
    }
  })
};

const TestimonialSection = () => {
  const t = useTranslations('testimonials');

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 - 淡入动画 */}
        <ScrollReveal className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold dark:text-white"
            variants={fadeIn}
          >
            {t('title')}
          </motion.h2>
        </ScrollReveal>

        {/* 评价卡片网格 - 错开入场动画 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {TESTIMONIAL_KEYS.map((key, i) => (
            <motion.div
              key={key}
              variants={staggerCard}
              whileHover={{
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.3 }
              }}
              className="bg-slate-50 dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 transition-colors group cursor-default"
            >
              {/* 星级评分 - 逐个出现动画 */}
              <motion.div
                className="flex gap-1 mb-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[...Array(5)].map((_, j) => (
                  <motion.span
                    key={j}
                    custom={j}
                    variants={starVariants}
                    className="text-yellow-400 text-lg"
                  >
                    ★
                  </motion.span>
                ))}
              </motion.div>

              {/* 评价文字 */}
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8 italic">
                &quot;{t(`items.${key}.text`)}&quot;
              </p>

              {/* 用户信息 */}
              <div className="flex items-center gap-4">
                <motion.img
                  src={AVATARS[key as keyof typeof AVATARS]}
                  alt={t(`items.${key}.author`)}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-600"
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white leading-tight">
                    {t(`items.${key}.author`)}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mt-1">
                    {t(`items.${key}.role`)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
