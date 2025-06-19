const prismaConfig = require('./prisma.config');
const multerConfig = require('./multer.config');
const swaggerConfig = require('./swagger.config');

module.exports = {
    prisma: prismaConfig,
    multer: multerConfig,
    swagger: swaggerConfig
}; 