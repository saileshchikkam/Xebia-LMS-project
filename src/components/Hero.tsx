import React, { useState } from 'react';
import { Search, Compass, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onSearch: (query: string) => void;
  onExploreCatalog: () => void;
}

export default function Hero({ onSearch, onExploreCatalog }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 py-16 sm:py-24" id="xebia-hero-container">
      {/* Visual background grids & shapes */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-xebia-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-xebia-orange/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Enterprise Partner Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 rounded-full bg-xebia-purple/15 border border-xebia-purple/30 px-4 py-1.5 mb-6 text-sm font-semibold text-purple-200"
          id="hero-enterprise-badge"
        >
          <ShieldCheck className="h-4 w-4 text-xebia-orange" />
          <span>Verified Xebia Enterprise Training Hub</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl"
          id="hero-main-title"
        >
          Scale Tech <span className="font-bold">Competencies</span> <br />
          <span className="font-serif italic text-purple-300 font-light block mt-3">
            With Xebia Academy Expert LMS
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 font-serif italic leading-relaxed"
          id="hero-description"
        >
          Equip your software delivery squads with high-end certifications in Cloud, DevOps, Agile Scrum, Generative AI, and Modern Frontend Architecture. Fully customizable enterprise pathways.
        </motion.p>

        {/* Interactive Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearchSubmit}
          className="mx-auto mt-10 max-w-xl flex flex-col sm:flex-row items-center gap-3 bg-slate-800/60 p-2 rounded-xl border border-slate-700/40 backdrop-blur-md shadow-xl"
          id="hero-search-form"
        >
          <div className="relative w-full flex-1">
            <Search className="absolute top-3.5 left-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Kubernetes, AWS, Scrum, React 19..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-sm font-medium"
              id="hero-search-input"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-xebia-purple hover:bg-xebia-purple/90 text-white font-bold text-xs px-6 py-3.5 rounded-lg transition-all shadow-md cursor-pointer"
            id="hero-search-submit-btn"
          >
            Find Courses
          </button>
        </motion.form>

        {/* Secondary Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
          id="hero-secondary-actions"
        >
          <span className="text-slate-400 text-xs">Or try exploring:</span>
          <button 
            type="button"
            onClick={onExploreCatalog} 
            className="text-xs font-semibold text-purple-300 hover:text-white underline decoration-xebia-orange underline-offset-4 cursor-pointer"
          >
            DevOps Paths
          </button>
          <span className="text-slate-700">•</span>
          <button 
            type="button"
            onClick={onExploreCatalog} 
            className="text-xs font-semibold text-purple-300 hover:text-white underline decoration-xebia-purple underline-offset-4 cursor-pointer"
          >
            Cloud Architectures
          </button>
          <span className="text-slate-700">•</span>
          <button 
            type="button"
            onClick={onExploreCatalog} 
            className="text-xs font-semibold text-purple-300 hover:text-white underline decoration-xebia-orange underline-offset-4 cursor-pointer"
          >
            Agile Frameworks
          </button>
        </motion.div>

        {/* Real-time Learning Statistics */}
        <div className="mx-auto mt-16 max-w-5xl border-t border-slate-800 pt-10" id="hero-stats-row">
          <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 text-center">
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="px-4"
            >
              <div className="flex justify-center mb-2">
                <div className="rounded-lg bg-xebia-purple/10 p-2 border border-xebia-purple/20">
                  <BookOpen className="h-5 w-5 text-xebia-purple" />
                </div>
              </div>
              <span className="block text-3xl font-extrabold tracking-tight text-white">45+</span>
              <span className="mt-1 block text-xs font-semibold text-slate-400 uppercase tracking-wider">Expert Paths</span>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-4 border-l border-slate-800"
            >
              <div className="flex justify-center mb-2">
                <div className="rounded-lg bg-xebia-orange/10 p-2 border border-xebia-orange/20">
                  <GraduationCap className="h-5 w-5 text-xebia-orange" />
                </div>
              </div>
              <span className="block text-3xl font-extrabold tracking-tight text-white">94.8%</span>
              <span className="mt-1 block text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</span>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-4 border-l border-slate-800 sm:border-l"
            >
              <div className="flex justify-center mb-2">
                <div className="rounded-lg bg-xebia-purple/10 p-2 border border-xebia-purple/20">
                  <Compass className="h-5 w-5 text-xebia-purple" />
                </div>
              </div>
              <span className="block text-3xl font-extrabold tracking-tight text-white">1,240+</span>
              <span className="mt-1 block text-xs font-semibold text-slate-400 uppercase tracking-wider">Sandbox Hours</span>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="px-4 border-l border-slate-800"
            >
              <div className="flex justify-center mb-2">
                <div className="rounded-lg bg-orange-500/10 p-2 border border-orange-500/20">
                  <ShieldCheck className="h-5 w-5 text-orange-400" />
                </div>
              </div>
              <span className="block text-3xl font-extrabold tracking-tight text-white">100%</span>
              <span className="mt-1 block text-xs font-semibold text-slate-400 uppercase tracking-wider">Certified Labs</span>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
