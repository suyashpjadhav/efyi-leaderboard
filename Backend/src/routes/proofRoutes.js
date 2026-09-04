const express = require('express');
const router = express.Router();
const proofController = require('../controllers/proofController');

router.post('/submit', proofController.submitProof);

module.exports = router;
