const BookingService = require('../services/booking.service');
const XenditHelper = require('../libs/xendit.lib');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const WebhookController = {
    // Handle Xendit unified webhook callback
    async handleXenditCallback(req, res) {
        try {
            const rawBody = JSON.stringify(req.body);
            const signature = req.headers['x-callback-token'];

            // Verify webhook signature
            const isValid = XenditHelper.verifyWebhookSignature(rawBody, signature);

            if (!isValid) {
                logger.warn('Invalid webhook signature');
                return ResponseHelper.unauthorized(res, 'Invalid signature');
            }

            // Determine webhook type based on payload structure
            const webhookType = this.determineWebhookType(req.body);

            let result;

            if (webhookType === 'INVOICE') {
                logger.info('Processing invoice webhook');
                result = await BookingService.processWebhook(req.body);
            } else if (webhookType === 'REFUND') {
                logger.info('Processing refund webhook');
                result = await BookingService.processRefundWebhook(req.body);
            } else {
                logger.warn('Unknown webhook type:', req.body);
                return ResponseHelper.error(res, 'Unknown webhook type', 400);
            }

            if (result) {
                logger.info(`${webhookType.toLowerCase()} webhook processed successfully`);
                return ResponseHelper.success(res, `${webhookType.toLowerCase()} webhook processed successfully`);
            } else {
                logger.warn(`${webhookType.toLowerCase()} webhook processing failed`);
                return ResponseHelper.error(res, `${webhookType.toLowerCase()} webhook processing failed`, 400);
            }
        } catch (error) {
            logger.error('Webhook processing error:', error);
            return ResponseHelper.error(res, 'Webhook processing error', 500);
        }
    },

    // Determine webhook type based on payload structure
    determineWebhookType(payload) {
        // Invoice webhook typically has: external_id, status, payment_method, paid_amount
        // Refund webhook typically has: id, status, reference_id, amount, payment_id

        if (payload.external_id && payload.payment_method !== undefined) {
            return 'INVOICE';
        } else if (payload.reference_id && payload.payment_id) {
            return 'REFUND';
        }

        // Fallback: check for specific fields that are unique to each type
        if (payload.paid_amount !== undefined) {
            return 'INVOICE';
        } else if (payload.payment_id !== undefined) {
            return 'REFUND';
        }

        return 'UNKNOWN';
    }
};

module.exports = WebhookController; 