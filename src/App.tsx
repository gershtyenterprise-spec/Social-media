/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  Send, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Video, 
  Copy, 
  Check, 
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Platform = 'instagram' | 'tiktok' | 'twitter' | 'linkedin';

interface GeneratedContent {
  caption: string;
  hashtags: string[];
  hooks: string[];
  strategy: string;
}

export default function App() {
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'tiktok', name: 'TikTok', icon: Video, color: 'text-black', bg: 'bg-gray-100' },
    { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: 'text-blue-400', bg: 'bg-blue-50' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50' },
  ] as const;

  const generateContent = async () => {
    if (!productName || !productDesc) return;

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      
      const prompt = `
        You are a world-class social media marketing expert. 
        Generate a viral promotion strategy and content for the following product:
        
        Product Name: ${productName}
        Description: ${productDesc}
        Target Audience: ${targetAudience || 'General'}
        Platform: ${platform}
        
        Please provide the response in a structured JSON format with the following keys:
        - caption: A high-converting, engaging caption for the post.
        - hashtags: An array of 10-15 trending and relevant hashtags.
        - hooks: An array of 3 "viral hooks" or opening lines to grab attention.
        - strategy: A brief (2-3 sentences) strategy on how to make this post go viral (e.g., timing, engagement tactics).
        
        Make the tone appropriate for ${platform}. 
        For Instagram/TikTok, focus on visual storytelling and trends.
        For Twitter, focus on punchy, shareable text.
        For LinkedIn, focus on professional value and insights.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
      
      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="border-b border-black/5 px-6 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <TrendingUp size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">ViralFlow<span className="text-emerald-500">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-black transition-colors">Features</a>
            <a href="#" className="hover:text-black transition-colors">Pricing</a>
            <a href="#" className="hover:text-black transition-colors">Community</a>
            <button className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all active:scale-95">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Input */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-[0.9] tracking-tight">
                Turn your product <br />
                <span className="text-emerald-500 italic">into a sensation.</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-md">
                Generate high-converting social media content that drives views, followers, and sales in seconds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl shadow-black/[0.02] space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block">
                  1. Choose Platform
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                        platform === p.id 
                          ? "border-emerald-500 bg-emerald-50/50 shadow-sm" 
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      )}
                    >
                      <p.icon className={cn("w-6 h-6", platform === p.id ? "text-emerald-600" : p.color)} />
                      <span className="text-xs font-semibold">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block">
                  2. Product Details
                </label>
                <div className="space-y-4">
                  <input 
                    type="text"
                    placeholder="Product Name (e.g., Eco-Friendly Yoga Mat)"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  />
                  <textarea 
                    placeholder="What makes it special? (e.g., Made from recycled ocean plastic, non-slip grip, beautiful patterns)"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                  />
                  <input 
                    type="text"
                    placeholder="Target Audience (e.g., Yoga enthusiasts, eco-conscious shoppers)"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={generateContent}
                disabled={loading || !productName || !productDesc}
                className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-[0.98]"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" />
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Viral Content
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    referrerPolicy="no-referrer"
                    alt="User"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Joined by <span className="font-bold text-black">2,000+</span> creators this week
              </p>
            </div>
          </motion.div>

          {/* Right Column: Results */}
          <div className="relative min-h-[600px]">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                    <Zap size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ready to go viral?</h3>
                  <p className="text-gray-400 max-w-xs">
                    Fill in your product details and choose a platform to see the magic happen.
                  </p>
                </motion.div>
              ) : loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/[0.02]"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 animate-pulse" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mt-8 mb-2">Crafting your strategy...</h3>
                  <p className="text-gray-400">Analyzing trends and audience behavior</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  ref={resultRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Viral Hooks */}
                  <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-2xl shadow-black/[0.02] space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="text-yellow-500" size={20} />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Viral Hooks</h3>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {result?.hooks.map((hook, i) => (
                        <div key={i} className="group relative bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-emerald-200 transition-all">
                          <p className="text-sm font-medium pr-10 italic">"{hook}"</p>
                          <button 
                            onClick={() => copyToClipboard(hook, `hook-${i}`)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                          >
                            {copied === `hook-${i}` ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Caption */}
                  <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-2xl shadow-black/[0.02] space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="text-emerald-500" size={20} />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">The Content</h3>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(result?.caption || '', 'caption')}
                        className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        {copied === 'caption' ? <Check size={14} /> : <Copy size={14} />}
                        {copied === 'caption' ? 'COPIED' : 'COPY ALL'}
                      </button>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                      <Markdown>{result?.caption}</Markdown>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4">
                      {result?.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strategy */}
                  <div className="bg-emerald-900 text-white p-8 rounded-[40px] shadow-2xl shadow-emerald-200 space-y-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Growth Strategy</h3>
                    </div>
                    <p className="text-emerald-50/90 leading-relaxed">
                      {result?.strategy}
                    </p>
                    <div className="pt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold">
                        <Users size={14} />
                        Target: {targetAudience || 'General'}
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold">
                        <ShoppingBag size={14} />
                        Product: {productName}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-32 grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "AI Viral Hooks", 
              desc: "Stop the scroll with psychologically proven opening lines tailored to your product.",
              icon: Zap,
              color: "bg-yellow-500"
            },
            { 
              title: "Platform Optimized", 
              desc: "Whether it's TikTok trends or LinkedIn insights, we adapt the tone perfectly.",
              icon: Send,
              color: "bg-blue-500"
            },
            { 
              title: "Growth Strategies", 
              desc: "Get more than just text. Receive actionable tips on how to maximize reach.",
              icon: TrendingUp,
              color: "bg-emerald-500"
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-black/5 hover:shadow-xl transition-all group">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform", feature.color)}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="mt-32 bg-black rounded-[40px] p-12 lg:p-20 text-center text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Ready to scale your brand?</h2>
            <p className="text-gray-400 text-lg">
              Join thousands of entrepreneurs using ViralFlow AI to dominate social media.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                View Case Studies
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 px-6 py-12 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <TrendingUp size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">ViralFlow<span className="text-emerald-500">AI</span></span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 ViralFlow AI. All rights reserved. Built for creators.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
