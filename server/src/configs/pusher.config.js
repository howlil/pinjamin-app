const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || '1957601',
    key: process.env.PUSHER_KEY || '862d5f8def70ea57a72d',
    secret: process.env.PUSHER_SECRET || '642687db486451c8bb28',
    cluster: process.env.PUSHER_CLUSTER || 'ap1',
    useTLS: true
});

module.exports = pusher; 