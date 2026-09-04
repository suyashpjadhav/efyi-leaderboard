import type { PrizeBracket } from '../types/leaderboard';

export const PRIZE_BRACKETS: PrizeBracket[] = [
  {
    id: 'rank-1',
    minRank: 1,
    maxRank: 1,
    amountPerWinner: 30000,
    label: '1st Place Champion',
    tierName: '₹30,000 Grand Prize',
    badgeBg: 'bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20',
    badgeText: 'text-yellow-400',
    borderGlow: 'border-yellow-500/50 shadow-[0_0_20px_rgba(255,215,0,0.3)]',
  },
  {
    id: 'rank-2',
    minRank: 2,
    maxRank: 2,
    amountPerWinner: 20000,
    label: '2nd Place Runner-Up',
    tierName: '₹20,000 Prize',
    badgeBg: 'bg-slate-300/10',
    badgeText: 'text-slate-200',
    borderGlow: 'border-slate-300/40 shadow-[0_0_15px_rgba(224,224,224,0.2)]',
  },
  {
    id: 'rank-3',
    minRank: 3,
    maxRank: 3,
    amountPerWinner: 10000,
    label: '3rd Place Bronze',
    tierName: '₹10,000 Prize',
    badgeBg: 'bg-amber-700/15',
    badgeText: 'text-amber-400',
    borderGlow: 'border-amber-600/40 shadow-[0_0_15px_rgba(229,152,102,0.2)]',
  },
  {
    id: 'top-earners',
    minRank: 4,
    maxRank: 8,
    amountPerWinner: 5000,
    label: 'Top Earners Tier',
    tierName: '₹5,000 Prize Tier',
    badgeBg: 'bg-[#CCFF00]/10',
    badgeText: 'text-[#CCFF00]',
    borderGlow: 'border-[#CCFF00]/30',
  },
  {
    id: 'next-earners',
    minRank: 9,
    maxRank: 13,
    amountPerWinner: 2000,
    label: 'Next Earners Tier',
    tierName: '₹2,000 Prize Tier',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    borderGlow: 'border-emerald-500/30',
  },
  {
    id: 'cutoff-bracket',
    minRank: 14,
    maxRank: 25,
    amountPerWinner: 1000,
    label: 'Prize Pool Cutoff',
    tierName: '₹1,000 Prize Tier',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    borderGlow: 'border-cyan-500/30',
  },
];

export const CATEGORIES_CONFIG = [
  { id: 'ALL', label: 'All Hustles', icon: 'Sparkles' },
  { id: 'TECH', label: 'Tech & SaaS', icon: 'Code' },
  { id: 'DESIGN', label: 'Freelance & Design', icon: 'Palette' },
  { id: 'AGENCY', label: 'Agency & Services', icon: 'Briefcase' },
  { id: 'CONTENT', label: 'Content & Media', icon: 'Video' },
  { id: 'COMMERCE', label: 'Physical Sales / E-Com', icon: 'ShoppingBag' },
];

export function getPrizeTierForRank(rank: number): PrizeBracket | null {
  return PRIZE_BRACKETS.find((b) => rank >= b.minRank && rank <= b.maxRank) || null;
}
