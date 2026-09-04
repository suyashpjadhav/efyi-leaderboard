import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050608] border-t border-white/10 py-12 px-4 mt-20 text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-6 h-6 rounded bg-[#CCFF00] text-black font-black text-xs flex items-center justify-center">
              EY
            </div>
            <span className="font-extrabold text-white text-sm">EYFI 30-DAY CHALLENGE</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            The anti-fake-guru platform built for college hustlers, software engineers, and digital builders across India.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <a
            href="https://eyfichallenge.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#CCFF00] hover:underline"
          >
            <span>eyfichallenge.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Security & Zero-Client Trust Engine</span>
        </div>
      </div>
    </footer>
  );
};
