const BookingService = require('../services/booking.service');
const XenditHelper = require('../libs/xendit.lib');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const WebhookController = {
    // Handle Xendit unified webhook callback
    async handleXenditCallback(req, res) {
        try {
            const signature = req.headers['x-callback-token'];
            const nodeEnv = process.env.NODE_ENV || 'development';

            // Generate raw body untuk signature verification jika tidak tersedia
            let rawBody = req.rawBody;
            if (!rawBody && req.body) {
                rawBody = JSON.stringify(req.body);
            }

            logger.info('Xendit webhook received:', {
                hasSignature: !!signature,
                hasRawBody: !!rawBody,
                rawBodyLength: rawBody ? rawBody.length : 0,
                environment: nodeEnv,
                externalId: req.body?.external_id || 'N/A',
                webhookType: 'determining...'
            });

            // Verify webhook signature
            const isValid = XenditHelper.verifyWebhookSignature(rawBody, signature);

            if (!isValid) {
                const errorMessage = nodeEnv === 'development'
                    ? 'Invalid webhook signature. In development, ensure XENDIT_CALLBACK_TOKEN is set or signature verification will be skipped.'
                    : 'Invalid signature';

                logger.warn('Webhook signature verification failed:', {
                    environment: nodeEnv,
                    hasCallbackToken: !!process.env.XENDIT_CALLBACK_TOKEN,
                    hasSignature: !!signature
                });

                return ResponseHelper.unauthorized(res, errorMessage);
            }

            // Determine webhook type based on payload structure
            const webhookType = WebhookController.determineWebhookType(req.body);

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
                const successMessage = `${webhookType.toLowerCase()} webhook processed successfully`;
                logger.info(successMessage, {
                    externalId: req.body?.external_id,
                    status: req.body?.status,
                    environment: nodeEnv
                });
                return ResponseHelper.success(res, successMessage);
            } else {
                const errorMessage = `${webhookType.toLowerCase()} webhook processing failed`;
                logger.warn(errorMessage, {
                    externalId: req.body?.external_id,
                    status: req.body?.status,
                    environment: nodeEnv
                });
                return ResponseHelper.error(res, errorMessage, 400);
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