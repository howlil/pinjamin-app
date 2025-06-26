const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const NotificationFactory = {
    notificationTypes: ['PAYMENT', 'BOOKING'],

    notificationTemplates: {
        PAYMENT: {
            titles: [
                'Pembayaran Berhasil',
                'Pembayaran Gagal',
                'Reminder Pembayaran',
                'Refund Diproses',
                'Konfirmasi Pembayaran'
            ],
            messages: [
                'Pembayaran booking Anda telah berhasil diproses',
                'Pembayaran booking Anda gagal diproses, silakan coba lagi',
                'Segera lakukan pembayaran untuk booking Anda',
                'Refund untuk booking Anda sedang diproses',
                'Kami telah menerima konfirmasi pembayaran Anda'
            ]
        },
        BOOKING: {
            titles: [
                'Booking Disetujui',
                'Booking Ditolak',
                'Booking Berhasil Dibuat',
                'Reminder Booking',
                'Booking Selesai'
            ],
            messages: [
                'Booking Anda telah disetujui oleh admin',
                'Booking Anda ditolak. Silakan periksa detail penolakan',
                'Booking Anda berhasil dibuat dan menunggu persetujuan admin',
                'Pengingat: Booking Anda akan dimulai besok',
                'Booking Anda telah selesai. Terima kasih telah menggunakan layanan kami'
            ]
        }
    },

    generateNotification(overrides = {}) {
        const notificationType = overrides.notificationType || faker.helpers.arrayElement(this.notificationTypes);
        const templates = this.notificationTemplates[notificationType];
        const titleIndex = faker.number.int({ min: 0, max: templates.titles.length - 1 });

        return {
            id: uuidv4(),
            notificationType,
            title: templates.titles[titleIndex],
            message: templates.messages[titleIndex],
            date: moment(faker.date.past({ years: 1 })).format('DD-MM-YYYY'),
            readStatus: faker.datatype.boolean(0.7) ? 1 : 0, // 70% chance already read
            ...overrides
        };
    },

    generateNotificationForUser(userId, overrides = {}) {
        return this.generateNotification({
            userId,
            ...overrides
        });
    },

    generateMultiple(count = 50) {
        const notifications = [];
        for (let i = 0; i < count; i++) {
            notifications.push(this.generateNotification());
        }
        return notifications;
    },

    generateByType(type, count = 10) {
        const notifications = [];
        for (let i = 0; i < count; i++) {
            notifications.push(this.generateNotification({
                notificationType: type
            }));
        }
        return notifications;
    },

    generateUnreadNotifications(count = 15) {
        const notifications = [];
        for (let i = 0; i < count; i++) {
            notifications.push(this.generateNotification({
                readStatus: 0,
                date: moment(faker.date.recent({ days: 7 })).format('DD-MM-YYYY')
            }));
        }
        return notifications;
    },

    generateBalancedNotifications(total = 40) {
        const notifications = [];
        const types = this.notificationTypes;
        const perType = Math.floor(total / types.length);

        types.forEach(type => {
            for (let i = 0; i < perType; i++) {
                notifications.push(this.generateNotification({
                    notificationType: type
                }));
            }
        });

        return notifications;
    }
};

module.exports = NotificationFactory; 