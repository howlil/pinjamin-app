import { Routes, Route } from 'react-router-dom';

// Layout Components
import Layout from '../shared/components/Layout';
import PrivateLayout from '../shared/components/PrivateLayout';
import PrivateAdminLayout from '../shared/components/PrivateAdminLayout';

// Page Components
import AuthPage from '../features/auth/AuthPage';
import ProfilePage from '../features/auth/ProfilePage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import HomePage from '../features/home/HomePage';
import SchedulePage from '../features/schedule/SchedulePage';
import UserTransactionPage from '../features/user/transaction/UserTransactionPage';
import UserHistoryPage from '../features/user/history/UserHistoryPage';
import BuildingDetailPage from '../features/buildingDetail/BuildingDetailPage';

// Payment Pages
import PaymentSuccessPage from '../features/payment/PaymentSuccessPage';
import PaymentFailedPage from '../features/payment/PaymentFailedPage';

// Error Pages
import NotFoundPage from '../shared/components/NotFoundPage';

// Admin Router
import AdminRouter from './AdminRouter';

const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={
                <Layout>
                    <HomePage />
                </Layout>
            } />

            <Route path="/schedule" element={
                <Layout>
                    <SchedulePage />
                </Layout>
            } />

            <Route path="/building/:id" element={
                <Layout>
                    <BuildingDetailPage />
                </Layout>
            } />

            {/* Auth Routes (without navbar) */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Private Routes for Borrowers */}
            <Route path="/transaction" element={
                <PrivateLayout allowedRoles={['BORROWER']}>
                    <UserTransactionPage />
                </PrivateLayout>
            } />

            <Route path="/history" element={
                <PrivateLayout allowedRoles={['BORROWER']}>
                    <UserHistoryPage />
                </PrivateLayout>
            } />

            <Route path="/profile" element={
                <PrivateLayout allowedRoles={['BORROWER', 'ADMIN']}>
                    <ProfilePage />
                </PrivateLayout>
            } />

            {/* Payment Routes */}
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/failed" element={<PaymentFailedPage />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
                <PrivateAdminLayout allowedRoles={['ADMIN']}>
                    <AdminRouter />
                </PrivateAdminLayout>
            } />

            {/* 404 - Not Found Page */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter; 