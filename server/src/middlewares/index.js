const AuthMiddleware = require('./auth.middleware');
const DatabaseMiddleware = require('./database.middleware');
const ValidationMiddleware = require('./validation.middleware');
const UploadMiddleware = require('./upload.middleware');

module.exports = {
    AuthMiddleware,
    DatabaseMiddleware,
    ValidationMiddleware,
    UploadMiddleware
}; 