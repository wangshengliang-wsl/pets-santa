"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface Creation {
  id: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  style: string;
  originalImageUrl: string;
  resultImageUrl: string | null;
  createdAt: string;
  completedAt: string | null;
}

const MyCreationsPage: React.FC = () => {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchCreations = useCallback(async () => {
    // 检查组件是否仍然挂载
    if (!isMountedRef.current) {
      return;
    }

    try {
      const response = await fetch('/api/creations');
      if (!response.ok) {
        if (response.status === 401) {
          if (isMountedRef.current) {
            setError('Please login to view your creations');
          }
          return;
        }
        throw new Error('Failed to fetch creations');
      }

      const data = await response.json();
      
      // 再次检查组件是否仍然挂载
      if (!isMountedRef.current) {
        return;
      }

      // 按创建时间倒序排列
      const sortedCreations = data.creations.sort((a: Creation, b: Creation) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCreations(sortedCreations);
    } catch (err) {
      console.error('Failed to fetch creations:', err);
      if (isMountedRef.current) {
        setError('Failed to load creations');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchCreations();

    // 每 5 秒刷新一次，检查是否有正在生成的任务完成
    const interval = setInterval(() => {
      if (!isMountedRef.current) {
        clearInterval(interval);
        return;
      }

      // 检查当前状态中是否有待处理的任务
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
          <div className="absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 rounded-xl text-[10px] font-bold text-yellow-700 dark:text-yellow-400 uppercase shadow-md tracking-widest flex items-center gap-1">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Queued
          </div>
        );
      case 'processing':
        return (
          <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-xl text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase shadow-md tracking-widest flex items-center gap-1">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating
          </div>
        );
      case 'failed':
        return (
          <div className="absolute top-4 right-4 bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-xl text-[10px] font-bold text-red-700 dark:text-red-400 uppercase shadow-md tracking-widest">
            Failed
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-16 festive-font">My Creations</h1>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-16 festive-font">My Creations</h1>
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="text-8xl mb-8 opacity-20">😢</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{error}</h2>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                fetchCreations();
              }}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white festive-font">My Creations</h1>
          <button
            onClick={fetchCreations}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        {creations.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="text-8xl mb-8 opacity-20">📸</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">No creations yet</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Go to the homepage and create your first festive portrait!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {creations.map((c) => (
              <div key={c.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-xl transition-all">
                <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
                  {c.status === 'success' && c.resultImageUrl ? (
                    <img 
                      src={c.resultImageUrl} 
                      alt={c.style} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : c.status === 'pending' || c.status === 'processing' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <img 
                        src={c.originalImageUrl} 
                        alt="Original" 
                        className="w-full h-full object-cover opacity-50" 
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mx-auto mb-3"></div>
                          <p className="text-white text-sm font-medium">
                            {c.status === 'pending' ? 'In queue...' : 'Generating...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20">
                      <div className="text-4xl mb-2">❌</div>
                      <p className="text-red-600 dark:text-red-400 text-sm font-medium">Generation failed</p>
                    </div>
                  )}
                  
                  {c.status === 'success' && (
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-xl text-[10px] font-bold text-red-600 dark:text-red-400 uppercase shadow-md tracking-widest">
                      {c.style}
                    </div>
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
                        {c.style}
                      </span>
                    )}
                  </div>
                  
                  {c.status === 'success' && c.resultImageUrl && (
                    <button 
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
                      className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCreationsPage;
