import { Routes, Route } from 'react-router-dom';
// Public pages
import HomePage from '../pages/public/HomePage';
import RoomDetailPage from '../pages/public/RoomDetailPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import SchedulePage from '../pages/public/SchedulePage';
import NotFoundPage from '../pages/public/NotFoundPage';

// User pages
import UserDashboardPage from '../pages/user/DashboardPage';
import UserProfilePage from '../pages/user/ProfilePage';
import BookingHistoryPage from '../pages/user/BookingHistoryPage';
import TransactionsPage from '../pages/user/TransactionsPage';
import HistoryPage from '../pages/user/HistoryPage';
import SettingsPage from '../pages/user/SettingsPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/DashboardPage';
import AdminGedungPage from '../pages/admin/GedungPage';
import AdminPeminjamanPage from '../pages/admin/PeminjamanPage';
import AdminTransaksiPage from '../pages/admin/TransaksiPage';
import AdminFasilitasPage from '../pages/admin/FasilitasPage';
import AdminRiwayatPage from '../pages/admin/RiwayatPage';

// Layouts
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout/Layout';
import PublicLayout from '../components/Layout/PublicLayout';
import AdminLayout from '../components/Layout/AdminLayout';

const AppRouter = () => {
    return (
        <Routes>
            {/* Auth Routes (LoginPage and RegisterPage already use AuthLayout internally) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="room/:roomId" element={<RoomDetailPage />} />
                <Route path="schedule" element={<SchedulePage />} />
            </Route>

            {/* User Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="dashboard" element={<UserDashboardPage />} />
                <Route path="profile" element={<UserProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="bookings" element={<BookingHistoryPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="history" element={<HistoryPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="gedung" element={<AdminGedungPage />} />
                <Route path="peminjaman" element={<AdminPeminjamanPage />} />
                <Route path="transaksi" element={<AdminTransaksiPage />} />
                <Route path="fasilitas" element={<AdminFasilitasPage />} />
                <Route path="riwayat" element={<AdminRiwayatPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter; 