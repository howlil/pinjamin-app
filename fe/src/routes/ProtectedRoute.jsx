import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../utils/store';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, token } = useAuthStore();
    const location = useLocation();

    // Check if user is authenticated and has valid token
    if (!isAuthenticated || !token) {
        // Redirect to login with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute; 