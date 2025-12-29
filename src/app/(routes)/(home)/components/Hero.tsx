"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { STYLE_TEMPLATES } from '../constants';
import { StyleTemplate, User } from '../types';
import { useUpload } from '@/hooks/use-upload';

interface HeroProps {
  onGenerated: (original: string, generated: string, style: string) => void;
  user: User | null;
  onLogin: () => void;
}

interface TaskStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  resultImageUrl?: string;
  errorMessage?: string;
}

const Hero: React.FC<HeroProps> = ({ onGenerated, user, onLogin }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleTemplate>(STYLE_TEMPLATES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  
  const { upload, isUploading, error: uploadError, progress } = useUpload();

  // 清理轮询
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // 组件挂载和卸载时管理 isMounted 状态
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  // 轮询任务状态
  const pollTaskStatus = useCallback(async (taskId: string) => {
    // 检查组件是否仍然挂载
    if (!isMountedRef.current) {
      stopPolling();
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}/status`);
      if (!response.ok) {
        throw new Error('Failed to get task status');
      }

      const data: TaskStatus = await response.json();

      // 再次检查组件是否仍然挂载
      if (!isMountedRef.current) {
        stopPolling();
        return;
      }

      if (data.status === 'success' && data.resultImageUrl) {
        stopPolling();
        setResult(data.resultImageUrl);
        setIsGenerating(false);
        setGenerationStatus('');
        if (preview) {
          onGenerated(preview, data.resultImageUrl, selectedStyle.label);
        }
      } else if (data.status === 'failed') {
        stopPolling();
        setError(data.errorMessage || 'Generation failed. Please try again.');
        setIsGenerating(false);
        setGenerationStatus('');
      } else {
        // 更新状态显示
        setGenerationStatus(data.status === 'processing' ? 'Processing your image...' : 'Waiting in queue...');
      }
    } catch (err) {
      console.error('Polling error:', err);
      // 如果组件已卸载，停止轮询
      if (!isMountedRef.current) {
        stopPolling();
        return;
      }
      // 继续轮询，不停止
    }
  }, [stopPolling, preview, selectedStyle.label, onGenerated]);

  // 开始轮询
  const startPolling = useCallback((taskId: string) => {
    stopPolling();
    setCurrentTaskId(taskId);
    
    // 立即检查一次
    pollTaskStatus(taskId);
    
    // 每 3 秒检查一次
    pollingIntervalRef.current = setInterval(() => {
      pollTaskStatus(taskId);
    }, 3000);
  }, [stopPolling, pollTaskStatus]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError("File size too large. Max 10MB.");
        return;
      }
      setFile(selected);
      setError(null);
      
      // 创建本地预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
      
      // 上传到 Vercel Blob
      const result = await upload(selected);
      if (result) {
        setUploadedUrl(result.url);
        console.log('Uploaded to Vercel Blob:', result.url);
      } else if (uploadError) {
        setError(uploadError);
      }
    }
  };

  const handleGenerate = async () => {
    // 检查是否已登录
    if (!user) {
      onLogin();
      return;
    }

    if (!uploadedUrl) {
      setError("Please wait for the image to upload.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setGenerationStatus('Creating generation task...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadedUrl,
          prompt: selectedStyle.prompt,
          style: selectedStyle.label,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setError(`Insufficient credits. You need ${data.required} credits, but only have ${data.current}.`);
        } else if (response.status === 401) {
          onLogin();
          setError("Please login to generate images.");
        } else {
          setError(data.error || 'Failed to create generation task.');
        }
        setIsGenerating(false);
        setGenerationStatus('');
        return;
      }

      // 开始轮询任务状态
      setGenerationStatus('Waiting in queue...');
      startPolling(data.taskId);
    } catch (err: unknown) {
      console.error('Generation error:', err);
      setError("Something went wrong. Please try again.");
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  const reset = () => {
    stopPolling();
    setFile(null);
    setPreview(null);
    setUploadedUrl(null);
    setResult(null);
    setError(null);
    setCurrentTaskId(null);
    setGenerationStatus('');
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!user) {
      onLogin();
      return;
    }
    if (result) {
      try {
        const link = document.createElement('a');
        link.href = result;
        link.download = `christmas-pet-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        // 使用 setTimeout 确保 click 事件完成后再移除
        setTimeout(() => {
          try {
            if (link.parentNode) {
              document.body.removeChild(link);
            }
          } catch (e) {
            // 忽略移除失败的错误
            console.warn('Failed to remove download link:', e);
          }
        }, 100);
      } catch (err) {
        console.error('Download error:', err);
      }
    }
  };

  const handleShare = async () => {
    if (result) {
      try {
        if (navigator.share) {
          const blob = await (await fetch(result)).blob();
          const fileToShare = new File([blob], 'pet-portrait.png', { type: 'image/png' });
          await navigator.share({
            title: 'My Christmas Pet Portrait',
            text: 'Check out my pet in their holiday outfit! Made with Pets Santa.',
            files: [fileToShare],
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        }
      } catch (err) {
        console.error("Share failed", err);
      }
    }
  };

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-50 via-white to-green-50 dark:from-red-900/10 dark:via-slate-950 dark:to-green-900/10 opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              Create a <span className="text-red-600 dark:text-red-500 festive-font">Christmas Portrait</span> of Your Pet
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Upload a photo and instantly dress your pet in Santa, Elf, or Reindeer outfits—perfect for holiday cards.
            </p>

            <div className="flex flex-col gap-4 max-w-md mx-auto lg:mx-0">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {STYLE_TEMPLATES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all gap-1 ${
                      selectedStyle.id === style.id 
                      ? 'border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 shadow-md' 
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-red-200 dark:hover:border-red-900/50'
                    }`}
                  >
                    <span className="text-xl">{style.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tight truncate w-full px-1">{style.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !preview || isUploading}
                  className={`w-full py-4 rounded-full font-bold text-lg shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                    isGenerating || !preview || isUploading
                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none' 
                    : 'bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500 hover:-translate-y-1'
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {generationStatus || 'Generating...'}
                    </span>
                  ) : (
                    <>
                      {!user ? '🔐 Login to Generate' : 'Generate Christmas Look'}
                      {!user && <span className="text-xs opacity-75">(20 credits)</span>}
                    </>
                  )}
                </button>
                <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1 uppercase tracking-widest font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.9L10 1.554 17.834 4.9c.82.35 1.166 1.274 1.166 2.1V10c0 5.15-2.6 7.43-9 9-6.4-1.57-9-3.85-9-9V7c0-.826.346-1.75 1.166-2.1zM10 3.3l-5 2.14v4.56c0 3.32 1.4 5.09 5 6.4 3.6-1.31 5-3.08 5-6.4V5.44L10 3.3z" clipRule="evenodd" />
                    </svg>
                    20 credits per generation
                  </span>
                  <p>Best results with clear lighting and your pet centered.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-5 border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col transition-colors duration-300">
              {result ? (
                <div className="flex-grow flex flex-col animate-fade-in">
                  <div className="relative group rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square shadow-inner">
                    <img src={result} alt="Generated Portrait" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-widest">After</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <button onClick={handleDownload} className="col-span-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm">
                      Download
                    </button>
                    <button onClick={handleShare} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center text-sm">
                      Share
                    </button>
                    <button onClick={reset} className="col-span-3 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold py-2">
                      Generate another style
                    </button>
                  </div>
                </div>
              ) : preview ? (
                <div className="flex-grow flex flex-col animate-fade-in">
                  <div className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square shadow-inner">
                    <img src={preview} alt="Pet Preview" className="w-full h-full object-cover" />
                    <button onClick={reset} className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute top-4 left-4 bg-slate-900 dark:bg-slate-700 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-widest">Before</div>
                    
                    {/* 上传状态指示器 */}
                    {isUploading && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl p-3 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="animate-spin h-4 w-4 text-red-600" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Uploading...</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div 
                              className="bg-red-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 生成中状态指示器 */}
                    {isGenerating && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center max-w-xs">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{generationStatus || 'Generating...'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This may take 30-60 seconds</p>
                        </div>
                      </div>
                    )}
                    
                    {/* 上传成功指示器 */}
                    {uploadedUrl && !isUploading && !isGenerating && (
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-widest flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Ready
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    {uploadedUrl && !isUploading ? (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Photo uploaded! Ready to generate ✨</p>
                    ) : isUploading ? (
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Uploading your photo...</p>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium italic">Ready to spread holiday cheer? ✨</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-10 transition-colors hover:border-red-100 dark:hover:border-red-900/40 group">
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-red-600 dark:bg-red-600 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-red-700 dark:hover:bg-red-500 transition-all mb-4"
                  >
                    Upload pet photo
                  </button>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-widest">JPG / PNG • Up to 10MB</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              )}
              {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-xl text-center border border-red-100 dark:border-red-900/50 font-medium">{error}</div>}
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-2xl border border-slate-50 dark:border-slate-700 hidden md:block animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">🎄</div>
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white">New Styles</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">2024 Collection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
