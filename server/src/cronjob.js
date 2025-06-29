const cron = require('node-cron');
const BookingService = require('./services/booking.service');
const logger = require('./libs/logger.lib');

class CronJobManager {
    constructor() {
        this.jobs = [];
        this.isInitialized = false;
    }

    // Initialize all cronjobs
    init() {
        if (this.isInitialized) {
            logger.warn('CronJobManager already initialized');
            return;
        }

        this.setupExpiredBookingsJob();
        this.isInitialized = true;

        logger.info('CronJobManager initialized successfully');
    }

    // Setup cronjob untuk update expired bookings
    setupExpiredBookingsJob() {
        // Jalankan setiap 1 menit
        const job = cron.schedule('* * * * *', async () => {
            try {
                const result = await BookingService.updateExpiredBookings();

                // Only log if there were bookings processed
                if (result.totalProcessed > 0) {
                    logger.info('=== CRONJOB: Expired bookings update completed ===', result);
                }
            } catch (error) {
                logger.error('CRONJOB: Error updating expired bookings:', error);
            }
        }, {
            scheduled: false, // Don't start immediately
            timezone: "Asia/Jakarta"
        });

        this.jobs.push({
            name: 'updateExpiredBookings',
            schedule: '* * * * *',
            description: 'Update expired bookings status every minute',
            job: job
        });

        logger.info('Expired bookings cronjob scheduled: Every minute');
    }

    // Start all cronjobs
    start() {
        if (!this.isInitialized) {
            this.init();
        }

        this.jobs.forEach(jobInfo => {
            jobInfo.job.start();
        });

        logger.info('Cronjob started: Update expired bookings every minute');
    }

    // Stop all cronjobs
    stop() {
        this.jobs.forEach(jobInfo => {
            jobInfo.job.stop();
        });

        logger.info('Cronjob stopped');
    }

    // Get status of all cronjobs
    getStatus() {
        return this.jobs.map(jobInfo => ({
            name: jobInfo.name,
            schedule: jobInfo.schedule,
            description: jobInfo.description,
            running: jobInfo.job.getStatus() === 'running'
        }));
    }


}

// Create singleton instance
const cronJobManager = new CronJobManager();

module.exports = cronJobManager; 