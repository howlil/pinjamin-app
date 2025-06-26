const express = require('express');
const WebhookController = require('../controllers/webhook.controller');

const router = express.Router();

// Xendit invoice webhook
router.post('/transactions/callback/xendit',
    WebhookController.handleXenditInvoice
);

// Xendit refund webhook  
router.post('/transactions/callback/refund',
    WebhookController.handleXenditRefund
);

module.exports = router; 