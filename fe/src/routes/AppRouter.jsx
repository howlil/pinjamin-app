import { Routes, Route } from 'react-router-dom';

// Layout Components
import Layout from '../shared/components/Layout';
import PrivateLayout from '../shared/components/PrivateLayout';

// Page Components
import AuthPage from '../features/auth/AuthPage';
import ProfilePage from '../features/auth/ProfilePage';
import HomePage from '../features/home/HomePage';
import SchedulePage from '../features/schedule/SchedulePage';
import UserTransactionPage from '../features/user/transaction/UserTransactionPage';
import UserHistoryPage from '../features/user/history/UserHistoryPage';
import BuildingDetailPage from '../features/buildingDetail/BuildingDetailPage';

// Admin Pages (for future use)
import AdminDashboardPage from '../features/admin/dashboard/AdminDashboardPage';

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

            <Route path="/admin/*" element={
                <PrivateLayout allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                </PrivateLayout>
            } />

            {/* 404 - Redirect to home */}
            <Route path="*" element={
                <Layout>
                    <HomePage />
                </Layout>
            } />
        </Routes>
    );
};

export default AppRouter; 