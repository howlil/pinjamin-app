const nodemailer = require('nodemailer');
const { Logger } = require('../utils');

class EmailConfig {
    static transporter = null;

    static createTransporter() {
        if (this.transporter) {
            return this.transporter;
        }

        try {
            this.transporter = nodemailer.createTransporter({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            Logger.info('Email transporter created successfully');
            return this.transporter;
        } catch (error) {
            Logger.error('Failed to create email transporter:', error);
            throw error;
        }
    }

    static async verifyConnection() {
        try {
            const transporter = this.createTransporter();
            await transporter.verify();
            Logger.info('SMTP connection verified successfully');
            return true;
        } catch (error) {
            Logger.error('SMTP connection verification failed:', error);
            return false;
        }
    }
}

module.exports = EmailConfig; 