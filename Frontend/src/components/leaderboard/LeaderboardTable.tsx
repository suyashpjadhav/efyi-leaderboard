import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShieldCheck, Flame } from 'lucide-react';
import type { Participant, Timeframe } from '../../types/leaderboard';
import { LeaderboardRow } from './LeaderboardRow';

interface LeaderboardTableProps {
  participants: Participant[];
  timeframe: Timeframe;
  onInspectProof: (participant: Participant) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  participants,
  timeframe,
  onInspectProof,
}) => {
  // Ranks 4+ displayed in the table
  const tableParticipants = participants.filter((p) => p.rank > 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      {/* Table Title Bar */}
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          <Flame className="w-4 h-4 text-[#CCFF00]" />
          <span>Active Leaderboard Rankings</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Updated in Real-Time</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full bg-[#0B0D10]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl overflow-hidden">
        
        {/* Sticky Table Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-2.5 mb-2 border-b border-white/10 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-[#080A0C]/90 backdrop-blur-md sticky top-0 z-20 rounded-xl">
          <div className="col-span-6 sm:col-span-7 flex items-center gap-4">
            <span className="w-9 text-center">RANK</span>
            <span>CONTENDER</span>
          </div>
          <div className="col-span-6 sm:col-span-5 flex items-center justify-end gap-6 text-right">
            <span className="hidden lg:inline">CATEGORY</span>
            <span className="hidden sm:inline">PROOF</span>
            <span>VERIFIED EARNINGS</span>
          </div>
        </div>

        {/* Empty State */}
        {tableParticipants.length === 0 ? (
          <div className="py-16 text-center text-slate-500 font-mono text-sm">
            No contenders match the selected filters.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1"
          >
            <AnimatePresence mode="popLayout">
              {tableParticipants.map((participant) => {
                // Tier Dividers Placement
                const showTier4Banner = participant.rank === 4;
                const showTier10Banner = participant.rank === 9;
                const showTier15Banner = participant.rank === 14;

                return (
                  <React.Fragment key={participant.id}>
                    {/* Top Earners Prize Tier Banner (Ranks 4 - 8) */}
                    {showTier4Banner && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="my-3 px-4 py-2 bg-gradient-to-r from-amber-500/15 via-[#CCFF00]/10 to-amber-500/15 border border-[#CCFF00]/30 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-[#CCFF00]"
                      >
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-[#CCFF00]" />
                          <span>TOP EARNERS PRIZE TIER (RANKS 4 - 8)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#CCFF00] text-black text-[10px]">
                          ₹5,000 / Winner
                        </span>
                      </motion.div>
                    )}

                    {/* ₹2,000 Prize Tier Banner (Ranks 9 - 13) */}
                    {showTier10Banner && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="my-3 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-cyan-400"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          <span>HIGH VELOCITY PRIZE TIER (RANKS 9 - 13)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-cyan-400 text-black text-[10px]">
                          ₹2,000 / Winner
                        </span>
                      </motion.div>
                    )}

                    {/* Challenger Cutoff Tier Banner (Ranks 14+) */}
                    {showTier15Banner && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="my-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-slate-400"
                      >
                        <span>CHALLENGER CUTOFF TIER</span>
                        <span className="text-[10px] text-slate-400">Keep Submitting Proofs</span>
                      </motion.div>
                    )}

                    <LeaderboardRow
                      participant={participant}
                      timeframe={timeframe}
                      onInspectProof={onInspectProof}
                    />
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};
