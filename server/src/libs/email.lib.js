const nodemailer = require('nodemailer');
const logger = require('./logger.lib');

let transporter = null;

const initializeTransporter = () => {
    try {
        const smtpPassword = process.env.SMTP_PASS;
        if (!process.env.SMTP_USER || !smtpPassword) {
            logger.warn('SMTP credentials not configured. Email functionality will be limited.');
            logger.info('To enable email functionality, please set: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (or SMTP_PASSWORD)');
            logConfigurationStatus();
            transporter = null;
            return;
        }

        // Konfigurasi SMTP transporter
        const smtpConfig = buildSmtpConfiguration(smtpPassword);

        logger.info('Initializing SMTP transporter with config:', {
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            user: smtpConfig.auth.user
        });

        // Create transporter using nodemailer
        transporter = nodemailer.createTransport(smtpConfig);
        testConnection();
    } catch (error) {
        logger.error('Failed to initialize email transporter:', error);
        transporter = null;
    }
};

const buildSmtpConfiguration = (smtpPassword) => {
    return {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465' || process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: smtpPassword
        },
        tls: {
            rejectUnauthorized: false
        },
        debug: process.env.NODE_ENV === 'development',
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000,    // 30 seconds
        socketTimeout: 60000       // 60 seconds
    };
};

const logConfigurationStatus = () => {
    const smtpPassword = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
    logger.info('Current environment variables:');
    logger.info(`  SMTP_HOST: ${process.env.SMTP_HOST ? 'SET' : 'NOT SET'}`);
    logger.info(`  SMTP_PORT: ${process.env.SMTP_PORT ? 'SET' : 'NOT SET'}`);
    logger.info(`  SMTP_USER: ${process.env.SMTP_USER ? 'SET' : 'NOT SET'}`);
    logger.info(`  SMTP_PASS/SMTP_PASSWORD: ${smtpPassword ? 'SET' : 'NOT SET'}`);
};

const testConnection = () => {
    // Test connection asynchronously
    transporter.verify((error, success) => {
        if (error) {
            logger.error('SMTP connection test failed:', error);
            logger.error('SMTP error details:', {
                code: error.code,
                command: error.command,
                response: error.response
            });
        } else {
            logger.info('SMTP connection test successful');
        }
    });
};

const validateEmailData = (emailData) => {
    if (!emailData || typeof emailData !== 'object') {
        throw new Error('Email data is required and must be an object');
    }

    if (!emailData.to || typeof emailData.to !== 'string') {
        throw new Error('Email recipient (to) is required');
    }

    if (!emailData.subject || typeof emailData.subject !== 'string') {
        throw new Error('Email subject is required');
    }

    if (!emailData.htmlContent || typeof emailData.htmlContent !== 'string') {
        throw new Error('Email HTML content is required');
    }
};

const buildMailOptions = (emailData) => {
    return {
        from: {
            name: process.env.EMAIL_FROM_NAME || 'Building Rental System',
            address: process.env.SMTP_USER
        },
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.htmlContent,
        text: emailData.textContent || stripHtmlTags(emailData.htmlContent)
    };
};

const logEmailError = (error) => {
    logger.error('Email error details:', {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
    });
};

const stripHtmlTags = (html) => {
    if (!html || typeof html !== 'string') {
        return '';
    }
    return html.replace(/<[^>]*>/g, '');
};

const getStatusColor = (status) => {
    const STATUS_COLORS = {
        APPROVED: '#28a745',
        REJECTED: '#dc3545',
        PENDING: '#007bff',
        CANCELLED: '#6c757d'
    };
    return STATUS_COLORS[status] || '#007bff';
};

const getStatusText = (status) => {
    const STATUS_TEXTS = {
        APPROVED: 'Disetujui',
        REJECTED: 'Ditolak',
        PENDING: 'Menunggu',
        CANCELLED: 'Dibatalkan'
    };
    return STATUS_TEXTS[status] || status;
};

