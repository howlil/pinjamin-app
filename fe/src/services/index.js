// Core API Client
export { apiClient, withApiErrorHandling } from './core/apiClient';

// Authentication Services
export { authApi } from './auth/authService';

// Building Services  
export { buildingApi } from './building/buildingService';

// Booking Services
export { bookingApi } from './booking/bookingService';

// Facility Services
export { facilityApi } from './facility/facilityService';

// Transaction Services
export { transactionApi } from './transaction/transactionService';

// Building Manager Services
export { buildingManagerApi } from './buildingManager/buildingManagerService';

// Dashboard Services
export { dashboardApi } from './dashboard/dashboardService';

// Notification Services
export { notificationApi } from './notification/notificationService';

// User Services
export { userApi } from './user/userService';

// Re-export individual services for direct access
export { default as authService } from './auth/authService';
export { default as buildingService } from './building/buildingService';
export { default as bookingService } from './booking/bookingService';
export { default as facilityService } from './facility/facilityService';
export { default as transactionService } from './transaction/transactionService';
export { default as buildingManagerService } from './buildingManager/buildingManagerService';
export { default as dashboardService } from './dashboard/dashboardService';
export { default as notificationService } from './notification/notificationService';
export { default as userService } from './user/userService'; 