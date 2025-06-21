const prismaConfig = require('./prisma.config');
const multerConfig = require('./multer.config');
const swaggerConfig = require('./swagger.config');
const emailConfig = require('./email.config');

module.exports = {
    prisma: prismaConfig,
    multer: multerConfig,
    swagger: swaggerConfig,
    email: emailConfig
}; 