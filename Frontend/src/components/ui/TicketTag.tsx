import React from 'react';

interface TicketTagProps {
  rank: number;
  prizeLabel?: string;
  variant?: 'gold' | 'silver' | 'bronze' | 'lime' | 'default';
  className?: string;
}

export const TicketTag: React.FC<TicketTagProps> = ({
  rank,
  prizeLabel,
  variant = 'lime',
  className = '',
}) => {
  const formattedRank = rank < 10 ? `0${rank}` : `${rank}`;

  const variantStyles = {
    gold: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black border-amber-300 font-extrabold shadow-[0_0_12px_rgba(255,215,0,0.4)]',
    silver: 'bg-gradient-to-r from-slate-200 to-slate-400 text-black border-slate-200 font-extrabold shadow-[0_0_10px_rgba(220,220,220,0.3)]',
    bronze: 'bg-gradient-to-r from-amber-600 to-orange-700 text-white border-amber-500 font-extrabold shadow-[0_0_10px_rgba(229,152,102,0.3)]',
    lime: 'bg-[#CCFF00] text-black border-[#CCFF00] font-black shadow-[0_0_10px_rgba(204,255,0,0.3)]',
    default: 'bg-[#181C24] text-[#CCFF00] border-[#CCFF00]/40 font-bold',
  };

  return (
    <div
      className={`relative inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-xs font-mono tracking-wider transition-transform ${variantStyles[variant]} ${className}`}
      style={{
        clipPath:
          'polygon(0 0, 100% 0, 100% calc(50% - 4px), calc(100% - 4px) 50%, 100% calc(50% + 4px), 100% 100%, 0 100%, 0 calc(50% + 4px), 4px 50%, 0 calc(50% - 4px))',
      }}
    >
      <span>{formattedRank}</span>
      {prizeLabel && (
        <>
          <span className="opacity-40">|</span>
          <span className="font-sans font-semibold tracking-normal text-[11px]">{prizeLabel}</span>
        </>
      )}
    </div>
  );
};
