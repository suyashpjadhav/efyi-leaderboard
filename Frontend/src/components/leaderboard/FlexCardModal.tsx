import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trophy, Sparkles, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { Participant } from '../../types/leaderboard';
import { formatINR } from '../../lib/formatters';
import { getPrizeTierForRank } from '../../constants/prizeTiers';
import { fetchAiFlexTagline } from '../../lib/api';

interface FlexCardModalProps {
  participant: Participant | null;
  onClose: () => void;
}

export const FlexCardModal: React.FC<FlexCardModalProps> = ({ participant, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [customQuote, setCustomQuote] = useState<string>('');
  const [isGeneratingAiQuote, setIsGeneratingAiQuote] = useState(false);

  if (!participant) return null;

  const prizeTier = getPrizeTierForRank(participant.rank);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#080A0C',
        scale: 2, // High resolution image
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `EYFI-Leaderboard-Flex-${participant.handle.replace('@', '')}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export Flex Card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-[#12151A] border border-[#CCFF00]/40 rounded-2xl p-6 shadow-[0_0_60px_rgba(204,255,0,0.2)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#CCFF00]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Spotify-Wrapped Style Flex Graphic
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas Card Area (The exported graphic) */}
          <div
            ref={cardRef}
            className="w-full bg-[#080A0C] border-2 border-[#CCFF00]/50 rounded-2xl p-6 relative overflow-hidden bg-dot-matrix shadow-2xl text-center flex flex-col items-center justify-between min-h-[420px]"
          >
            {/* Top Brand Bar */}
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#CCFF00] text-black font-black text-xs flex items-center justify-center">
                  EY
                </div>
                <span className="font-extrabold text-white text-sm tracking-tight">EYFI 30-DAY</span>
              </div>
              <span className="text-[10px] font-mono text-[#CCFF00] px-2 py-0.5 rounded bg-[#CCFF00]/10 border border-[#CCFF00]/30 font-bold">
                VERIFIED HUSTLER
              </span>
            </div>

            {/* Middle Flex Content */}
            <div className="my-auto py-4 space-y-3 w-full">
              {/* Big Rank Badge */}
              <div className="inline-block relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#CCFF00] via-[#b8f944] to-emerald-400 text-black font-black font-mono text-3xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.4)] mx-auto">
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-black/70">RANK</span>
                  <span>#{participant.rank < 10 ? `0${participant.rank}` : participant.rank}</span>
                </div>
              </div>

              {/* Name & Handle */}
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">{participant.name}</h2>
                <p className="text-xs font-mono text-slate-400">{participant.handle} • {participant.university}</p>
              </div>

              {/* Total Verified Earnings */}
              <div className="bg-[#12151A] border border-[#CCFF00]/30 rounded-xl p-3 my-2 shadow-inner">
                <div className="text-[9px] uppercase font-mono tracking-widest text-slate-400">
                  VERIFIED 30-DAY EARNINGS
                </div>
                <div className="text-2xl font-black text-[#CCFF00] font-mono tracking-tight mt-0.5">
                  {formatINR(participant.totalEarnings)}
                </div>
              </div>

              {/* Tagline / Prize Tier */}
              {prizeTier && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-bold font-mono">
                  <Trophy className="w-3.5 h-3.5 fill-[#CCFF00]" />
                  <span>{prizeTier.tierName}</span>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-[11px] font-serif-italic text-slate-300 italic pt-1">
                  "{customQuote || "No fine print, just real mechanics."}"
                </p>
                <button
                  onClick={async () => {
                    setIsGeneratingAiQuote(true);
                    const aiQuote = await fetchAiFlexTagline(participant);
                    if (aiQuote) setCustomQuote(aiQuote);
                    setIsGeneratingAiQuote(false);
                  }}
                  disabled={isGeneratingAiQuote}
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-[#CCFF00] hover:underline cursor-pointer opacity-80 hover:opacity-100"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isGeneratingAiQuote ? 'AI Generating...' : '✨ AI Generate Custom Quote'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Footer Stamp */}
            <div className="w-full border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#CCFF00]" /> 100% Verified Proof
              </span>
              <span>eyfichallenge.com</span>
            </div>
          </div>

          {/* Action Export Button */}
          <div className="pt-4">
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="w-full py-3 rounded-xl bg-[#CCFF00] hover:bg-[#b8f944] text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Rendering PNG Image...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 fill-black" />
                  <span>Download Flex Card (PNG)</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
