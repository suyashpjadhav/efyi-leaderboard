const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/audit', aiController.auditReceipt);
router.post('/flex-tagline', aiController.getFlexTagline);

module.exports = router;
