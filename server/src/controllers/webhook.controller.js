const BookingService = require('../services/booking.service');
const XenditHelper = require('../libs/xendit.lib');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const WebhookController = {
    // Handle Xendit invoice webhook
    async handleXenditInvoice(req, res) {
        try {
            const rawBody = JSON.stringify(req.body);
            const signature = req.headers['x-callback-token'];

            // Verify webhook signature
            const isValid = XenditHelper.verifyWebhookSignature(rawBody, signature);

            if (!isValid) {
                logger.warn('Invalid webhook signature');
                return ResponseHelper.unauthorized(res, 'Invalid signature');
            }

            // Process webhook
            const result = await BookingService.processWebhook(req.body);

            if (result) {
                logger.info('Webhook processed successfully');
                return ResponseHelper.success(res, 'Webhook processed successfully');
            } else {
                logger.warn('Webhook processing failed');
                return ResponseHelper.error(res, 'Webhook processing failed', 400);
            }
        } catch (error) {
            logger.error('Webhook processing error:', error);
            return ResponseHelper.error(res, 'Webhook processing error', 500);
        }
    },

    // Handle Xendit refund webhook
    async handleXenditRefund(req, res) {
        try {
            const rawBody = JSON.stringify(req.body);
            const signature = req.headers['x-callback-token'];

            // Verify webhook signature
            const isValid = XenditHelper.verifyWebhookSignature(rawBody, signature);

            if (!isValid) {
                logger.warn('Invalid refund webhook signature');
                return ResponseHelper.unauthorized(res, 'Invalid signature');
            }

            // Process refund webhook
            const result = await BookingService.processRefundWebhook(req.body);

            if (result) {
                logger.info('Refund webhook processed successfully');
                return ResponseHelper.success(res, 'Refund webhook processed successfully');
            } else {
                logger.warn('Refund webhook processing failed');
                return ResponseHelper.error(res, 'Refund webhook processing failed', 400);
            }
        } catch (error) {
            logger.error('Refund webhook processing error:', error);
            return ResponseHelper.error(res, 'Refund webhook processing error', 500);
        }
    }
};

module.exports = WebhookController; 