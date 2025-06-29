const BookingService = require('../services/booking.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const BookingController = {
    // Get today's bookings
    async getTodayBookings(req, res) {
        try {
            const bookings = await BookingService.getTodayBookings();
            return ResponseHelper.success(res, 'Booking hari ini berhasil diambil', bookings);
        } catch (error) {
            logger.error('Get today bookings controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil booking hari ini', 500);
        }
    },

    // Create booking
    async createBooking(req, res) {
        try {
            const userId = req.user.id;
            const bookingData = req.body;
            const proposalLetter = req.file;

            if (!proposalLetter) {
                return ResponseHelper.validationError(res, 'Proposal letter wajib diupload');
            }

            const result = await BookingService.createBooking(userId, bookingData, proposalLetter);
            return ResponseHelper.success(res, 'Booking berhasil dibuat', result, 201);
        } catch (error) {
            logger.error('Create booking controller error:', error);

            if (error.message === 'Building tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message.includes('tidak tersedia')) {
                return ResponseHelper.conflict(res, error.message);
            }

            if (error.message.includes('Gagal membuat invoice pembayaran')) {
                return ResponseHelper.error(res, error.message, 503);
            }

            if (error.message.includes('Xendit') || error.message.includes('invoice')) {
                return ResponseHelper.error(res, 'Layanan pembayaran sedang tidak tersedia. Silakan coba lagi nanti.', 503);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat membuat booking', 500);
        }
    },

    // Process payment
    async processPayment(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await BookingService.processPayment(id, userId);
            return ResponseHelper.success(res, 'Payment berhasil diproses', result);
        } catch (error) {
            logger.error('Process payment controller error:', error);

            if (error.message === 'Booking tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message === 'Tidak memiliki akses ke booking ini') {
                return ResponseHelper.forbidden(res, error.message);
            }

            if (error.message.includes('tidak bisa')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat memproses payment', 500);
        }
    },

    // Get booking history
    async getBookingHistory(req, res) {
        try {
            const userId = req.user.id;
            const { status, page, limit } = req.query;

            const result = await BookingService.getBookingHistory(userId, { status }, { page, limit });

            return ResponseHelper.successWithPagination(
                res,
                'History booking berhasil diambil',
                result.bookings,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Get booking history controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil history booking', 500);
        }
    },

    // Generate invoice
    async generateInvoice(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const invoice = await BookingService.generateInvoice(id, userId);
            return ResponseHelper.success(res, 'Invoice berhasil dibuat', invoice);
        } catch (error) {
            logger.error('Generate invoice controller error:', error);

            if (error.message === 'Booking tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message === 'Tidak memiliki akses ke booking ini') {
                return ResponseHelper.forbidden(res, error.message);
            }

            if (error.message.includes('belum')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat membuat invoice', 500);
        }
    },

    // ===== ADMIN FUNCTIONS =====

    // Get bookings with filters (admin)
    async adminGetBookings(req, res) {
        try {
            const { page, limit } = req.query;

            const result = await BookingService.adminGetBookings({
                page,
                limit
            });

            return ResponseHelper.successWithPagination(
                res,
                'Data booking berhasil diambil',
                result.bookings,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Admin get bookings controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil data booking', 500);
        }
    },

    // Approve/Reject booking
    async approveRejectBooking(req, res) {
        try {
            const { id } = req.params;
            const { bookingStatus, rejectionReason } = req.body;

            const result = await BookingService.approveRejectBooking(id, bookingStatus, rejectionReason);
            return ResponseHelper.success(res, 'Status booking berhasil diperbarui', result);
        } catch (error) {
            logger.error('Admin approve/reject booking controller error:', error);

            if (error.message === 'Booking tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message.includes('tidak bisa')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat memperbarui status booking', 500);
        }
    },

    // Get booking history with filters (admin)
    async adminGetBookingHistory(req, res) {
        try {
            const { buildingId, startDate, endDate, page, limit } = req.query;

            const result = await BookingService.adminGetBookingHistory({
                buildingId, startDate, endDate, page, limit
            });

            return ResponseHelper.successWithPagination(
                res,
                'History booking berhasil diambil',
                result.bookings,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Admin get booking history controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil history booking', 500);
        }
    },

    // Process refund
    async processRefund(req, res) {
        try {
            const { id } = req.params;
            const { refundReason } = req.body;

            const result = await BookingService.processRefund(id, refundReason);
            return ResponseHelper.success(res, 'Refund berhasil diproses', result);
        } catch (error) {
            logger.error('Admin process refund controller error:', error);

            if (error.message === 'Booking tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message.includes('tidak bisa')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat memproses refund', 500);
        }
    },

    // ===== CRONJOB FUNCTIONS =====

    // Get cronjob status (admin)
    async getCronjobStatus(req, res) {
        try {
            const cronJobManager = require('../cronjob');
            const status = cronJobManager.getStatus();

            return ResponseHelper.success(res, 'Status cronjob berhasil diambil', {
                cronjobs: status,
                serverTime: new Date().toISOString(),
                timezone: 'Asia/Jakarta'
            });
        } catch (error) {
            logger.error('Get cronjob status controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil status cronjob', 500);
        }
    }
};

module.exports = BookingController; 