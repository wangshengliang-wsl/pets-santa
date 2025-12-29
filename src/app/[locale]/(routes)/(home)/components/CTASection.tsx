"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/motion';
import {
  fadeIn,
  scaleIn,
  buttonPulse,
  textGlow
} from '@/components/motion';

interface CTASectionProps {
  onScrollToTop: () => void;
  onGoPricing: () => void;
}

// 背景脉动动画
const bgPulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.2, 0.3, 0.2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

const CTASection: React.FC<CTASectionProps> = ({ onScrollToTop, onGoPricing }) => {
  const t = useTranslations('cta');

  return (
    <section className="py-32 bg-slate-900 dark:bg-black text-white relative overflow-hidden transition-colors duration-300">
      {/* 背景脉动效果 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.3)_0%,_transparent_70%)]"
        variants={bgPulseVariants}
        animate="animate"
      />

      {/* 装饰光圈 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <ScrollReveal>
          <motion.div variants={fadeIn}>
            {/* 标题 - 发光效果 */}
            <motion.h2
              className="text-5xl font-bold mb-6 festive-font"
              variants={textGlow}
              initial="initial"
              animate="animate"
            >
              {t('title')}
            </motion.h2>

            <motion.p
              className="text-xl text-slate-400 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {t('subtitle')}
            </motion.p>

            {/* 按钮组 */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* 主按钮 - 脉动圈效果 */}
              <motion.div className="relative w-full sm:w-auto">
                {/* 脉动光圈 */}
                <motion.div
                  className="absolute inset-0 bg-red-600 rounded-full"
                  variants={buttonPulse}
                  initial="initial"
                  animate="animate"
                />
                <motion.button
                  onClick={onScrollToTop}
                  className="relative w-full sm:w-auto px-12 py-5 bg-red-600 text-white rounded-full font-bold text-xl shadow-2xl shadow-red-900/40"
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: "0 30px 60px -12px rgba(220, 38, 38, 0.5)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('uploadGenerate')}
                </motion.button>
              </motion.div>

              {/* 次按钮 */}
              <motion.button
                onClick={onGoPricing}
                className="w-full sm:w-auto px-12 py-5 bg-transparent border-2 border-slate-700 dark:border-slate-600 text-white rounded-full font-bold text-xl transition-colors"
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  color: "rgba(15, 23, 42, 1)",
                  borderColor: "rgba(255, 255, 255, 1)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {t('seePricing')}
              </motion.button>
            </motion.div>

            <motion.p
              className="mt-10 text-slate-500 font-medium tracking-wide"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {t('noCreditCard')}
            </motion.p>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
