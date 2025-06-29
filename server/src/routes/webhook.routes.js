const express = require('express');
const WebhookController = require('../controllers/webhook.controller');

const router = express.Router();

// Unified Xendit webhook callback
router.post('/transactions/callback/xendit',
    WebhookController.handleXenditCallback
);

module.exports = router; 