import React from 'react';
import { Share2, Upload, TrendingUp } from 'lucide-react';
import type { Participant } from '../../types/leaderboard';
import { formatINR } from '../../lib/formatters';

interface StickyUserHUDProps {
  currentUser: Participant;
  allParticipants: Participant[];
  onSubmitProofClick: () => void;
  onShareFlexClick: () => void;
}

export const StickyUserHUD: React.FC<StickyUserHUDProps> = ({
  currentUser,
  allParticipants,
  onSubmitProofClick,
  onShareFlexClick,
}) => {
  // Calculate gap to next prize pool tier
  const currentRank = currentUser.rank;
  let gapText = '';

  if (currentRank > 25) {
    // Gap to enter Top 25 (Cutoff)
    const rank25Participant = allParticipants.find((p) => p.rank === 25);
    if (rank25Participant) {
      const needed = rank25Participant.totalEarnings - currentUser.totalEarnings + 100;
      gapText = `${formatINR(Math.max(needed, 500))} more to enter the Top 25 ₹1,000 Prize Pool!`;
    }
  } else if (currentRank > 13) {
    // Gap to enter Top 13 (₹2,000 tier)
    const rank13Participant = allParticipants.find((p) => p.rank === 13);
    if (rank13Participant) {
      const needed = rank13Participant.totalEarnings - currentUser.totalEarnings + 100;
      gapText = `${formatINR(Math.max(needed, 500))} more to hit the ₹2,000 Prize Tier!`;
    }
  } else if (currentRank > 8) {
    // Gap to enter Top 8 (₹5,000 tier)
    const rank8Participant = allParticipants.find((p) => p.rank === 8);
    if (rank8Participant) {
      const needed = rank8Participant.totalEarnings - currentUser.totalEarnings + 100;
      gapText = `${formatINR(Math.max(needed, 500))} more to hit the ₹5,000 Top Earners Tier!`;
    }
  } else if (currentRank > 3) {
    // Gap to enter Top 3 (Podium)
    const rank3Participant = allParticipants.find((p) => p.rank === 3);
    if (rank3Participant) {
      const needed = rank3Participant.totalEarnings - currentUser.totalEarnings + 100;
      gapText = `${formatINR(Math.max(needed, 1000))} more to reach the Podium & ₹10,000 Prize!`;
    }
  } else {
    gapText = `You are currently in ${currentRank === 1 ? '1st Place Grand Champion' : `${currentRank}nd Place Podium`} position! 🚀`;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-4xl bg-[#12151A]/95 backdrop-blur-md border border-[#CCFF00]/40 rounded-2xl p-3.5 shadow-2xl z-40 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* User Rank & Summary */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-[#CCFF00] text-black font-extrabold font-mono text-sm flex items-center justify-center flex-shrink-0">
          #{currentUser.rank < 10 ? `0${currentUser.rank}` : currentUser.rank}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-tight">{currentUser.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#CCFF00] font-semibold">
              YOU
            </span>
          </div>

          <div className="text-xs text-[#CCFF00] font-mono font-bold">
            {formatINR(currentUser.totalEarnings)} <span className="text-slate-400 font-normal text-[11px]">(Verified)</span>
          </div>
        </div>
      </div>

      {/* Gap Progress Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080A0C] border border-white/10 text-xs text-slate-300 w-full sm:w-auto justify-center">
        <TrendingUp className="w-4 h-4 text-[#CCFF00] flex-shrink-0" />
        <span className="font-medium text-center truncate max-w-xs">{gapText}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={onShareFlexClick}
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          title="Generate Spotify Wrapped style Flex graphic"
        >
          <Share2 className="w-3.5 h-3.5 text-[#CCFF00]" />
          <span className="hidden sm:inline">Flex Card</span>
        </button>

        <button
          onClick={onSubmitProofClick}
          className="px-4 py-2 rounded-xl bg-[#CCFF00] hover:bg-[#b8f944] text-black text-xs font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 fill-black" />
          <span>Submit Proof</span>
        </button>
      </div>
    </div>
  );
};
