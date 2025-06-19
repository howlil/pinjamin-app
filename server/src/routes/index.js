const express = require('express');
const { Response } = require('../utils');
const authRoutes = require('./auth.route');
const buildingRoutes = require('./building.route');
const bookingRoutes = require('./booking.route');
const dashboardRoutes = require('./dashboard.route');
const adminBookingRoutes = require('./admin.booking.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/buildings', buildingRoutes);
router.use('/bookings', bookingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin/bookings', adminBookingRoutes);

// API Info endpoint
router.get('/', (req, res) => {
    return Response.success(res, {
        name: 'Building Rental API',
        version: '1.0.0',
        description: 'RESTful API for Building Rental Management System',
        timestamp: new Date().toISOString()
    }, 'API is running successfully');
});

module.exports = router; 