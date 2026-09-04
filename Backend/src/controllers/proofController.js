const db = require('../config/db');
const { analyzeReceiptProof } = require('../services/aiEngine');
const { flushLeaderboardCache } = require('../services/cacheService');

exports.submitProof = async (req, res) => {
  try {
    const { participantId, amount, description, category, clientType } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid positive amount is required.' });
    }

    const aiResult = await analyzeReceiptProof({
      amount,
      description,
      category,
      clientType,
    });

    const proof = await db.addProof({
      participantId,
      amount,
      description,
      category,
      clientType,
      aiResult,
    });

    // Invalidate RAM cache so fresh rankings are served immediately
    flushLeaderboardCache();

    res.json({
      success: true,
      message: 'Proof submitted and verified successfully.',
      proof,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
