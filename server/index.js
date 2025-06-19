require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { prisma, swagger } = require('./src/configs');
const { Logger, ErrorHandler, Response } = require('./src/utils');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger UI setup
app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.specs, swagger.swaggerOptions));

app.use('/api/v1', routes);

app.get('/', (req, res) => {
    return Response.success(res, {
        name: 'Building Rental API Server',
        version: '1.0.0',
        status: 'running',
        documentation: `${req.protocol}://${req.get('host')}/api-docs`,
        timestamp: new Date().toISOString()
    }, 'Server is running successfully');
});

app.use('*', (req, res) => {
    return Response.error(res, 'Route not found', 404);
});

app.use(ErrorHandler.handleValidationError);
app.use(ErrorHandler.handleDatabaseError);
app.use(ErrorHandler.handleGenericError);

const startServer = async () => {
    try {
        await prisma.connect();
        Logger.info('Database connected successfully');

        app.listen(PORT, () => {
            Logger.info(`Server is running on port ${PORT}`);
            Logger.info(`API documentation available at http://localhost:${PORT}/api/v1`);
        });
    } catch (error) {
        Logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('SIGTERM', async () => {
    Logger.info('SIGTERM received. Shutting down gracefully...');
    await prisma.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    Logger.info('SIGINT received. Shutting down gracefully...');
    await prisma.disconnect();
    process.exit(0);
});
