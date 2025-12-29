"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/motion';
import {
  fadeIn,
  staggerContainer,
  staggerCard,
  scaleIn
} from '@/components/motion';

interface Creation {
  id: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  style: string;
  originalImageUrl: string;
  resultImageUrl: string | null;
  createdAt: string;
  completedAt: string | null;
}

// 空状态动画
const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

// 表情动画
const emojiVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -30 },
  visible: {
    opacity: 0.2,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
      delay: 0.2
    }
  }
};

const MyCreationsPage: React.FC = () => {
  const t = useTranslations('creations');
  const tCommon = useTranslations('common');
  const tStyles = useTranslations('styles');

  // Map English style label to translation key
  const getStyleLabel = (styleLabel: string): string => {
    const styleKeyMap: Record<string, string> = {
      'Santa Suit': 'santaSuit',
      'Elf Costume': 'elfCostume',
      'Reindeer Hoodie': 'reindeerHoodie',
      'Cozy Sweater': 'cozySweater',
      'Winter Wonderland': 'winterWonderland',
      'Gift Box Surprise': 'giftBoxSurprise'
    };
    const key = styleKeyMap[styleLabel];
    return key ? tStyles(key) : styleLabel;
  };

  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchCreations = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }

    try {
      const response = await fetch('/api/creations');
      if (!response.ok) {
        if (response.status === 401) {
          if (isMountedRef.current) {
            setError(t('pleaseLogin'));
          }
          return;
        }
        throw new Error('Failed to fetch creations');
      }

      const data = await response.json();

      if (!isMountedRef.current) {
        return;
      }

      const sortedCreations = data.creations.sort((a: Creation, b: Creation) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCreations(sortedCreations);
    } catch (err) {
      console.error('Failed to fetch creations:', err);
      if (isMountedRef.current) {
        setError(t('failedToLoad'));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchCreations();

    const interval = setInterval(() => {
      if (!isMountedRef.current) {
        clearInterval(interval);
        return;
      }

      setCreations((currentCreations) => {
        const hasPendingTasks = currentCreations.some(
          c => c.status === 'pending' || c.status === 'processing'
        );
        if (hasPendingTasks) {
          fetchCreations();
        }
        return currentCreations;
      });
    }, 5000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchCreations]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: Creation['status']) => {
    switch (status) {
      case 'pending':
        return (
          <motion.div
            className="absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 rounded-xl text-[10px] font-bold text-yellow-700 dark:text-yellow-400 uppercase shadow-md tracking-widest flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 400 }}
          >
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('queued')}
          </motion.div>
        );
      case 'processing':
        return (
          <motion.div
            className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-xl text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase shadow-md tracking-widest flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 400 }}
          >
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('generating')}
          </motion.div>
        );
      case 'failed':
        return (
          <motion.div
            className="absolute top-4 right-4 bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-xl text-[10px] font-bold text-red-700 dark:text-red-400 uppercase shadow-md tracking-widest"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 400 }}
          >
            {tCommon('failed')}
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-5xl font-bold text-slate-900 dark:text-white mb-16 festive-font"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('title')}
          </motion.h1>
          <motion.div
            className="flex items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-5xl font-bold text-slate-900 dark:text-white mb-16 festive-font"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('title')}
          </motion.h1>
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-slate-800 shadow-sm"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="text-8xl mb-8"
              variants={emojiVariants}
              initial="hidden"
              animate="visible"
            >
              😢
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {error}
            </motion.h2>
            <motion.button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                fetchCreations();
              }}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-full font-semibold shadow-lg shadow-red-200 dark:shadow-red-900/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {tCommon('tryAgain')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <motion.div
          className="flex items-center justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white festive-font">{t('title')}</h1>
          <motion.button
            onClick={fetchCreations}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </motion.svg>
            {tCommon('refresh')}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {creations.length === 0 ? (
            <motion.div
              key="empty"
              className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-slate-800 shadow-sm"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div
                className="text-8xl mb-8"
                variants={emojiVariants}
                initial="hidden"
                animate="visible"
              >
                📸
              </motion.div>
              <motion.h2
                className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t('noCreations')}
              </motion.h2>
              <motion.p
                className="text-slate-500 dark:text-slate-400 text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {t('goCreate')}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {creations.map((c, index) => (
                <motion.div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group"
                  variants={staggerCard}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
                    {c.status === 'success' && c.resultImageUrl ? (
                      <motion.img
                        src={c.resultImageUrl}
                        alt={c.style}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : c.status === 'pending' || c.status === 'processing' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <img
                          src={c.originalImageUrl}
                          alt="Original"
                          className="w-full h-full object-cover opacity-50"
                        />
                        <motion.div
                          className="absolute inset-0 bg-black/30 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mx-auto mb-3"></div>
                            <p className="text-white text-sm font-medium">
                              {c.status === 'pending' ? t('inQueue') : tCommon('generating')}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        className="w-full h-full flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="text-4xl mb-2"
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          ❌
                        </motion.div>
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">{t('generationFailed')}</p>
                      </motion.div>
                    )}

                    {c.status === 'success' && (
                      <motion.div
                        className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-xl text-[10px] font-bold text-red-600 dark:text-red-400 uppercase shadow-md tracking-widest"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {getStyleLabel(c.style)}
                      </motion.div>
                    )}

                    {getStatusBadge(c.status)}
                  </div>

                  <div className="p-6 flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                        {formatDate(c.createdAt)}
                      </span>
                      {c.status !== 'success' && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          {getStyleLabel(c.style)}
                        </span>
                      )}
                    </div>

                    {c.status === 'success' && c.resultImageUrl && (
                      <motion.button
                        onClick={() => {
                          try {
                            const link = document.createElement('a');
                            link.href = c.resultImageUrl!;
                            link.download = `pet-${c.id}.png`;
                            document.body.appendChild(link);
                            link.click();
                            setTimeout(() => {
                              try {
                                if (link.parentNode) {
                                  document.body.removeChild(link);
                                }
                              } catch (e) {
                                console.warn('Failed to remove download link:', e);
                              }
                            }, 100);
                          } catch (err) {
                            console.error('Download error:', err);
                          }
                        }}
                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(254, 226, 226, 1)",
                          color: "rgba(220, 38, 38, 1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyCreationsPage;
