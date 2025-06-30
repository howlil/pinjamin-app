require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');

const logger = require('./src/libs/logger.lib');
const prisma = require('./src/libs/database.lib');
const routes = require('./src/routes');
const cronJobManager = require('./src/cronjob');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "*",
    credentials: true
}));

// Conditional JSON parsing - skip untuk endpoint tertentu
app.use((req, res, next) => {
    // Skip JSON parsing untuk endpoint mark-all-as-read
    if (req.path === '/api/v1/notifications/mark-all-as-read' && req.method === 'PATCH') {
        req.body = {};
        return next();
    }

    // Untuk endpoint lainnya, gunakan JSON parsing normal
    express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: true }));

// Morgan logging configuration
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Swagger configuration
try {
    const swaggerDocument = YAML.load(fs.readFileSync(path.join(__dirname, 'swagger.yml'), 'utf8'));

    // Swagger UI options
    const swaggerOptions = {
        explorer: true,
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true
        },
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Building Rental API Documentation',
        customfavIcon: '/favicon.ico'
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

    logger.info('Swagger documentation setup successfully at /api-docs');
} catch (error) {
    logger.error('Failed to setup Swagger documentation:', error.message);
}



// Root route - redirect to documentation
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

app.use('/api/v1', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            BASE_URL: process.env.BACKEND_URL,
            FRONTEND_URL: process.env.FRONTEND_URL,
            HOST: req.get('host'),
            PROTOCOL: req.protocol
        }
    });
});

// API JSON documentation endpoint
app.get('/api-docs.json', (req, res) => {
    try {
        const swaggerDocument = YAML.load(fs.readFileSync(path.join(__dirname, 'swagger.yml'), 'utf8'));
        res.json(swaggerDocument);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to load API documentation'
        });
    }
});

// JSON parsing error handler
app.use((err, req, res, next) => {
    // Handle JSON parsing errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        logger.error('JSON parsing error:', {
            message: err.message,
            url: req.originalUrl,
            method: req.method,
            body: err.body,
            contentType: req.get('Content-Type'),
            userAgent: req.get('User-Agent')
        });

        return res.status(400).json({
            status: 'error',
            message: 'Format JSON tidak valid dalam request body'
        });
    }

    // Handle other body parsing errors
    if (err.type === 'entity.parse.failed') {
        logger.error('Body parsing error:', {
            message: err.message,
            url: req.originalUrl,
            method: req.method,
            contentType: req.get('Content-Type')
        });

        return res.status(400).json({
            status: 'error',
            message: 'Request body tidak dapat diproses'
        });
    }

    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('Shutting down gracefully...');

    // Stop cronjobs
    cronJobManager.stop();

    // Disconnect from database
    await prisma.$disconnect();

    process.exit(0);
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);

    // Start cronjobs after server is running
    cronJobManager.start();
    logger.info('CronJob manager started');
});

module.exports = app;
