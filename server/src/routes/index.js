const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const buildingRoutes = require('./building.routes');
const bookingRoutes = require('./booking.routes');
const transactionRoutes = require('./transaction.routes');
const dashboardRoutes = require('./dashboard.routes');
const webhookRoutes = require('./webhook.routes');
const notificationRoutes = require('./notification.routes');
const facilityRoutes = require('./facility.routes');
const buildingManagerRoutes = require('./building-manager.routes');

router.use(authRoutes);
router.use(buildingRoutes);
router.use(bookingRoutes);
router.use(transactionRoutes);
router.use(dashboardRoutes);
router.use(webhookRoutes);
router.use(notificationRoutes);
router.use(facilityRoutes);
router.use(buildingManagerRoutes);

module.exports = router;