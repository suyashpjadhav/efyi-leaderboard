require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

const leaderboardRoutes = require('./src/routes/leaderboardRoutes');
const proofRoutes = require('./src/routes/proofRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const {
  leaderboardLimiter,
  proofSubmissionLimiter,
  aiServiceLimiter,
} = require('./src/middlewares/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Routes with Rate Limiting Protection
app.use('/api/leaderboard', leaderboardLimiter, leaderboardRoutes);
app.use('/api/proofs', proofSubmissionLimiter, proofRoutes);
app.use('/api/ai', aiServiceLimiter, aiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'EYFI Leaderboard REST API & AI Server',
    timestamp: new Date().toISOString(),
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EYFI Backend Express Server listening on http://localhost:${PORT}`);
});

module.exports = app;
