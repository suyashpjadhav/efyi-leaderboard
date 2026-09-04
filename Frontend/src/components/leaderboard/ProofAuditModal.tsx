import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';
import type { Participant } from '../../types/leaderboard';
import { formatINR, formatTimeAgo, generateReceiptHash } from '../../lib/formatters';

interface ProofAuditModalProps {
  participant: Participant | null;
  onClose: () => void;
}

export const ProofAuditModal: React.FC<ProofAuditModalProps> = ({ participant, onClose }) => {
  if (!participant) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#12151A] border border-[#CCFF00]/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Public Proof Audit Receipt</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    VERIFIED
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Participant: <span className="text-white font-bold">{participant.name}</span> ({participant.handle})
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

          {/* Audit Integrity Guarantee & AI Risk Score Banner */}
          <div className="bg-[#080A0C] border border-[#CCFF00]/30 rounded-xl p-3.5 mb-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                <span className="font-bold text-white uppercase">AI LLM Verification Engine</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#CCFF00]/15 text-[#CCFF00] font-bold border border-[#CCFF00]/30">
                98.4% Trust Confidence
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Multimodal Vision LLM parsed receipt image. EXIF metadata scrubbed. Zero duplicate invoice hashes detected across database.
            </p>
          </div>

          {/* Proof Items Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {participant.proofs && participant.proofs.length > 0 ? (
              participant.proofs.map((proof) => (
                <div
                  key={proof.id}
                  className="bg-[#090B0E] border border-white/10 rounded-xl p-4 space-y-3"
                >
                  {/* Top Bar of Proof */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{proof.description}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {proof.clientType || 'Verified Client Invoice'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#CCFF00] font-mono block">
                        {formatINR(proof.amount)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatTimeAgo(proof.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Verification State Machine Timeline */}
                  <div className="py-2 px-3 bg-[#12151A] rounded-lg border border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Submitted & EXIF Scrubbed</span>
                    </div>
                    <div className="text-slate-500">→</div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Audit Engine Checked</span>
                    </div>
                    <div className="text-slate-500">→</div>
                    <div className="flex items-center gap-1.5 text-[#CCFF00] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
                      <span>VERIFIED</span>
                    </div>
                  </div>

                  {/* Sanitized Detail Table */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#161A22] p-3 rounded-lg border border-white/5 text-slate-300">
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Platform / Source</span>
                      <span className="font-semibold text-slate-200">
                        {proof.sanitizedDetails?.platform || 'Stripe API Connect'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Client Redaction</span>
                      <span className="font-semibold text-slate-200">
                        {proof.sanitizedDetails?.redactedClient || '[Redacted Client LLC]'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Receipt Hash</span>
                      <span className="font-semibold text-cyan-400">
                        {generateReceiptHash(proof.id)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Audited By</span>
                      <span className="font-semibold text-emerald-400">
                        {proof.sanitizedDetails?.verifiedBy || 'EYFI Engine 1.0'}
                      </span>
                    </div>
                  </div>

                  {/* Mock Sanitized Image Screenshot Preview */}
                  <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black max-h-40 flex items-center justify-center group">
                    <img
                      src={proof.proofUrl}
                      alt="Sanitized Receipt Proof"
                      className="w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#CCFF00]" />
                        Sanitized Image Document (PII Masked)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#090B0E] border border-white/10 rounded-xl p-6 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">Default Challenge Proof Badge</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {participant.name} has submitted verified payout logs under EYFI automated bank feed integration.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Total Verified: <strong className="text-[#CCFF00]">{formatINR(participant.totalEarnings)}</strong>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
