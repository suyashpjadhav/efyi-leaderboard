export type Category = 'TECH' | 'DESIGN' | 'AGENCY' | 'CONTENT' | 'COMMERCE' | 'OTHER';

export type Timeframe = 'ALL' | 'WEEK' | 'TODAY';

export type VerificationStatus = 'SUBMITTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'FLAGGED_FRAUD';

export interface ProofItem {
  id: string;
  amount: number;
  description: string;
  category: Category;
  timestamp: string;
  proofUrl: string;
  status: VerificationStatus;
  clientType?: string;
  receiptHash?: string;
  sanitizedDetails?: {
    platform: string;
    transactionId: string;
    redactedClient: string;
    verifiedBy: string;
  };
}

export interface Participant {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  handle: string;
  avatarUrl?: string;
  university: string;
  city?: string;
  isTeam: boolean;
  teamMembers?: string[];
  totalEarnings: number;
  earningsToday?: number;
  earningsWeek?: number;
  category: Category;
  hustleTitle: string;
  isVelocityHigh: boolean; // 🔥 On Fire indicator (>5 spots gain or >₹2,000 in 24h)
  velocityAmount24h?: number;
  rankDelta24h: number;
  proofs: ProofItem[];
  verifiedCount: number;
  joinedDaysAgo: number;
  bio?: string;
}

export interface PrizeBracket {
  id: string;
  minRank: number;
  maxRank: number;
  amountPerWinner: number;
  label: string;
  tierName: string;
  badgeBg: string;
  badgeText: string;
  borderGlow: string;
}

export interface LiveProofActivity {
  id: string;
  participantId: string;
  participantName: string;
  participantHandle: string;
  avatarUrl?: string;
  amount: number;
  source: string;
  timeAgo: string;
  category: Category;
}

export interface UserPositionStats {
  currentUser: Participant;
  gapToNextTier: {
    nextTierName: string;
    targetRank: number;
    amountNeeded: number;
  };
}
