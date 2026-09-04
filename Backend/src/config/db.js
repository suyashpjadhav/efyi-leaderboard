const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { MOCK_PARTICIPANTS } = require('../models/mockData');

// ============================================================================
// DUAL-MODE DATABASE MANAGER (PostgreSQL & Offline JSON Fallback)
// ============================================================================

const dbFilePath = path.join(__dirname, '../../eyfi_leaderboard.json');
let pgPool = null;
let isPostgresActive = false;
let dbData = { participants: [], proof_audits: [] };

// 1. Check for PostgreSQL Connection String
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl && databaseUrl.startsWith('postgres')) {
  try {
    pgPool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000,
    });

    // Test PostgreSQL Connection
    pgPool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.warn('⚠️ PostgreSQL connection failed, activating offline JSON fallback:', err.message);
        isPostgresActive = false;
        initJsonFallback();
      } else {
        console.log('🐘 Connected to PostgreSQL Database Engine at:', res.rows[0].now);
        isPostgresActive = true;
        initPostgresTables();
      }
    });
  } catch (err) {
    console.warn('⚠️ PostgreSQL Pool initialization failed:', err.message);
    initJsonFallback();
  }
} else {
  console.log('ℹ️ DATABASE_URL is not PostgreSQL. Running on local JSON file store engine.');
  initJsonFallback();
}

// ----------------------------------------------------------------------------
// POSTGRESQL DDL SCHEMA & INITIAL SEEDING
// ----------------------------------------------------------------------------

