import React, { useState, useMemo } from 'react';
import { MOCK_PARTICIPANTS, MOCK_LIVE_ACTIVITIES } from './mocks/mockLeaderboardData';
import type { Participant, Category, Timeframe, LiveProofActivity } from './types/leaderboard';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LiveProofTicker } from './components/leaderboard/LiveProofTicker';
import { DynamicPodium } from './components/leaderboard/DynamicPodium';
import { FilterBar } from './components/leaderboard/FilterBar';
import { LeaderboardTable } from './components/leaderboard/LeaderboardTable';
import { StickyUserHUD } from './components/leaderboard/StickyUserHUD';
import { ProofAuditModal } from './components/leaderboard/ProofAuditModal';
import { SubmitProofModal } from './components/leaderboard/SubmitProofModal';
import { FlexCardModal } from './components/leaderboard/FlexCardModal';

export const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [activities, setActivities] = useState<LiveProofActivity[]>(MOCK_LIVE_ACTIVITIES);

  // Filters state
  const [mode, setMode] = useState<'ALL' | 'SOLO' | 'TEAM'>('ALL');
  const [category, setCategory] = useState<Category | 'ALL'>('ALL');
  const [timeframe, setTimeframe] = useState<Timeframe>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [inspectedParticipant, setInspectedParticipant] = useState<Participant | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [flexParticipant, setFlexParticipant] = useState<Participant | null>(null);

  // Logged-in User Simulation (e.g. Rank 16 - Aditi Chawla)
  const loggedInUserId = 'p-16';
  const currentUser = useMemo(() => {
    return participants.find((p) => p.id === loggedInUserId) || participants[0];
  }, [participants]);

  // Compute Filtered & Ranked Participants
  const filteredParticipants = useMemo(() => {
    let list = [...participants];

    // Filter by Mode (Solo / Team)
    if (mode === 'SOLO') {
      list = list.filter((p) => !p.isTeam);
    } else if (mode === 'TEAM') {
      list = list.filter((p) => p.isTeam);
    }

    // Filter by Category
    if (category !== 'ALL') {
      list = list.filter((p) => p.category === category);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.handle.toLowerCase().includes(q) ||
          p.university.toLowerCase().includes(q) ||
          (p.city && p.city.toLowerCase().includes(q))
      );
    }

    // Sort by selected timeframe earnings
    list.sort((a, b) => {
      const aVal =
        timeframe === 'TODAY'
          ? a.earningsToday || 0
          : timeframe === 'WEEK'
          ? a.earningsWeek || 0
          : a.totalEarnings;
      const bVal =
        timeframe === 'TODAY'
          ? b.earningsToday || 0
          : timeframe === 'WEEK'
          ? b.earningsWeek || 0
          : b.totalEarnings;
      return bVal - aVal;
    });

    // Re-index ranks for display
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [participants, mode, category, timeframe, searchQuery]);

  // Top 3 Podium
  const topThree = useMemo(() => {
    return filteredParticipants.slice(0, 3);
  }, [filteredParticipants]);



  // Handle Proof Submission Optimistic Update
  const handleSubmitNewProof = (newProof: {
    amount: number;
    description: string;
    category: Category;
    clientType: string;
  }) => {
    setParticipants((prev) => {
      return prev.map((p) => {
        if (p.id === currentUser.id) {
          const updatedEarnings = p.totalEarnings + newProof.amount;
          const updatedToday = (p.earningsToday || 0) + newProof.amount;
          const updatedWeek = (p.earningsWeek || 0) + newProof.amount;

          const newProofItem = {
            id: `prf-${Date.now()}`,
            amount: newProof.amount,
            description: newProof.description,
            category: newProof.category,
            timestamp: new Date().toISOString(),
            proofUrl:
              'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
            status: 'VERIFIED' as const,
            clientType: newProof.clientType,
            sanitizedDetails: {
              platform: newProof.clientType,
              transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
              redactedClient: '[Verified Direct Client]',
              verifiedBy: 'EYFI Auto-Audit Engine',
            },
          };

          return {
            ...p,
            totalEarnings: updatedEarnings,
            earningsToday: updatedToday,
            earningsWeek: updatedWeek,
            verifiedCount: p.verifiedCount + 1,
            isVelocityHigh: true,
            proofs: [newProofItem, ...p.proofs],
          };
        }
        return p;
      });
    });

    // Add to Live Stream Ticker
    const newActivity: LiveProofActivity = {
      id: `act-${Date.now()}`,
      participantId: currentUser.id,
      participantName: currentUser.name,
      participantHandle: currentUser.handle,
      amount: newProof.amount,
      source: newProof.clientType,
      timeAgo: 'Just now',
      category: newProof.category,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#080A0C] text-slate-100 flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black">
      {/* Live Proof Stream Activity Ticker */}
      <LiveProofTicker activities={activities} />

      {/* Main Header with Hero & EYFI Identity */}
      <Header
        onSubmitClick={() => setIsSubmitModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 relative">
        {/* Dynamic Podium (Top 3 Stage) */}
        {topThree.length >= 3 && (
          <section className="mb-12">
            <DynamicPodium
              participants={topThree}
              onInspectProof={(p) => setInspectedParticipant(p)}
            />
          </section>
        )}

        {/* Filter Bar */}
        <section>
          <FilterBar
            mode={mode}
            setMode={setMode}
            category={category}
            setCategory={setCategory}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalResultsCount={filteredParticipants.length}
          />
        </section>

        {/* Leaderboard Table (Ranks 4+) */}
        <section>
          <LeaderboardTable
            participants={filteredParticipants}
            timeframe={timeframe}
            onInspectProof={(p) => setInspectedParticipant(p)}
          />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Sticky User Rank HUD Bar */}
      <StickyUserHUD
        currentUser={currentUser}
        allParticipants={participants}
        onSubmitProofClick={() => setIsSubmitModalOpen(true)}
        onShareFlexClick={() => setFlexParticipant(currentUser)}
      />

      {/* Modals */}
      <ProofAuditModal
        participant={inspectedParticipant}
        onClose={() => setInspectedParticipant(null)}
      />

      <SubmitProofModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitProof={handleSubmitNewProof}
      />

      <FlexCardModal
        participant={flexParticipant}
        onClose={() => setFlexParticipant(null)}
      />
    </div>
  );
};

export default App;
