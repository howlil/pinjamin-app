const express = require('express');
const authRoutes = require('./auth.route');
const buildingRoutes = require('./building.route');
const bookingRoutes = require('./booking.route');
const dashboardRoutes = require('./dashboard.route');
const facilityRoutes = require('./facility.route');
const buildingManagerRoutes = require('./building-manager.route');
const transactionRoutes = require('./transaction.route');
const notificationRoutes = require('./notification.route');

const router = express.Router();


// Main routes
router.use('/auth', authRoutes);
router.use('/buildings', buildingRoutes);
router.use('/bookings', bookingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/facilities', facilityRoutes);
router.use('/building-managers', buildingManagerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router; 