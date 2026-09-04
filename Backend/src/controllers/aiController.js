const { analyzeReceiptProof, generateFlexTagline } = require('../services/aiEngine');

exports.auditReceipt = async (req, res) => {
  try {
    const { amount, description, category, clientType } = req.body;
    const audit = await analyzeReceiptProof({ amount, description, category, clientType });
    res.json({ success: true, audit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlexTagline = async (req, res) => {
  try {
    const { participantName, university, rank, totalEarnings, hustleTitle } = req.body;
    const quote = await generateFlexTagline({
      participantName,
      university,
      rank,
      totalEarnings,
      hustleTitle,
    });
    res.json({ success: true, quote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
