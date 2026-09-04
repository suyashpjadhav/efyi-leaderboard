const NodeCache = require('node-cache');

// Initialize NodeCache instance with 15s default TTL and 30s cleanup check
const cache = new NodeCache({
  stdTTL: 15, // 15 seconds Default Time-To-Live
  checkperiod: 30, // Check for expired keys every 30 seconds
  useClones: false,
});

function generateCacheKey({ mode, category, timeframe, search }) {
  return `leaderboard_${mode || 'ALL'}_${category || 'ALL'}_${timeframe || 'ALL'}_${(search || '').toLowerCase().trim()}`;
}

module.exports = {
  getLeaderboardCache: (filterParams) => {
    const key = generateCacheKey(filterParams);
    const cachedData = cache.get(key);
    if (cachedData) {
      return { hit: true, data: cachedData };
    }
    return { hit: false, data: null };
  },

  setLeaderboardCache: (filterParams, data, ttlSeconds = 15) => {
    const key = generateCacheKey(filterParams);
    cache.set(key, data, ttlSeconds);
  },

  flushLeaderboardCache: () => {
    cache.flushAll();
    console.log('⚡ Leaderboard RAM Cache flushed following proof verification.');
  },
};
