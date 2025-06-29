const { Xendit } = require('xendit-node');
const logger = require('./logger.lib');

const xenditClient = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY
});

const XenditHelper = {
    // Create invoice for payment
    async createInvoice(data) {
        try {
            const { Invoice } = xenditClient;

            const invoiceData = {
                externalId: data.externalId,
                amount: data.amount,
                payerEmail: data.payerEmail,
                description: data.description,
                invoiceDuration: data.invoiceDuration || 86400, // 24 hours default
                successRedirectUrl: data.successRedirectUrl,
                failureRedirectUrl: data.failureRedirectUrl,
                currency: 'IDR',
                reminderTime: data.reminderTime || 1,
                locale: 'id',
                items: data.items || [],
                fees: data.fees || []
            };

            logger.info('Creating Xendit invoice with data:', JSON.stringify(invoiceData, null, 2));

            // Xendit SDK v4 requires { data: ... } format
            const invoice = await Invoice.createInvoice({ data: invoiceData });

            logger.info('Xendit invoice response:', JSON.stringify(invoice, null, 2));

            // Handle different response structures for v4
            const responseData = invoice.data || invoice;

            const result = {
                id: responseData.id,
                invoice_url: responseData.invoice_url || responseData.invoiceUrl,
                status: responseData.status,
                external_id: responseData.external_id || responseData.externalId,
                amount: responseData.amount
            };

            logger.info(`Invoice created successfully: ${result.id}`);
            return result;
        } catch (error) {
            logger.error('Error creating Xendit invoice:', error);
            logger.error('Full error object:', JSON.stringify(error, null, 2));
            throw error;
        }
    },

    // Get invoice details
    async getInvoice(invoiceId) {
        try {
            const { Invoice } = xenditClient;
            logger.info(`Getting Xendit invoice: ${invoiceId}`);

            // Xendit SDK v4 format for getting invoice
            const invoice = await Invoice.getInvoice({ invoiceId });

            logger.info('Get invoice response:', JSON.stringify(invoice, null, 2));

            // Handle different response structures for v4
            const responseData = invoice.data || invoice;

            const result = {
                id: responseData.id,
                invoice_url: responseData.invoice_url || responseData.invoiceUrl,
                status: responseData.status,
                external_id: responseData.external_id || responseData.externalId,
                amount: responseData.amount
            };

            return result;
        } catch (error) {
            logger.error('Error getting Xendit invoice:', error);
            logger.error('Full error object:', JSON.stringify(error, null, 2));
            throw error;
        }
    },

    // Create refund
    async createRefund(data) {
        try {
            const { Refund } = xenditClient;

            const refundData = {
                invoice_id: data.invoiceId,
                reason: data.reason,
                amount: data.amount
            };

            logger.info('Creating Xendit refund with data:', JSON.stringify(refundData, null, 2));

            // Xendit SDK v4 format for creating refund
            const refund = await Refund.createRefund({ data: refundData });

            logger.info('Xendit refund response:', JSON.stringify(refund, null, 2));

            // Handle different response structures for v4
            const responseData = refund.data || refund;

            const result = {
                id: responseData.id,
                status: responseData.status,
                amount: responseData.amount,
                reason: responseData.reason
            };

            logger.info(`Refund created successfully: ${result.id}`);
            return result;
        } catch (error) {
            logger.error('Error creating Xendit refund:', error);
            logger.error('Full error object:', JSON.stringify(error, null, 2));
            throw error;
        }
    },

    // Verify webhook callback
    verifyWebhookSignature(rawBody, signature) {
        try {
            const callbackToken = process.env.XENDIT_CALLBACK_TOKEN;

            // Handle development environment atau ketika token tidak di-set
            if (!callbackToken) {
                const nodeEnv = process.env.NODE_ENV || 'development';

                if (nodeEnv === 'development') {
                    logger.warn('XENDIT_CALLBACK_TOKEN is not set in development environment. Webhook signature verification skipped.');
                    return true; // Skip verification in development
                } else {
                    logger.error('XENDIT_CALLBACK_TOKEN is not set in production environment');
                    throw new Error('XENDIT_CALLBACK_TOKEN is not set');
                }
            }

            const crypto = require('crypto');
            const hash = crypto
                .createHmac('sha256', callbackToken)
                .update(rawBody)
                .digest('hex');

            const isValid = hash === signature;

            logger.info('Webhook signature verification:', {
                isValid,
                receivedSignature: signature ? signature.substring(0, 10) + '...' : 'missing',
                calculatedSignature: hash ? hash.substring(0, 10) + '...' : 'missing',
                rawBodyLength: rawBody ? rawBody.length : 0,
                callbackTokenSet: !!callbackToken,
                environment: process.env.NODE_ENV || 'development'
            });

            // Debug signature mismatch in development
            if (!isValid && (process.env.NODE_ENV || 'development') === 'development') {
                logger.debug('Signature verification debug:', {
                    receivedSignature: signature,
                    calculatedSignature: hash,
                    rawBodySample: rawBody ? rawBody.substring(0, 100) + '...' : 'missing'
                });
            }

            return isValid;
        } catch (error) {
            logger.error('Error verifying Xendit webhook signature:', error);
            return false;
        }
    },

    // Process invoice webhook
    async processInvoiceWebhook(data) {
        try {
            const { status, external_id, amount, payment_method, payment_date } = data;

            return {
                status,
                externalId: external_id,
                amount,
                paymentMethod: payment_method,
                paymentDate: payment_date,
                xenditData: data
            };
        } catch (error) {
            logger.error('Error processing Xendit invoice webhook:', error);
            throw error;
        }
    },

    // Generate invoice number
    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const timestamp = Date.now();

        return `INV-${year}${month}${day}-${timestamp}`;
    },

    // Map Xendit status to internal status
    mapPaymentStatus(xenditStatus) {
        const statusMap = {
            'PENDING': 'PENDING',
            'PAID': 'PAID',
            'SETTLED': 'SETTLED',
            'EXPIRED': 'EXPIRED'
        };

        return statusMap[xenditStatus] || 'UNPAID';
    }
};

module.exports = XenditHelper; 