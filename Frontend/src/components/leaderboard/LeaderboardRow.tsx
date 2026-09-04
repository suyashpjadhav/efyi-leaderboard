import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowUp, ArrowDown, Minus, Trophy } from 'lucide-react';
import type { Participant, Timeframe } from '../../types/leaderboard';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface LeaderboardRowProps {
  participant: Participant;
  timeframe: Timeframe;
  onInspectProof: (participant: Participant) => void;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  participant,
  timeframe,
  onInspectProof,
}) => {
  const displayEarnings =
    timeframe === 'TODAY'
      ? participant.earningsToday || 0
      : timeframe === 'WEEK'
      ? participant.earningsWeek || 0
      : participant.totalEarnings;

  const isLoggedUser = participant.id === 'p-16';

  // Rank Delta Icon
  const renderRankDelta = () => {
    if (!participant.rankDelta24h || participant.rankDelta24h === 0) {
      return <Minus className="w-3 h-3 text-slate-600" />;
    }
    if (participant.rankDelta24h > 0) {
      return (
        <span className="flex items-center text-[10px] font-mono text-emerald-400 font-bold">
          <ArrowUp className="w-3 h-3" />+{participant.rankDelta24h}
        </span>
      );
    }
    return (
      <span className="flex items-center text-[10px] font-mono text-rose-400 font-bold">
        <ArrowDown className="w-3 h-3" />{participant.rankDelta24h}
      </span>
    );
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`group relative flex items-center justify-between px-5 py-3.5 mb-2 rounded-xl border transition-all duration-200 cursor-pointer ${
        isLoggedUser
          ? 'bg-[#161B22]/90 border-[#CCFF00]/60 shadow-[0_0_15px_rgba(204,255,0,0.15)]'
          : 'bg-[#0D0F13]/70 hover:bg-[#12151A]/90 border-white/5 hover:border-[#CCFF00]/30 backdrop-blur-sm'
      }`}
    >
      {/* Left Column: Rank + Avatar + Contender Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Rank Number & Delta */}
        <div className="flex flex-col items-center justify-center w-9 flex-shrink-0">
          <span
            className={`text-sm font-black font-mono tabular-nums ${
              participant.rank <= 3
                ? 'text-[#CCFF00]'
                : isLoggedUser
                ? 'text-[#CCFF00]'
                : 'text-slate-300'
            }`}
          >
            #{participant.rank < 10 ? `0${participant.rank}` : participant.rank}
          </span>
          <div className="mt-0.5">{renderRankDelta()}</div>
        </div>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${
              isLoggedUser
                ? 'bg-[#CCFF00]/20 border-[#CCFF00] text-[#CCFF00]'
                : 'bg-white/5 border-white/10 text-slate-200'
            }`}
          >
            {participant.name.slice(0, 2).toUpperCase()}
          </div>
          {participant.rank <= 3 && (
            <div className="absolute -bottom-1 -right-1 bg-[#CCFF00] text-black rounded-full p-0.5">
              <Trophy className="w-2.5 h-2.5 fill-black" />
            </div>
          )}
        </div>

        {/* Contender Name, Handle & University */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white truncate group-hover:text-[#CCFF00] transition-colors">
              {participant.name}
            </span>
            {isLoggedUser && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#CCFF00] text-black uppercase">
                YOU
              </span>
            )}
            {participant.isTeam && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/30">
                Team ({participant.teamMembers?.length || 2})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 truncate mt-0.5">
            <span className="font-mono text-slate-400">{participant.handle}</span>
            <span className="opacity-30">•</span>
            <span className="truncate text-slate-400">{participant.university}</span>
          </div>
        </div>
      </div>

      {/* Right Column: Earnings + Verified Proof Trigger */}
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        {/* Category Soft Ghost Badge */}
        <div className="hidden lg:block">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/50 border border-slate-700/50 text-slate-300">
            {participant.category}
          </span>
        </div>

        {/* Proof Inspection Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInspectProof(participant);
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="tabular-nums">{participant.verifiedCount} Verified</span>
        </button>

        {/* Total Earnings */}
        <div className="text-right min-w-[110px]">
          <div className="text-sm font-black font-mono text-white tabular-nums group-hover:text-[#CCFF00] transition-colors">
            <AnimatedCounter value={displayEarnings} />
          </div>
          <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
            CHALLENGE TOTAL
          </div>
        </div>
      </div>
    </motion.div>
  );
};
