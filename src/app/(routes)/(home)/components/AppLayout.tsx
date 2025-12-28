"use client";

import React from 'react';
import { Page, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppLayout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  setCurrentPage, 
  user, 
  onLogin, 
  onLogout,
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setCurrentPage('home')}
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">
                  🐾
                </div>
                <span className="festive-font text-2xl font-bold text-red-600 tracking-tight">Pets Santa</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-red-600' : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setCurrentPage('pricing')}
                  className={`text-sm font-medium transition-colors ${currentPage === 'pricing' ? 'text-red-600' : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500'}`}
                >
                  Pricing
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300 uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">{user.name}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                    <button 
                      onClick={() => setCurrentPage('my-creations')}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400"
                    >
                      My Creations
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                      Billing
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                    <button 
                      onClick={onLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={onLogin}
                  className="px-6 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 border-t border-slate-800 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🐾</span>
                <span className="festive-font text-2xl font-bold text-white">Pets Santa</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Make holiday portraits in seconds. Dress your furry friends in the best Christmas outfits with the power of AI.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-red-400 transition-colors">Home</button></li>
                <li><button onClick={() => setCurrentPage('pricing')} className="hover:text-red-400 transition-colors">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button className="hover:text-red-400 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-red-400 transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
            © {new Date().getFullYear()} Pets Santa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;

