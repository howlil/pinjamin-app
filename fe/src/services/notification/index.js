// Export all notification related services
export { default as pusherService } from './pusherService';
export { notificationService, notificationApi } from './notificationService';

// Re-export for convenience
export default {
    pusher: () => import('./pusherService').then(m => m.default),
    api: () => import('./notificationService').then(m => m.notificationService)
}; 