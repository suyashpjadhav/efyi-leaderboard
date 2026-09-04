import type { Participant, Category, Timeframe, LiveProofActivity } from '../types/leaderboard';

const API_BASE_URL = 'http://localhost:3001/api';

export async function fetchLeaderboardFromApi(params: {
  mode?: 'ALL' | 'SOLO' | 'TEAM';
  category?: Category | 'ALL';
  timeframe?: Timeframe;
  search?: string;
}): Promise<{ participants: Participant[]; activities: LiveProofActivity[] } | null> {
  try {
    const query = new URLSearchParams();
    if (params.mode) query.append('mode', params.mode);
    if (params.category) query.append('category', params.category);
    if (params.timeframe) query.append('timeframe', params.timeframe);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE_URL}/leaderboard?${query.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success) {
      return {
        participants: data.participants,
        activities: data.activities,
      };
    }
    return null;
  } catch (err) {
    console.warn('[API Client] REST API offline or unreachable, falling back to client state.');
    return null;
  }
}

export async function submitProofToApi(payload: {
  participantId: string;
  amount: number;
  description: string;
  category: Category;
  clientType: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/proofs/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[API Client] REST API proof submission fallback.');
    return null;
  }
}

export async function fetchAiFlexTagline(participant: Participant): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/flex-tagline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.tagline || null;
  } catch (err) {
    return null;
  }
}
