"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import BillingPage from './BillingPage';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';
import { Page, User } from '../types';
import { useSession, signOut } from '@/lib/auth/client';

interface PetsSantaAppProps {
  initialPage?: Page;
}

const PetsSantaApp: React.FC<PetsSantaAppProps> = ({ initialPage }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tCommon = useTranslations('common');

  // 根据路径确定初始页面
  const getInitialPage = (): Page => {
    if (initialPage) return initialPage;
    if (pathname === '/billing') return 'billing';
    if (pathname === '/pricing') return 'pricing';
    if (pathname === '/my-creations') return 'my-creations';
    if (pathname === '/privacy') return 'privacy';
    if (pathname === '/terms') return 'terms';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 使用 Better Auth 的 useSession 监听会话状态
  const { data: session, isPending } = useSession();

  // 将 Better Auth 的 User 映射到我们的本地 User 类型
  const mappedUser: User | null = session?.user ? {
    id: session.user.id,
    name: session.user.name || tCommon('defaultUserName'),
    email: session.user.email,
    plan: 'free'
  } : null;

  // 监听路径变化，同步页面状态
  useEffect(() => {
    const page = getInitialPage();
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, initialPage]);

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
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // 包装的 setCurrentPage，同时更新 URL
  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 更新 URL，但保持查询参数（如 success=true&session_id=xxx）
    const currentSearch = searchParams.toString();
    const queryString = currentSearch ? `?${currentSearch}` : '';
    
    const routes: Record<Page, string> = {
      'home': '/',
      'pricing': '/pricing',
      'my-creations': '/my-creations',
      'billing': '/billing',
      'privacy': '/privacy',
      'terms': '/terms',
    };
    
    const newPath = routes[page] || '/';
    router.push(`${newPath}${queryString}`);
  };

  const handleLogout = async () => {
    await signOut();
    handlePageChange('home');
  };

  // 图片生成完成后的回调（现在由后端保存，此函数仅用于通知）
  const handleNewCreation = (original: string, generated: string, style: string) => {
    // 数据现在保存在数据库中，这里只是一个通知
    console.log('New creation completed:', { original, generated, style });
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
      setCurrentPage={handlePageChange} 
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
          <CTASection onScrollToTop={scrollToTop} onGoPricing={() => handlePageChange('pricing')} />
        </>
      )}
      {currentPage === 'pricing' && (
        <PricingPage 
          onPlanSelect={(plan) => console.log(`Plan selected: ${plan}`)} 
          isLoggedIn={!!mappedUser}
          onLogin={() => setIsAuthModalOpen(true)}
        />
      )}
      {currentPage === 'my-creations' && <MyCreationsPage />}
      {currentPage === 'billing' && (
        <BillingPage onGoPricing={() => handlePageChange('pricing')} />
      )}
      {currentPage === 'privacy' && (
        <PrivacyPage onGoHome={() => handlePageChange('home')} />
      )}
      {currentPage === 'terms' && (
        <TermsPage onGoHome={() => handlePageChange('home')} />
      )}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AppLayout>
  );
};

export default PetsSantaApp;

