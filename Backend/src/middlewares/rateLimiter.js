const rateLimit = require('express-rate-limit');

// 1. Leaderboard Public Read Rate Limiter (Max 100 requests / 15 mins per IP)
const leaderboardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many leaderboard requests from this IP. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

// 2. Proof Submission Rate Limiter (Max 5 submissions / 1 hour per IP)
const proofSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 proof submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Submission rate limit reached (Max 5 proofs/hour). Please wait before uploading another claim.',
    code: 'PROOF_SUBMISSION_LIMIT_EXCEEDED',
  },
});

// 3. AI Service Rate Limiter (Max 10 requests / 1 hour per IP for Gemini API Protection)
const aiServiceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 AI requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI generation rate limit reached (Max 10 requests/hour). Please try again later.',
    code: 'AI_RATE_LIMIT_EXCEEDED',
  },
});

module.exports = {
  leaderboardLimiter,
  proofSubmissionLimiter,
  aiServiceLimiter,
};
