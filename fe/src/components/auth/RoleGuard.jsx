import { useRole, useAuth } from '../../hooks/auth';
import { useAuthStore } from '../../utils/store';

// Component to conditionally render content based on user roles
export const RoleGuard = ({
    children,
    requiredRoles = [],
    fallback = null,
    requireAll = false
}) => {
    const { hasRole, hasAnyRole } = useRole();

    // If no roles specified, render children
    if (!requiredRoles.length) {
        return children;
    }

    // Check if user has required role(s)
    let hasAccess = false;

    if (requireAll) {
        // User must have ALL specified roles
        hasAccess = requiredRoles.every(role => hasRole(role));
    } else {
        // User must have at least ONE of the specified roles
        hasAccess = hasAnyRole(requiredRoles);
    }

    return hasAccess ? children : fallback;
};

// Specific role guards for common use cases
export const AdminOnly = ({ children, fallback = null }) => (
    <RoleGuard requiredRoles={['ADMIN']} fallback={fallback}>
        {children}
    </RoleGuard>
);

export const BorrowerOnly = ({ children, fallback = null }) => (
    <RoleGuard requiredRoles={['BORROWER']} fallback={fallback}>
        {children}
    </RoleGuard>
);

// Legacy alias untuk backward compatibility
export const UserOnly = ({ children, fallback = null }) => (
    <RoleGuard requiredRoles={['BORROWER']} fallback={fallback}>
        {children}
    </RoleGuard>
);

// Component to show content for authenticated users only (any role)
export const AuthenticatedOnly = ({ children, fallback = null }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : fallback;
};

// Component to show content for guests only (not authenticated)
export const GuestOnly = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return !isAuthenticated ? children : null;
};

// Higher-order component to wrap components with role protection
export const withRoleGuard = (Component, requiredRoles = []) => {
    return (props) => (
        <RoleGuard requiredRoles={requiredRoles}>
            <Component {...props} />
        </RoleGuard>
    );
};

// Component for permission-based rendering
export const PermissionGuard = ({
    children,
    resource,
    action = 'read',
    fallback = null
}) => {
    const { canAccess } = useAuth();

    const hasPermission = canAccess(resource, action);
    return hasPermission ? children : fallback;
};

// Component to show different content based on user role
export const RoleSwitch = ({
    admin = null,
    borrower = null,
    user = null, // Legacy alias for borrower
    guest = null,
    fallback = null
}) => {
    const { isAdmin, isBorrower } = useRole();
    const { isAuthenticated } = useAuthStore();

    if (isAdmin() && admin) return admin;
    if (isBorrower() && (borrower || user)) return borrower || user;
    if (!isAuthenticated && guest) return guest;

    return fallback;
};

export default RoleGuard; 