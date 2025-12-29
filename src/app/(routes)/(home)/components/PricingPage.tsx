"use client";

import React, { useState, useEffect } from 'react';

interface PricingPageProps {
  onPlanSelect: (plan: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onPlanSelect, isLoggedIn, onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<{ stripePublishableKey: string; priceId: string } | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const plan = { 
    name: 'Holiday Pack', 
    price: '$20', 
    originalPrice: '', 
    desc: 'Perfect for sharing with family and friends. Get 200 credits for AI pet portraits.', 
    features: [
      '200 Holiday Credits',
      'High-quality downloads',
      'All Christmas styles',
      'Priority generation',
      'No expiration',
      'Commercial-friendly usage'
    ], 
    button: 'Buy 200 Credits', 
    credits: 200,
  };

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

      // 跳转到 Stripe Checkout
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
    <div className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-6 festive-font">Pricing</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">One-time purchase. No subscriptions, just holiday fun.</p>
        </div>

        {/* Single Pricing Card */}
        <div className="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border-2 border-red-500 dark:border-red-600 transform transition-all hover:shadow-3xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-sm font-bold uppercase tracking-widest px-8 py-2.5 rounded-full shadow-xl">
            🎄 Best Value
          </div>
          
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">{plan.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md mx-auto">{plan.desc}</p>
            </div>
            
            <div className="mb-10">
              <div className="flex items-center justify-center gap-3">
                <span className="text-7xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
              </div>
              <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-3">One-time payment</div>
              <div className="mt-4 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                <span>🎁</span>
                <span>{plan.credits} Credits Included</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10 max-w-lg mx-auto">
              {plan.features.map((f, j) => (
                <div key={j} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium text-left">
                  <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handlePurchase}
              disabled={isLoading}
              className={`w-full max-w-md mx-auto py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-red-900/20 transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>💳</span>
                  <span>{plan.button}</span>
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </span>
              <span>•</span>
              <span>Powered by Stripe</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-slate-400 text-sm italic">
          Need custom volume? <button className="text-red-600 dark:text-red-400 font-bold hover:underline">Contact us</button> for bulk rates.
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
