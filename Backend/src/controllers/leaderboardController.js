const db = require('../config/db');
const { getLeaderboardCache, setLeaderboardCache } = require('../services/cacheService');

exports.getLeaderboard = async (req, res) => {
  try {
    const { mode, category, timeframe, search } = req.query;
    const filterParams = { mode, category, timeframe, search };

    // Priority 3: HTTP Edge CDN Cache-Control Header
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');

    // Priority 2: In-Memory RAM Cache Lookup
    const cacheResult = getLeaderboardCache(filterParams);
    if (cacheResult.hit) {
      res.setHeader('X-Cache-Status', 'HIT');
      return res.json({
        success: true,
        count: cacheResult.data.length,
        cached: true,
        data: cacheResult.data,
      });
    }

    // Database Lookup on Cache Miss
    const participants = await db.getParticipants(filterParams);

    // Save result to In-Memory RAM Cache
    setLeaderboardCache(filterParams, participants, 15);
    res.setHeader('X-Cache-Status', 'MISS');

    res.json({
      success: true,
      count: participants.length,
      cached: false,
      data: participants,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
