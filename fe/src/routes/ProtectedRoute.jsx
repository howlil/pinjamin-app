import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../utils/store';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, token } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute; 