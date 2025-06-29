const express = require('express');
const WebhookController = require('../controllers/webhook.controller');

const router = express.Router();



// Unified Xendit webhook callback - use standard JSON parsing
router.post('/transactions/callback/xendit',
    WebhookController.handleXenditCallback
);

module.exports = router; 