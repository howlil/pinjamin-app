import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout/Layout';
import PublicLayout from '../components/Layout/PublicLayout';

// Pages (will be created)
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import SchedulePage from '../pages/SchedulePage';
import HistoryPage from '../pages/HistoryPage';
import TransactionsPage from '../pages/TransactionsPage';
import SettingsPage from '../pages/SettingsPage';

const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={
                <PublicLayout>
                    <HomePage />
                </PublicLayout>
            } />
            <Route path="/schedule" element={
                <PublicLayout>
                    <SchedulePage />
                </PublicLayout>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Layout>
                        <DashboardPage />
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="/profile" element={
                <ProtectedRoute>
                    <Layout>
                        <ProfilePage />
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="/history" element={
                <ProtectedRoute>
                    <Layout>
                        <HistoryPage />
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="/transactions" element={
                <ProtectedRoute>
                    <Layout>
                        <TransactionsPage />
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="/settings" element={
                <ProtectedRoute>
                    <Layout>
                        <SettingsPage />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* 404 Not Found */}
            <Route path="/404" element={
                <PublicLayout>
                    <NotFoundPage />
                </PublicLayout>
            } />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

export default AppRouter; 