async function initPostgresTables() {
  if (!pgPool) return;

  const createParticipantsTable = `
    CREATE TABLE IF NOT EXISTS participants (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      handle VARCHAR(255) NOT NULL,
      university VARCHAR(255) NOT NULL,
      city VARCHAR(255),
      category VARCHAR(64) NOT NULL,
      is_team BOOLEAN DEFAULT FALSE,
      team_members JSONB DEFAULT '[]'::jsonb,
      total_earnings NUMERIC(12,2) DEFAULT 0,
      earnings_today NUMERIC(12,2) DEFAULT 0,
      earnings_week NUMERIC(12,2) DEFAULT 0,
      verified_count INT DEFAULT 0,
      rank_delta_24h INT DEFAULT 0,
      is_velocity_high BOOLEAN DEFAULT FALSE,
      hustle_title VARCHAR(255)
    );
  `;

  const createProofAuditsTable = `
    CREATE TABLE IF NOT EXISTS proof_audits (
      id VARCHAR(64) PRIMARY KEY,
      participant_id VARCHAR(64) REFERENCES participants(id),
      amount NUMERIC(12,2) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(64) NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(32) DEFAULT 'VERIFIED',
      client_type VARCHAR(255),
      transaction_id VARCHAR(255),
      trust_score NUMERIC(5,2) DEFAULT 98.4,
      audit_rationale TEXT
    );
  `;

  try {
    await pgPool.query(createParticipantsTable);
    await pgPool.query(createProofAuditsTable);

    // Seed initial mock participants if table is empty
    const checkRes = await pgPool.query('SELECT COUNT(*) FROM participants');
    if (parseInt(checkRes.rows[0].count, 10) === 0) {
      for (const p of MOCK_PARTICIPANTS) {
        await pgPool.query(
          `INSERT INTO participants (
            id, name, handle, university, city, category, is_team, team_members,
            total_earnings, earnings_today, earnings_week, verified_count, rank_delta_24h, is_velocity_high, hustle_title
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            p.id,
            p.name,
            p.handle,
            p.university,
            p.city || '',
            p.category,
            Boolean(p.isTeam),
            JSON.stringify(p.teamMembers || []),
            p.totalEarnings,
            p.earningsToday || 0,
            p.earningsWeek || 0,
            p.verifiedCount,
            p.rankDelta24h || 0,
            Boolean(p.isVelocityHigh),
            p.hustleTitle || '',
          ]
        );
      }
      console.log(`[PostgreSQL] Seeding complete: ${MOCK_PARTICIPANTS.length} participants inserted.`);
    }
  } catch (err) {
    console.error('❌ Error initializing PostgreSQL tables:', err.message);
  }
}

// ----------------------------------------------------------------------------
// JSON FALLBACK ENGINE
// ----------------------------------------------------------------------------

function initJsonFallback() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      dbData = JSON.parse(content);
      console.log('✅ Loaded database from:', dbFilePath);
    } else {
      dbData.participants = MOCK_PARTICIPANTS.map((p) => ({
        ...p,
        isTeam: Boolean(p.isTeam),
        isVelocityHigh: Boolean(p.isVelocityHigh),
        teamMembers: p.teamMembers || [],
      }));
      saveJsonDb();
      console.log(`[JSON Store] Seeding complete: ${dbData.participants.length} participants initialized.`);
    }
  } catch (err) {
    console.error('❌ Failed to load JSON database:', err.message);
  }
}

function saveJsonDb() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Failed to save JSON database:', err.message);
  }
}

// ----------------------------------------------------------------------------
// ASYNC API DATA ACCESS INTERFACES
// ----------------------------------------------------------------------------

module.exports = {
  getParticipants: async ({ mode, category, timeframe, search }) => {
    if (isPostgresActive && pgPool) {
      try {
        let query = 'SELECT * FROM participants WHERE 1=1';
        const params = [];
        let paramIdx = 1;

        if (mode === 'SOLO') {
          query += ` AND is_team = FALSE`;
        } else if (mode === 'TEAM') {
          query += ` AND is_team = TRUE`;
        }

        if (category && category !== 'ALL') {
          query += ` AND category = $${paramIdx++}`;
          params.push(category);
        }

        if (search && search.trim() !== '') {
          const s = `%${search.toLowerCase()}%`;
          query += ` AND (LOWER(name) LIKE $${paramIdx} OR LOWER(handle) LIKE $${paramIdx} OR LOWER(university) LIKE $${paramIdx})`;
          params.push(s);
          paramIdx++;
        }

        if (timeframe === 'TODAY') {
          query += ' ORDER BY earnings_today DESC';
        } else if (timeframe === 'WEEK') {
          query += ' ORDER BY earnings_week DESC';
        } else {
          query += ' ORDER BY total_earnings DESC';
        }

        const res = await pgPool.query(query, params);
        return res.rows.map((r, idx) => ({
          id: r.id,
          rank: idx + 1,
          name: r.name,
          handle: r.handle,
          university: r.university,
          city: r.city,
          category: r.category,
          isTeam: Boolean(r.is_team),
          teamMembers: typeof r.team_members === 'string' ? JSON.parse(r.team_members) : (r.team_members || []),
          totalEarnings: parseFloat(r.total_earnings),
          earningsToday: parseFloat(r.earnings_today),
          earningsWeek: parseFloat(r.earnings_week),
          verifiedCount: parseInt(r.verified_count, 10),
          rankDelta24h: parseInt(r.rank_delta_24h, 10),
          isVelocityHigh: Boolean(r.is_velocity_high),
          hustleTitle: r.hustle_title,
        }));
      } catch (err) {
        console.error('❌ PostgreSQL Query Error, falling back to JSON store:', err.message);
      }
    }

    // JSON Storage Fallback Execution
    let list = [...dbData.participants];

    if (mode === 'SOLO') {
      list = list.filter((p) => !p.isTeam);
    } else if (mode === 'TEAM') {
      list = list.filter((p) => p.isTeam);
    }

    if (category && category !== 'ALL') {
      list = list.filter((p) => p.category === category);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.handle.toLowerCase().includes(q) ||
          p.university.toLowerCase().includes(q)
      );
    }

    if (timeframe === 'TODAY') {
      list.sort((a, b) => (b.earningsToday || 0) - (a.earningsToday || 0));
    } else if (timeframe === 'WEEK') {
      list.sort((a, b) => (b.earningsWeek || 0) - (a.earningsWeek || 0));
    } else {
      list.sort((a, b) => b.totalEarnings - a.totalEarnings);
    }

    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  },

  addProof: async ({ participantId, amount, description, category, clientType, aiResult }) => {
    const proofId = `prf-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const targetId = participantId || 'p-16';

    if (isPostgresActive && pgPool) {
      try {
        await pgPool.query('BEGIN');

        const insertProofQuery = `
          INSERT INTO proof_audits (
            id, participant_id, amount, description, category, timestamp, status, client_type, transaction_id, trust_score, audit_rationale
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;
        await pgPool.query(insertProofQuery, [
          proofId,
          targetId,
          amount,
          description,
          category,
          timestamp,
          aiResult.status,
          clientType,
          aiResult.sanitizedDetails.transactionId,
          aiResult.trustScore,
          aiResult.auditRationale,
        ]);

        const updateParticipantQuery = `
          UPDATE participants SET
            total_earnings = total_earnings + $1,
            earnings_today = earnings_today + $1,
            earnings_week = earnings_week + $1,
            verified_count = verified_count + 1,
            is_velocity_high = TRUE
          WHERE id = $2
        `;
        await pgPool.query(updateParticipantQuery, [amount, targetId]);

        await pgPool.query('COMMIT');

        return {
          id: proofId,
          participantId: targetId,
          amount,
          description,
          category,
          timestamp,
          status: aiResult.status,
          clientType,
          transactionId: aiResult.sanitizedDetails.transactionId,
          trustScore: aiResult.trustScore,
          auditRationale: aiResult.auditRationale,
        };
      } catch (err) {
        await pgPool.query('ROLLBACK');
        console.error('❌ PostgreSQL Transaction Error, falling back to JSON store:', err.message);
      }
    }

    // JSON Storage Fallback Execution
    const proofItem = {
      id: proofId,
      participantId: targetId,
      amount,
      description,
      category,
      timestamp,
      status: aiResult.status,
      clientType,
      transactionId: aiResult.sanitizedDetails.transactionId,
      trustScore: aiResult.trustScore,
      auditRationale: aiResult.auditRationale,
    };

    dbData.proof_audits.push(proofItem);
    const participant = dbData.participants.find((p) => p.id === targetId);

    if (participant) {
      participant.totalEarnings += amount;
      participant.earningsToday = (participant.earningsToday || 0) + amount;
      participant.earningsWeek = (participant.earningsWeek || 0) + amount;
      participant.verifiedCount += 1;
      participant.isVelocityHigh = true;
      if (!participant.proofs) participant.proofs = [];
      participant.proofs.unshift(proofItem);
    }

    saveJsonDb();
    return proofItem;
  },
};
