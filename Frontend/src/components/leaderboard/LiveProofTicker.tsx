import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';
import type { LiveProofActivity } from '../../types/leaderboard';
import { formatINR } from '../../lib/formatters';

interface LiveProofTickerProps {
  activities: LiveProofActivity[];
}

export const LiveProofTicker: React.FC<LiveProofTickerProps> = ({ activities }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activities.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activities.length]);

  const active = activities[currentIndex] || activities[0];
  if (!active) return null;

  return (
    <div className="w-full bg-[#080A0C]/90 backdrop-blur-md border-y border-[#CCFF00]/20 py-2 px-4 overflow-hidden relative">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#CCFF00] uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 fill-[#CCFF00]" />
            LIVE PROOF STREAM
          </span>
        </div>

        {/* Animated Toast Message */}
        <div className="flex-1 overflow-hidden relative h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-xs text-slate-200 truncate"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00] flex-shrink-0" />
              <span className="font-bold text-white">{active.participantName}</span>
              <span className="text-slate-400">({active.participantHandle})</span>
              <span className="text-[#CCFF00] font-mono font-bold">
                verified {formatINR(active.amount)}
              </span>
              <span className="text-slate-400">via {active.source}</span>
              <span className="text-[10px] font-mono text-slate-500">• {active.timeAgo}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Audit Status Tag */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono flex-shrink-0">
          <span className="text-emerald-400 font-bold">100% AUDITED</span>
          <span>• Zero Client Trust</span>
        </div>
      </div>
    </div>
  );
};
