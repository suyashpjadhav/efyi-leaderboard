import React from 'react';
import {
  Code,
  Palette,
  Briefcase,
  Video,
  ShoppingBag,
  Sparkles,
  Flame,
  ShieldCheck,
  TrendingUp,
  Users,
  User,
} from 'lucide-react';
import type { Category } from '../../types/leaderboard';

export const CategoryBadge: React.FC<{ category: Category; className?: string }> = ({
  category,
  className = '',
}) => {
  const configs: Record<Category, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    TECH: {
      label: 'Tech & SaaS',
      icon: Code,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    DESIGN: {
      label: 'Design & UI/UX',
      icon: Palette,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    AGENCY: {
      label: 'Agency Services',
      icon: Briefcase,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    CONTENT: {
      label: 'Content & Media',
      icon: Video,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    COMMERCE: {
      label: 'E-Com & Sales',
      icon: ShoppingBag,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    OTHER: {
      label: 'Other Hustle',
      icon: Sparkles,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  };

  const config = configs[category] || configs.OTHER;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium tracking-wide ${config.bg} ${config.color} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
};

export const VelocityBadge: React.FC<{ rankGain?: number }> = ({
  rankGain,
}) => {
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 text-[11px] font-semibold animate-pulse-glow"
      title="High Hustle Velocity: Gained >5 spots or earned >₹2,000 in last 24h"
    >
      <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-500" />
      <span>ON FIRE</span>
      {rankGain && rankGain > 0 && <span className="text-[10px] opacity-80">+{rankGain}</span>}
    </div>
  );
};

export const VerifiedCountBadge: React.FC<{ count: number; onClick?: () => void }> = ({
  count,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#CCFF00]/10 border border-[#CCFF00]/25 text-[#CCFF00] text-[11px] font-medium hover:bg-[#CCFF00]/20 transition-all cursor-pointer group"
      title="Click to view verified public proof audit"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00] group-hover:scale-110 transition-transform" />
      <span>{count} Verified</span>
    </button>
  );
};

export const TeamBadge: React.FC<{ isTeam: boolean; membersCount?: number }> = ({
  isTeam,
  membersCount = 1,
}) => {
  if (!isTeam) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
        <User className="w-3 h-3 text-slate-500" /> Solo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium">
      <Users className="w-3 h-3 text-indigo-400" /> Team ({membersCount})
    </span>
  );
};

export const RankDeltaBadge: React.FC<{ delta: number }> = ({ delta }) => {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
        <TrendingUp className="w-3 h-3" />+{delta}
      </span>
    );
  }
  if (delta < 0) {
    return <span className="text-xs font-bold text-rose-400/80">{delta}</span>;
  }
  return <span className="text-xs font-medium text-slate-500">-</span>;
};
