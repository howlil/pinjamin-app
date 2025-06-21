const EmailConfig = require('../configs/email.config');
const { Logger, ErrorHandler } = require('../utils');

class EmailService {
    static async sendResetPasswordEmail(email, fullName, resetToken) {
        try {
            const transporter = EmailConfig.createTransporter();

            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

            const htmlTemplate = this.getResetPasswordTemplate(fullName, resetUrl);

            const mailOptions = {
                from: {
                    name: process.env.EMAIL_FROM_NAME || 'Building Rental System',
                    address: process.env.SMTP_USER
                },
                to: email,
                subject: 'Reset Password - Building Rental System',
                html: htmlTemplate,
                text: `Hello ${fullName},\n\nYou requested to reset your password. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nBuilding Rental System Team`
            };

            const info = await transporter.sendMail(mailOptions);

            Logger.info('Reset password email sent successfully', {
                to: email,
                messageId: info.messageId
            });

            return {
                success: true,
                messageId: info.messageId
            };

        } catch (error) {
            Logger.error('Failed to send reset password email:', error);
            throw ErrorHandler.internalServerError('Failed to send reset password email');
        }
    }

    static getResetPasswordTemplate(fullName, resetUrl) {
        return `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #f9f9f9;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                .content {
                    background-color: white;
                    padding: 25px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .button {
                    display: inline-block;
                    background-color: #3498db;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .button:hover {
                    background-color: #2980b9;
                }
                .warning {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Building Rental System</h1>
                    <p>Reset Password Request</p>
                </div>
                
                <div class="content">
                    <h2>Hello ${fullName},</h2>
                    
                    <p>Anda menerima email ini karena ada permintaan untuk reset password akun Anda di Building Rental System.</p>
                    
                    <p>Silakan klik tombol di bawah ini untuk reset password Anda:</p>
                    
                    <div style="text-align: center;">
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    
                    <p>Atau salin dan paste link berikut ke browser Anda:</p>
                    <p style="word-break: break-all; color: #3498db;">${resetUrl}</p>
                    
                    <div class="warning">
                        <strong>⚠️ Penting:</strong>
                        <ul>
                            <li>Link ini akan expired dalam <strong>1 jam</strong></li>
                            <li>Jika Anda tidak meminta reset password, abaikan email ini</li>
                            <li>Jangan bagikan link ini dengan siapa pun</li>
                        </ul>
                    </div>
                    
                    <p>Jika Anda mengalami kesulitan dengan tombol di atas, Anda dapat menghubungi tim support kami.</p>
                    
                    <p>Terima kasih,<br>
                    <strong>Building Rental System Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>© 2024 Building Rental System. All rights reserved.</p>
                    <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    static async sendWelcomeEmail(email, fullName) {
        try {
            const transporter = EmailConfig.createTransporter();

            const mailOptions = {
                from: {
                    name: process.env.EMAIL_FROM_NAME || 'Building Rental System',
                    address: process.env.SMTP_USER
                },
                to: email,
                subject: 'Welcome to Building Rental System',
                html: this.getWelcomeTemplate(fullName),
                text: `Welcome ${fullName}!\n\nThank you for registering with Building Rental System. You can now start booking buildings for your events.\n\nBest regards,\nBuilding Rental System Team`
            };

            const info = await transporter.sendMail(mailOptions);

            Logger.info('Welcome email sent successfully', {
                to: email,
                messageId: info.messageId
            });

            return {
                success: true,
                messageId: info.messageId
            };

        } catch (error) {
            Logger.error('Failed to send welcome email:', error);
            // Don't throw error for welcome email to not interrupt registration flow
            return { success: false, error: error.message };
        }
    }

    static getWelcomeTemplate(fullName) {
        return `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #f9f9f9;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                .content {
                    background-color: white;
                    padding: 25px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to Building Rental System!</h1>
                </div>
                
                <div class="content">
                    <h2>Hello ${fullName},</h2>
                    
                    <p>Selamat datang di Building Rental System! Akun Anda telah berhasil didaftarkan.</p>
                    
                    <p>Anda sekarang dapat:</p>
                    <ul>
                        <li>🏢 Melihat daftar gedung yang tersedia</li>
                        <li>📅 Membuat booking untuk acara Anda</li>
                        <li>💳 Melakukan pembayaran secara online</li>
                        <li>📊 Memantau status booking Anda</li>
                    </ul>
                    
                    <p>Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi tim support kami.</p>
                    
                    <p>Terima kasih telah bergabung dengan kami!</p>
                    
                    <p>Salam hangat,<br>
                    <strong>Building Rental System Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>© 2024 Building Rental System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = EmailService; 