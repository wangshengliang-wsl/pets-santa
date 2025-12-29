"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface CreditDetails {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  creditsGranted: number;
  description: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

interface BillingPageProps {
  onGoPricing: () => void;
}

const BillingPage: React.FC<BillingPageProps> = ({ onGoPricing }) => {
  const searchParams = useSearchParams();
  const t = useTranslations('billing');
  const tCommon = useTranslations('common');
  const [credits, setCredits] = useState<CreditDetails | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // 检查是否是支付成功后的跳转
    if (searchParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      // 5秒后隐藏成功消息
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/billing');

      if (!response.ok) {
        if (response.status === 401) {
          setError(t('pleaseLogin'));
          return;
        }
        throw new Error('Failed to fetch billing data');
      }

      const data = await response.json();
      setCredits(data.credits);
      setPayments(data.payments);
      setTransactions(data.transactions);
    } catch (err) {
      console.error('Billing fetch error:', err);
      setError(t('failedToLoad'));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return statusStyles[status] || statusStyles.pending;
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: t('completed'),
      pending: t('pending'),
      failed: t('failed'),
    };
    return statusMap[status] || status;
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return '💰';
      case 'usage':
        return '🎨';
      case 'refund':
        return '↩️';
      case 'bonus':
        return '🎁';
      default:
        return '📝';
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{error}</h2>
            <button
              onClick={fetchBillingData}
              className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              {tCommon('tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎉</div>
              <div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300">{tCommon('success')}!</h3>
                <p className="text-green-700 dark:text-green-400">{t('creditsAdded')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4 festive-font">{t('title')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('manageCredits')}</p>
        </div>

        {/* Credit Balance Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">{t('currentCredits')}</h2>
              <div className="flex items-center gap-3">
                <span className="text-5xl">🎨</span>
                <span className="text-6xl font-bold text-slate-900 dark:text-white">
                  {credits?.balance || 0}
                </span>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('totalEarned')}</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{credits?.totalEarned || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('totalSpent')}</div>
                <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                  -{credits?.totalSpent || 0}
                </div>
              </div>
            </div>

            <button
              onClick={onGoPricing}
              className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-red-900/20 transform hover:-translate-y-1"
            >
              {t('buyMoreCredits')}
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('purchaseHistory')}</h2>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💳</div>
              <p className="text-slate-500 dark:text-slate-400">{t('noPurchases')}</p>
              <button
                onClick={onGoPricing}
                className="mt-4 text-red-600 dark:text-red-400 font-semibold hover:underline"
              >
                {t('startCreating')} →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xl">
                      💰
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {payment.description}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatAmount(payment.amount, payment.currency)}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        +{payment.creditsGranted} {tCommon('credits')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credit Usage History */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('creditUsage')}</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-slate-500 dark:text-slate-400">{t('noTransactions')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTransactionTypeIcon(transaction.type)}</span>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t('balance')}: {transaction.balanceAfter}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
