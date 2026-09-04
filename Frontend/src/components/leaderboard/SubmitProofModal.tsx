import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  ShieldCheck,
  Lock,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import type { Category } from '../../types/leaderboard';

interface SubmitProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProof: (newProof: {
    amount: number;
    description: string;
    category: Category;
    clientType: string;
  }) => void;
}

export const SubmitProofModal: React.FC<SubmitProofModalProps> = ({
  isOpen,
  onClose,
  onSubmitProof,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<Category>('TECH');
  const [clientType, setClientType] = useState<string>('Stripe Connect / Upwork');
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(true);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);

    // Simulate multi-stage audit verification pipeline (EXIF Scrub + SHA256 Hash check + State Machine)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(true);

      onSubmitProof({
        amount: numAmount,
        description: description || 'Verified Freelance / Client Earnings',
        category,
        clientType,
      });

      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
        setAmount('');
        setDescription('');
        setFileSelected(false);
      }, 1500);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#12151A] border border-[#CCFF00]/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(204,255,0,0.15)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#CCFF00] text-black font-extrabold flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                <Upload className="w-5 h-5 fill-black" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Submit Verified Income Proof</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Multi-Stage Verification State Machine • Zero-Trust Engine
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {successMsg ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#CCFF00]/20 border border-[#CCFF00] text-[#CCFF00] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Proof Submitted & Verified!</h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Your rank position is updating automatically in the active wave leaderboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Security Banner */}
              <div className="bg-[#080A0C] border border-[#CCFF00]/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
                <Lock className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white">Anti-Fraud Safeguards Active:</span> EXIF metadata will be scrubbed automatically. Duplicate invoice hashes are rejected.
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Verified Amount (INR ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="100"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full bg-[#080A0C] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#CCFF00] transition-colors"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Hustle Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-[#080A0C] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                >
                  <option value="TECH">Tech & SaaS (Software, APIs, Cloud)</option>
                  <option value="DESIGN">Design & UI/UX (Figma, Motion, 3D)</option>
                  <option value="AGENCY">Agency & Client Services (Outreach, Copy)</option>
                  <option value="CONTENT">Content & Media (Video Editing, YouTube)</option>
                  <option value="COMMERCE">E-Com & Physical Sales (Shopify, Merch)</option>
                  <option value="OTHER">Other Hustle</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Milestone / Service Description *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Next.js Web App Redesign Milestone 1"
                  className="w-full bg-[#080A0C] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#CCFF00] transition-colors"
                />
              </div>

              {/* Source / Client Type */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Payment Source Platform
                </label>
                <input
                  type="text"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  placeholder="e.g. Upwork Escrow / Stripe Connect / Wise"
                  className="w-full bg-[#080A0C] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#CCFF00] transition-colors"
                />
              </div>

              {/* Upload Screenshot File */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Upload Payment Screenshot / Invoice Slip *
                </label>
                <div className="relative border-2 border-dashed border-white/20 hover:border-[#CCFF00]/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#080A0C]">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {fileSelected ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-[#CCFF00] font-mono font-semibold">
                      <FileCheck className="w-4 h-4 text-[#CCFF00]" />
                      <span>{fileName}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 space-y-1">
                      <Upload className="w-5 h-5 mx-auto text-slate-500" />
                      <p className="text-xs">Drag & drop or click to upload PNG/JPG invoice</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Auto EXIF scrubbed • Max 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#CCFF00] hover:bg-[#b8f944] text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Scrubbing EXIF & Verifying Hash...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 fill-black" />
                      <span>Submit For Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
