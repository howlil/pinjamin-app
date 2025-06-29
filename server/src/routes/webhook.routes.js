const express = require('express');
const WebhookController = require('../controllers/webhook.controller');

const router = express.Router();



router.post('/transactions/callback/xendit',
    express.text({ type: 'application/json' }), // Parse sebagai text untuk signature verification
    (req, res, next) => {
        try {
            req.rawBody = req.body;

            // Parse JSON untuk processing
            req.body = JSON.parse(req.rawBody);

            next();
        } catch (error) {
            console.error('Error parsing webhook JSON:', error);
            res.status(400).json({ error: 'Invalid JSON payload' });
        }
    },
    WebhookController.handleXenditCallback
);

module.exports = router; 