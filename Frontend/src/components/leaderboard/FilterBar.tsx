import React from 'react';
import {
  Search,
  User,
  Users,
  Sparkles,
  Code,
  Palette,
  Briefcase,
  Video,
  ShoppingBag,
  Clock,
  Flame,
  Calendar,
  X,
  Filter,
} from 'lucide-react';
import type { Category, Timeframe } from '../../types/leaderboard';

interface FilterBarProps {
  mode: 'ALL' | 'SOLO' | 'TEAM';
  setMode: (mode: 'ALL' | 'SOLO' | 'TEAM') => void;
  category: Category | 'ALL';
  setCategory: (category: Category | 'ALL') => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  mode,
  setMode,
  category,
  setCategory,
  timeframe,
  setTimeframe,
  searchQuery,
  setSearchQuery,
  totalResultsCount,
}) => {
  const categoryTabs: Array<{ id: Category | 'ALL'; label: string; icon: React.ElementType }> = [
    { id: 'ALL', label: 'All Categories', icon: Sparkles },
    { id: 'TECH', label: 'Tech & SaaS', icon: Code },
    { id: 'DESIGN', label: 'Design & UI/UX', icon: Palette },
    { id: 'AGENCY', label: 'Agency & Services', icon: Briefcase },
    { id: 'CONTENT', label: 'Content & Media', icon: Video },
    { id: 'COMMERCE', label: 'E-Com & Sales', icon: ShoppingBag },
  ];

  return (
    <div className="w-full bg-[#12151A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-8 shadow-xl">
      {/* Top Row: Mode Toggle + Timeframe Selector + Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4">
        
        {/* Mode Switcher: All / Solo / Teams */}
        <div className="inline-flex p-1 bg-[#090B0E] border border-white/10 rounded-xl">
          <button
            onClick={() => setMode('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'ALL'
                ? 'bg-[#CCFF00] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All Contenders</span>
          </button>
          <button
            onClick={() => setMode('SOLO')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'SOLO'
                ? 'bg-[#CCFF00] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Solo Hustlers</span>
          </button>
          <button
            onClick={() => setMode('TEAM')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'TEAM'
                ? 'bg-[#CCFF00] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Teams (Up to 3)</span>
          </button>
        </div>

        {/* Timeframe Selector: All 30 Days / Past 7 Days / Today (Flash Movers) */}
        <div className="inline-flex p-1 bg-[#090B0E] border border-white/10 rounded-xl">
          <button
            onClick={() => setTimeframe('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              timeframe === 'ALL'
                ? 'bg-white/15 text-white border border-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>All 30 Days</span>
          </button>
          <button
            onClick={() => setTimeframe('WEEK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              timeframe === 'WEEK'
                ? 'bg-white/15 text-white border border-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Past 7 Days</span>
          </button>
          <button
            onClick={() => setTimeframe('TODAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              timeframe === 'TODAY'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-slate-400 hover:text-orange-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400/30" />
            <span>Today</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, handle, college or city..."
            className="w-full bg-[#090B0E] border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#CCFF00]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Category Tabs */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 overflow-x-auto scrollbar-none gap-2">
        <div className="flex items-center gap-2">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = category === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#CCFF00]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Total Contenders Counter */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 font-mono">
          <span>Showing</span>
          <span className="text-[#CCFF00] font-bold">{totalResultsCount}</span>
          <span>participants</span>
        </div>
      </div>
    </div>
  );
};
