import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import type { Participant } from '../../types/leaderboard';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface DynamicPodiumProps {
  participants: Participant[];
  onInspectProof: (participant: Participant) => void;
}

export const DynamicPodium: React.FC<DynamicPodiumProps> = ({
  participants,
  onInspectProof,
}) => {
  const first = participants.find((p) => p.rank === 1) || participants[0];
  const second = participants.find((p) => p.rank === 2) || participants[1];
  const third = participants.find((p) => p.rank === 3) || participants[2];

  if (!first || !second || !third) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto pt-6 pb-8 px-4">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-10">
        
        {/* ======================================================== */}
        {/* 2ND PLACE PODIUM CARD (#2) */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -5, transition: { type: "spring", stiffness: 400, damping: 25 } }}
          className="order-2 md:order-1 flex flex-col items-center"
        >
          <div className="w-full bg-[#12151A]/90 backdrop-blur-md rounded-2xl border border-slate-300/30 hover:border-slate-200/70 p-6 flex flex-col items-center relative overflow-hidden group transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            
            {/* Top Right Rank Tag */}
            <div className="absolute top-0 right-0 px-3 py-1 bg-slate-200/10 border-b border-l border-slate-300/30 rounded-bl-xl text-slate-300 text-xs font-mono font-black tracking-wider">
              #2
            </div>

            {/* Avatar */}
            <div className="relative mb-3 mt-3">
              <div className="w-16 h-16 rounded-full bg-[#0D0F12] border-2 border-slate-300/60 p-1 flex items-center justify-center font-black text-slate-200 text-lg tracking-wider shadow-[0_0_15px_rgba(203,213,225,0.2)]">
                {second.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-slate-200 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                🥈
              </div>
            </div>

            {/* Metallic Silver Gradient Name */}
            <h3 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 tracking-tight text-center">
              {second.name}
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-1">{second.handle}</p>
            <p className="text-[11px] text-slate-400/80 font-medium mb-5">{second.university}</p>

            {/* Verified Earnings Block */}
            <div className="w-full bg-[#080A0C]/90 border border-slate-300/20 rounded-xl p-4 text-center mb-5 backdrop-blur-sm">
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-0.5">
                VERIFIED EARNINGS
              </div>
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300 font-mono tracking-tight tabular-nums">
                <AnimatedCounter value={second.totalEarnings} />
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1 flex items-center justify-center gap-1">
                <span>🥈</span>
                <span>₹20,000 Prize Pool</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onInspectProof(second)}
              className="w-full py-2.5 rounded-xl bg-slate-200/10 hover:bg-slate-200/20 border border-slate-300/30 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-slate-300" />
              <span>Inspect {second.verifiedCount} Proofs</span>
            </button>
          </div>
        </motion.div>


        {/* ======================================================== */}
        {/* 1ST PLACE PODIUM CARD (#1) */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.025, y: -7, transition: { type: "spring", stiffness: 400, damping: 25 } }}
          className="order-1 md:order-2 flex flex-col items-center md:-translate-y-3"
        >
          <div
            className="w-full bg-[#12151A]/95 backdrop-blur-md rounded-2xl border-2 border-[#CCFF00]/50 hover:border-[#CCFF00] p-6 flex flex-col items-center relative overflow-hidden group transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
            style={{
              boxShadow: '0 0 25px rgba(204, 255, 0, 0.15), inset 0 0 15px rgba(204, 255, 0, 0.05)',
            }}
          >
            {/* Top Right Rank Tag */}
            <div className="absolute top-0 right-0 px-3.5 py-1 bg-[#CCFF00] text-black text-xs font-mono font-black tracking-wider rounded-bl-xl shadow-md">
              #1
            </div>

            {/* Avatar */}
            <div className="relative mb-3 mt-3">
              <div className="w-20 h-20 rounded-full bg-[#080A0C] border-2 border-[#CCFF00] p-1 flex items-center justify-center font-black text-[#CCFF00] text-xl tracking-wider shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                {first.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#CCFF00] text-black rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg">
                🥇
              </div>
            </div>

            {/* Metallic Gold Gradient Name */}
            <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-[#CCFF00] to-yellow-400 tracking-tight text-center">
              {first.name}
            </h3>
            <p className="text-xs font-mono text-[#CCFF00] mb-1">{first.handle}</p>
            <p className="text-[11px] text-slate-300 font-medium mb-5">{first.university}</p>

            {/* Verified Earnings Block */}
            <div className="w-full bg-[#080A0C]/95 border border-[#CCFF00]/40 rounded-xl p-4 text-center mb-5 backdrop-blur-sm shadow-inner">
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-0.5">
                TOTAL VERIFIED EARNINGS
              </div>
              <div className="text-3xl font-black text-[#CCFF00] font-mono tracking-tight tabular-nums">
                <AnimatedCounter value={first.totalEarnings} />
              </div>
              <div className="text-xs text-[#CCFF00] font-extrabold mt-1 flex items-center justify-center gap-1">
                <span>🥇</span>
                <span>₹30,000 Grand Prize</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onInspectProof(first)}
              className="w-full py-2.5 rounded-xl bg-[#CCFF00]/15 hover:bg-[#CCFF00]/25 border border-[#CCFF00]/40 text-[#CCFF00] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
              <span>Inspect {first.verifiedCount} Proofs</span>
            </button>
          </div>
        </motion.div>


        {/* ======================================================== */}
        {/* 3RD PLACE PODIUM CARD (#3) */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5, transition: { type: "spring", stiffness: 400, damping: 25 } }}
          className="order-3 flex flex-col items-center"
        >
          <div className="w-full bg-[#12151A]/90 backdrop-blur-md rounded-2xl border border-amber-600/40 hover:border-amber-500/70 p-6 flex flex-col items-center relative overflow-hidden group transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            
            {/* Top Right Rank Tag */}
            <div className="absolute top-0 right-0 px-3 py-1 bg-amber-600/20 border-b border-l border-amber-600/30 rounded-bl-xl text-amber-300 text-xs font-mono font-black tracking-wider">
              #3
            </div>

            {/* Avatar */}
            <div className="relative mb-3 mt-3">
              <div className="w-16 h-16 rounded-full bg-[#0D0F12] border-2 border-amber-600/60 p-1 flex items-center justify-center font-bold text-amber-400 text-lg tracking-wider shadow-[0_0_15px_rgba(217,119,6,0.2)]">
                {third.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-600 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                🥉
              </div>
            </div>

            {/* Metallic Bronze Gradient Name */}
            <h3 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 tracking-tight text-center">
              {third.name}
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-1">{third.handle}</p>
            <p className="text-[11px] text-slate-400/80 font-medium mb-5">{third.university}</p>

            {/* Verified Earnings Block */}
            <div className="w-full bg-[#080A0C]/90 border border-amber-600/30 rounded-xl p-4 text-center mb-5 backdrop-blur-sm">
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-0.5">
                VERIFIED EARNINGS
              </div>
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 font-mono tracking-tight tabular-nums">
                <AnimatedCounter value={third.totalEarnings} />
              </div>
              <div className="text-xs text-amber-300 font-medium mt-1 flex items-center justify-center gap-1">
                <span>🥉</span>
                <span>₹10,000 Prize Pool</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onInspectProof(third)}
              className="w-full py-2.5 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 border border-amber-600/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Inspect {third.verifiedCount} Proofs</span>
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
