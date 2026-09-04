import React from 'react';
import { Upload, ExternalLink, Trophy, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onSubmitClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSubmitClick }) => {
  return (
    <header className="w-full bg-[#080A0C] border-b border-white/10 relative overflow-hidden bg-dot-matrix">
      {/* Top Navbar Matching Official EYFI Website */}
      <div className="border-b border-white/10 bg-[#080A0C]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          {/* EYFI Official Logo Brand */}
          <a
            href="https://eyfichallenge.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 group"
          >
            <span className="text-2xl font-black italic tracking-tighter text-white font-mono group-hover:text-[#CCFF00] transition-colors">
              <span className="text-[#CCFF00]">EY</span>FI
            </span>
            <span className="text-[10px] font-mono font-bold text-[#CCFF00] px-1.5 py-0.5 rounded bg-[#CCFF00]/10 border border-[#CCFF00]/30 ml-1">
              CHALLENGE
            </span>
          </a>

          {/* Navigation Links Matching EYFI Site */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="https://eyfichallenge.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CCFF00] transition-colors">
                How it works
              </a>
              <a href="https://eyfichallenge.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CCFF00] transition-colors">
                Prizes
              </a>
              <a
                href="https://eyfichallenge.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CCFF00] transition-colors flex items-center gap-1"
              >
                <span>Become an Ambassador</span>
                <ExternalLink className="w-3 h-3 text-[#CCFF00]" />
              </a>
            </div>

            <button
              onClick={onSubmitClick}
              className="px-4 py-1.5 rounded-full bg-[#CCFF00] hover:bg-[#b8f944] text-black font-extrabold text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 fill-black" />
              <span>SUBMIT PROOF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Sleek Leaderboard Title Bar */}
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#CCFF00]" />
          <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
            EYFI 30-Day Challenge <span className="text-[#CCFF00]">Leaderboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
          <span className="text-white font-semibold">Active Wave</span>
          <span className="opacity-40">•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Verified
          </span>
        </div>
      </div>
    </header>
  );
};
