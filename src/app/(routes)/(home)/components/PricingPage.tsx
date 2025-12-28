"use client";

import React from 'react';

interface PricingPageProps {
  onPlanSelect: (plan: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onPlanSelect }) => {
  const plans = [
    { 
      name: 'Trial Pack', 
      price: '$0', 
      sub: '', 
      desc: 'Try it out with a few free portraits.', 
      features: ['2 Holiday Credits', 'Standard quality downloads', 'Limited styles', 'No credit card required'], 
      button: 'Claim Free Credits', 
      primary: false 
    },
    { 
      name: 'Holiday Pack', 
      price: '$9.99', 
      sub: '', 
      desc: 'Perfect for sharing with family and friends.', 
      features: ['10 Holiday Credits', 'High-quality downloads', 'All Christmas styles', 'Priority generation', 'No expiration'], 
      button: 'Buy 10 Credits', 
      primary: true 
    },
    { 
      name: 'Studio Pack', 
      price: '$24.99', 
      sub: '', 
      desc: 'For pet lovers who want all the options.', 
      features: ['30 Holiday Credits', 'Bulk generation', 'Commercial-friendly usage', '24/7 Priority Support', 'No expiration'], 
      button: 'Buy 30 Credits', 
      primary: false 
    }
  ];

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-6 festive-font">Pricing</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">One-time purchase credit packs. No subscriptions, just holiday fun.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border flex flex-col h-full transform transition-all hover:shadow-2xl ${plan.primary ? 'border-red-500 dark:border-red-600 scale-105 z-10' : 'border-slate-100 dark:border-slate-800'}`}>
              {plan.primary && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full shadow-xl">Best Value</div>}
              <div className="mb-10">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{plan.desc}</p>
              </div>
              <div className="mb-10">
                <span className="text-6xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">One-time payment</div>
              </div>
              <ul className="space-y-5 mb-12 flex-grow">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-medium">
                    <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onPlanSelect(plan.name)} className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${plan.primary ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-red-900/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                {plan.button}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center text-slate-400 text-sm italic">
          Need custom volume? <button className="text-red-600 dark:text-red-400 font-bold hover:underline">Contact us</button> for bulk rates.
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