const generatePasswordResetHtml = (fullName, resetUrl) => {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f8f9fa; padding: 20px; }
            .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; }
            .token-box { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; word-break: break-all; }
            .warning { color: #dc3545; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Reset Password</h1>
            </div>
            <div class="content">
                <h2>Halo ${fullName},</h2>
                <p>Kami menerima permintaan untuk mereset password akun Anda di Building Rental System.</p>
                <p>Klik tombol dibawah ini untuk mereset password Anda:</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <p>Atau copy dan paste link berikut di browser Anda:</p>
                <div class="token-box">${resetUrl}</div>
                <p class="warning">Token ini akan expired dalam 10 menit.</p>
                <p>Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Building Rental System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateBookingConfirmationHtml = (fullName, bookingData) => {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Konfirmasi Booking</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f8f9fa; padding: 20px; }
            .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Booking Berhasil Dibuat</h1>
            </div>
            <div class="content">
                <h2>Halo ${fullName},</h2>
                <p>Booking Anda telah berhasil dibuat dan sedang dalam proses verifikasi.</p>
                <div class="details">
                    <h3>Detail Booking:</h3>
                    <p><strong>Nama Kegiatan:</strong> ${bookingData.activityName}</p>
                    <p><strong>Gedung:</strong> ${bookingData.buildingName}</p>
                    <p><strong>Tanggal:</strong> ${bookingData.startDate}${bookingData.endDate ? ' - ' + bookingData.endDate : ''}</p>
                    <p><strong>Waktu:</strong> ${bookingData.startTime} - ${bookingData.endTime}</p>
                    <p><strong>Status:</strong> ${bookingData.status}</p>
                </div>
                <p>Kami akan menginformasikan Anda melalui email dan notifikasi ketika booking telah diverifikasi.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Building Rental System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateBookingStatusHtml = (fullName, bookingData, status) => {
    const statusColor = getStatusColor(status);
    const statusText = getStatusText(status);

    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Update Status Booking</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: ${statusColor}; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f8f9fa; padding: 20px; }
            .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; }
            .status { font-size: 18px; font-weight: bold; color: ${statusColor}; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Update Status Booking</h1>
            </div>
            <div class="content">
                <h2>Halo ${fullName},</h2>
                <p>Status booking Anda telah diperbarui:</p>
                <p class="status">Status: ${statusText}</p>
                <div class="details">
                    <h3>Detail Booking:</h3>
                    <p><strong>Nama Kegiatan:</strong> ${bookingData.activityName}</p>
                    <p><strong>Gedung:</strong> ${bookingData.buildingName}</p>
                    <p><strong>Tanggal:</strong> ${bookingData.startDate}${bookingData.endDate ? ' - ' + bookingData.endDate : ''}</p>
                    <p><strong>Waktu:</strong> ${bookingData.startTime} - ${bookingData.endTime}</p>
                    ${bookingData.rejectionReason ? `<p><strong>Alasan Penolakan:</strong> ${bookingData.rejectionReason}</p>` : ''}
                </div>
                ${status === 'APPROVED' ? '<p>Silakan lakukan pembayaran untuk menyelesaikan booking Anda.</p>' : ''}
            </div>
            <div class="footer">
                <p>&copy; 2024 Building Rental System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generatePaymentConfirmationHtml = (fullName, paymentData) => {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Konfirmasi Pembayaran</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f8f9fa; padding: 20px; }
            .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; }
            .amount { font-size: 24px; font-weight: bold; color: #28a745; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Pembayaran Berhasil</h1>
            </div>
            <div class="content">
                <h2>Halo ${fullName},</h2>
                <p>Pembayaran Anda telah berhasil diproses.</p>
                <div class="details">
                    <h3>Detail Pembayaran:</h3>
                    <p><strong>Gedung:</strong> ${paymentData.buildingName}</p>
                    <p><strong>Jumlah:</strong> <span class="amount">Rp ${paymentData.totalAmount?.toLocaleString('id-ID')}</span></p>
                    <p><strong>Metode Pembayaran:</strong> ${paymentData.paymentMethod}</p>
                    <p><strong>Tanggal Pembayaran:</strong> ${paymentData.paymentDate}</p>
                    <p><strong>No. Invoice:</strong> ${paymentData.invoiceNumber}</p>
                </div>
                <p>Terima kasih atas kepercayaan Anda menggunakan layanan kami.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Building Rental System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const EmailHelper = {
    async verifyConnection() {
        try {
            if (!transporter) {
                throw new Error('Email transporter not initialized');
            }

            await transporter.verify();
            logger.info('SMTP connection verified successfully');
            return true;
        } catch (error) {
            logger.error('SMTP connection verification failed:', error);
            return false;
        }
    },

    isConfigured() {
        const smtpPassword = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
        return !!(process.env.SMTP_USER && smtpPassword && transporter);
    },

    getConfigurationStatus() {
        const smtpPassword = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
        return {
            smtpUser: !!process.env.SMTP_USER,
            smtpPassword: !!smtpPassword,
            smtpHost: !!process.env.SMTP_HOST,
            smtpPort: !!process.env.SMTP_PORT,
            transporterInitialized: !!transporter,
            fullyConfigured: this.isConfigured()
        };
    },

    async sendEmail(emailData) {
        try {
            // Validate input
            validateEmailData(emailData);

            if (!transporter) {
                const errorMessage = 'Email transporter not initialized. Please configure SMTP settings.';
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const mailOptions = buildMailOptions(emailData);

            logger.info(`Attempting to send email to: ${emailData.to}`);
            logger.info(`Subject: ${emailData.subject}`);

            const info = await transporter.sendMail(mailOptions);
            logger.info(`Email sent successfully to ${emailData.to}. Message ID: ${info.messageId}`);

            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            logger.error('Failed to send email:', error);
            logEmailError(error);
            throw new Error(`Email service error: ${error.message}`);
        }
    },

    async sendPasswordResetEmail(email, resetToken, userFullName) {
        try {
            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
            const htmlContent = generatePasswordResetHtml(userFullName, resetUrl);
            const subject = 'Reset Password - Building Rental System';

            const emailData = {
                to: email,
                subject: subject,
                htmlContent: htmlContent
            };

            return await this.sendEmail(emailData);
        } catch (error) {
            logger.error('Failed to send password reset email:', error);
            throw error;
        }
    },

    async sendBookingConfirmationEmail(email, userFullName, bookingData) {
        try {
            const htmlContent = generateBookingConfirmationHtml(userFullName, bookingData);
            const subject = `Konfirmasi Booking - ${bookingData.buildingName}`;

            const emailData = {
                to: email,
                subject: subject,
                htmlContent: htmlContent
            };

            return await this.sendEmail(emailData);
        } catch (error) {
            logger.error('Failed to send booking confirmation email:', error);
            throw error;
        }
    },

    async sendBookingStatusEmail(email, userFullName, bookingData, status) {
        try {
            const htmlContent = generateBookingStatusHtml(userFullName, bookingData, status);
            const subject = `Update Status Booking - ${bookingData.buildingName}`;

            const emailData = {
                to: email,
                subject: subject,
                htmlContent: htmlContent
            };

            return await this.sendEmail(emailData);
        } catch (error) {
            logger.error('Failed to send booking status email:', error);
            throw error;
        }
    },

    async sendPaymentConfirmationEmail(email, userFullName, paymentData) {
        try {
            const htmlContent = generatePaymentConfirmationHtml(userFullName, paymentData);
            const subject = `Konfirmasi Pembayaran - Building Rental System`;

            const emailData = {
                to: email,
                subject: subject,
                htmlContent: htmlContent
            };

            return await this.sendEmail(emailData);
        } catch (error) {
            logger.error('Failed to send payment confirmation email:', error);
            throw error;
        }
    }
};

// Initialize transporter on module load
initializeTransporter();

module.exports = EmailHelper; 