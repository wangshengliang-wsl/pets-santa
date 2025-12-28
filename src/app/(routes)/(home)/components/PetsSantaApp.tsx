"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from './AppLayout';
import Hero from './Hero';
import Features from './Features';
import FAQ from './FAQ';
import AuthModal from './AuthModal';
import SEOSection from './SEOSection';
import AboutSection from './AboutSection';
import TestimonialSection from './TestimonialSection';
import CTASection from './CTASection';
import PricingPage from './PricingPage';
import MyCreationsPage from './MyCreationsPage';
import { Page, User, Creation } from '../types';
import { useSession, signOut } from '@/lib/auth/client';

const PetsSantaApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 使用 Better Auth 的 useSession 监听会话状态
  const { data: session, isPending } = useSession();

  // 将 Better Auth 的 User 映射到我们的本地 User 类型
  const mappedUser: User | null = session?.user ? {
    id: session.user.id,
    name: session.user.name || 'Pet Lover',
    email: session.user.email,
    plan: 'free'
  } : null;

  useEffect(() => {
    // Check for dark mode preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('pets_santa_creations');
    if (saved) setCreations(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('home');
  };

  const handleNewCreation = (original: string, generated: string, style: string) => {
    const newCreation: Creation = { 
      id: Math.random().toString(36).substr(2, 9), 
      originalImage: original, 
      generatedImage: generated, 
      style: style, 
      date: new Date().toLocaleDateString() 
    };
    const updated = [newCreation, ...creations];
    setCreations(updated);
    localStorage.setItem('pets_santa_creations', JSON.stringify(updated));
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-bounce text-4xl">🐾</div>
      </div>
    );
  }

  return (
    <AppLayout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
      user={mappedUser} 
      onLogin={() => setIsAuthModalOpen(true)} 
      onLogout={handleLogout}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    >
      {currentPage === 'home' && (
        <>
          <Hero onGenerated={handleNewCreation} user={mappedUser} onLogin={() => setIsAuthModalOpen(true)} />
          <SEOSection />
          <Features />
          <AboutSection />
          <TestimonialSection />
          <FAQ />
          <CTASection onScrollToTop={scrollToTop} onGoPricing={() => setCurrentPage('pricing')} />
        </>
      )}
      {currentPage === 'pricing' && <PricingPage onPlanSelect={(plan) => mappedUser ? alert(`Processing purchase for ${plan}...`) : setIsAuthModalOpen(true)} />}
      {currentPage === 'my-creations' && <MyCreationsPage creations={creations} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AppLayout>
  );
};

export default PetsSantaApp;

