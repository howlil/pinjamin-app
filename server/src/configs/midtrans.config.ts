import { APP_CONFIG } from './app.config';
import { logger } from './logger.config';

export const MIDTRANS_CONFIG = {
  isProduction: APP_CONFIG.MIDTRANS_IS_PRODUCTION,
  clientKey: APP_CONFIG.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-yrwURwBjufe2Uw0t',
  serverKey: APP_CONFIG.MIDTRANS_SERVER_KEY || 'SB-Mid-server-VMg8jGV7vesB6YVdOf5-OQZK',
  merchantId: APP_CONFIG.MIDTRANS_MERCHANT_ID || 'G809408329',
  finishUrl: process.env.MIDTRANS_FINISH_URL || 'http://localhost:3000/pembayaran/finish',
  errorUrl: process.env.MIDTRANS_ERROR_URL || 'http://localhost:3000/pembayaran/error',
  pendingUrl: process.env.MIDTRANS_PENDING_URL || 'http://localhost:3000/pembayaran/pending',
  apiUrl: APP_CONFIG.MIDTRANS_IS_PRODUCTION 
    ? 'https://api.midtrans.com' 
    : 'https://api.sandbox.midtrans.com',
  snapUrl: APP_CONFIG.MIDTRANS_IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions',
};

if (APP_CONFIG.NODE_ENV !== 'production') {
  logger.info('Midtrans configuration loaded', {
    isProduction: MIDTRANS_CONFIG.isProduction,
    merchantId: MIDTRANS_CONFIG.merchantId,
    apiUrl: MIDTRANS_CONFIG.apiUrl,
  });
} else {
  logger.info('Midtrans configuration loaded', {
    isProduction: MIDTRANS_CONFIG.isProduction,
  });
}