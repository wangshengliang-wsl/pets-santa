"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/motion';
import {
  fadeIn,
  scaleIn,
  staggerContainer,
  staggerItem,
  buttonPulse
} from '@/components/motion';

interface PricingPageProps {
  onPlanSelect: (plan: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

// 价格数字动画
const priceVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
      delay: 0.3
    }
  }
};

// 卡片入场动画
const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

// 徽章弹出动画
const badgeVariants = {
  hidden: { opacity: 0, scale: 0, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 15,
      delay: 0.5
    }
  }
};

const FEATURE_KEYS = [
  'holidayCredits',
  'highQuality',
  'allStyles',
  'priorityGeneration',
  'noExpiration',
  'commercialUsage'
];

const PricingPage: React.FC<PricingPageProps> = ({ onPlanSelect, isLoggedIn, onLogin }) => {
  const t = useTranslations('pricing');
  const tCommon = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<{ stripePublishableKey: string; priceId: string } | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }

    if (!config?.priceId) {
      alert('Configuration not loaded. Please refresh the page.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: config.priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout URL not received');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 - 淡入动画 */}
        <ScrollReveal className="text-center mb-16">
          <motion.div variants={fadeIn}>
            <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-6 festive-font">{t('title')}</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('subtitle')}</p>
          </motion.div>
        </ScrollReveal>

        {/* 定价卡片 - 从下滑入 */}
        <motion.div
          className="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border-2 border-red-500 dark:border-red-600"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{
            y: -8,
            boxShadow: "0 40px 80px -20px rgba(220, 38, 38, 0.3)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Best Value 徽章 */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-sm font-bold uppercase tracking-widest px-8 py-2.5 rounded-full shadow-xl"
            variants={badgeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            🎄 {t('bestValue')}
          </motion.div>

          <div className="text-center">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">{t('holidayPack')}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md mx-auto">{t('packDescription')}</p>
            </motion.div>

            <motion.div
              className="mb-10"
              variants={priceVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-3">
                <motion.span
                  className="text-7xl font-bold text-slate-900 dark:text-white"
                  whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400 } }}
                >
                  $20
                </motion.span>
              </div>
              <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-3">{t('oneTimePayment')}</div>
              <motion.div
                className="mt-4 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  🎁
                </motion.span>
                <span>{t('creditsIncluded', { credits: 200 })}</span>
              </motion.div>
            </motion.div>

            {/* 功能列表 - 错开入场 */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-10 max-w-lg mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {FEATURE_KEYS.map((key, j) => (
                <motion.div
                  key={key}
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium text-left"
                  variants={staggerItem}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    ✓
                  </motion.span>
                  <span className="text-sm">{t(`features.${key}`)}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* 购买按钮 - 脉动效果 */}
            <motion.div
              className="relative w-full max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {!isLoading && (
                <motion.div
                  className="absolute inset-0 bg-red-600 rounded-2xl"
                  variants={buttonPulse}
                  initial="initial"
                  animate="animate"
                />
              )}
              <motion.button
                onClick={handlePurchase}
                disabled={isLoading}
                className={`relative w-full py-5 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-red-600 text-white shadow-xl shadow-red-200 dark:shadow-red-900/20'
                }`}
                whileHover={!isLoading ? {
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.2 }
                } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{tCommon('processing')}</span>
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    <span>{t('buyCredits')}</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t('secureCheckout')}
              </span>
              <span>•</span>
              <span>{t('poweredByStripe')}</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 text-center text-slate-400 text-sm italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {t('customVolume')}{' '}
          <motion.button
            className="text-red-600 dark:text-red-400 font-bold"
            whileHover={{ scale: 1.05, textDecoration: "underline" }}
          >
            {t('contactUs')}
          </motion.button>{' '}
          {t('bulkRates')}
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
