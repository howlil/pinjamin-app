import { Routes, Route } from 'react-router-dom';
// Public pages
import HomePage from '../pages/public/HomePage';
import RoomDetailPage from '../pages/public/RoomDetailPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import SchedulePage from '../pages/public/SchedulePage';
import NotFoundPage from '../pages/public/NotFoundPage';

// User pages
import UserProfilePage from '../pages/user/ProfilePage';
import TransactionsPage from '../pages/user/TransactionsPage';
import HistoryPage from '../pages/user/HistoryPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/DashboardPage';
import AdminGedungPage from '../pages/admin/GedungPage';
import AdminPeminjamanPage from '../pages/admin/PeminjamanPage';
import AdminTransaksiPage from '../pages/admin/TransaksiPage';
import AdminFasilitasPage from '../pages/admin/FasilitasPage';
import AdminRiwayatPage from '../pages/admin/RiwayatPage';
import AdminPengelolaPage from '../pages/admin/PengelolaPage';
import AdminProfilePage from '../pages/admin/ProfilePage';

// Layouts
import ProtectedRoute, { AdminProtectedRoute, BorrowerProtectedRoute } from './ProtectedRoute';
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

            {/* Borrower Protected Routes - Only accessible by BORROWER role */}
            <Route path="/" element={<BorrowerProtectedRoute><Layout /></BorrowerProtectedRoute>}>
                <Route path="profile" element={<UserProfilePage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="history" element={<HistoryPage />} />
            </Route>

            {/* Admin Routes - Only accessible by ADMIN role */}
            <Route path="admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="gedung" element={<AdminGedungPage />} />
                <Route path="fasilitas" element={<AdminFasilitasPage />} />
                <Route path="pengelola" element={<AdminPengelolaPage />} />
                <Route path="peminjaman" element={<AdminPeminjamanPage />} />
                <Route path="transaksi" element={<AdminTransaksiPage />} />
                <Route path="riwayat" element={<AdminRiwayatPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter; 