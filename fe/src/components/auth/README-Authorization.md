# Role-Based Authorization System

This document explains how to use the role-based authorization system implemented in this React application.

## Overview

The authorization system provides:
- Route-level protection based on user roles
- Component-level conditional rendering
- Permission-based access control
- Flexible role checking utilities

## Components

### 1. ProtectedRoute

Enhanced route protection with role-based authorization.

```jsx
import ProtectedRoute, { AdminProtectedRoute, UserProtectedRoute } from './routes/ProtectedRoute';

// Basic authentication check
<ProtectedRoute>
  <Component />
</ProtectedRoute>

// Admin-only routes
<AdminProtectedRoute>
  <AdminComponent />
</AdminProtectedRoute>

// User-only routes
<UserProtectedRoute>
  <UserComponent />
</UserProtectedRoute>

// Custom role requirements
<ProtectedRoute requiredRoles={['ADMIN', 'MODERATOR']}>
  <Component />
</ProtectedRoute>
```

### 2. RoleGuard Components

Conditional rendering based on user roles.

```jsx
import { RoleGuard, AdminOnly, UserOnly, AuthenticatedOnly, GuestOnly } from './components/auth/RoleGuard';

// Basic role guard
<RoleGuard requiredRoles={['ADMIN']} fallback={<div>Not authorized</div>}>
  <AdminContent />
</RoleGuard>

// Convenient shortcuts
<AdminOnly fallback={<div>Admin only</div>}>
  <AdminPanel />
</AdminOnly>

<UserOnly>
  <UserDashboard />
</UserOnly>

<AuthenticatedOnly fallback={<LoginPrompt />}>
  <ProtectedContent />
</AuthenticatedOnly>

<GuestOnly>
  <WelcomeMessage />
</GuestOnly>
```

### 3. Permission-Based Guards

Fine-grained permission control.

```jsx
import { PermissionGuard } from './components/auth/RoleGuard';

<PermissionGuard resource="users" action="delete" fallback={<div>No permission</div>}>
  <DeleteButton />
</PermissionGuard>

<PermissionGuard resource="bookings" action="create">
  <CreateBookingForm />
</PermissionGuard>
```

### 4. Role Switch

Show different content based on user role.

```jsx
import { RoleSwitch } from './components/auth/RoleGuard';

<RoleSwitch
  admin={<AdminDashboard />}
  user={<UserDashboard />}
  guest={<LoginForm />}
  fallback={<ErrorMessage />}
/>
```

## Hooks

### useAuth

Main authentication hook with role utilities.

```jsx
import { useAuth } from './hooks/useAuth';

const { 
  user, 
  isAuthenticated, 
  login, 
  logout,
  hasRole,
  hasAnyRole,
  isAdmin,
  isUser,
  canAccess,
  redirectToDashboard 
} = useAuth();

// Role checking
if (isAdmin()) {
  // Admin-specific logic
}

if (hasRole('MODERATOR')) {
  // Moderator-specific logic
}

if (hasAnyRole(['USER', 'MEMBER'])) {
  // User-specific logic
}

// Permission checking
if (canAccess('users', 'delete')) {
  // User can delete users
}
```

### useRole

Lightweight role checking hook.

```jsx
import { useRole } from './hooks/useAuth';

const { hasRole, hasAnyRole, isAdmin, isUser, currentRole } = useRole();

// Current user role
console.log('Current role:', currentRole);

// Role checks
const canManageUsers = isAdmin();
const canCreateBookings = isUser();
```

## Role Definitions

The system supports the following roles:

- **ADMIN**: Full system access, can manage all resources
- **USER**: Regular user with limited permissions
- **MEMBER**: Similar to USER with additional privileges
- **MODERATOR**: Additional role for content moderation (if needed)

## Permission System

Permissions are defined per role and resource:

```jsx
const permissions = {
  'ADMIN': {
    '*': ['*'] // Admin can do everything
  },
  'USER': {
    'profile': ['read', 'update'],
    'bookings': ['read', 'create', 'update'],
    'transactions': ['read'],
    'history': ['read'],
    'settings': ['read', 'update']
  },
  'MEMBER': {
    'profile': ['read', 'update'],
    'bookings': ['read', 'create', 'update'],
    'transactions': ['read'],
    'history': ['read'],
    'settings': ['read', 'update']
  }
};
```

## Usage Examples

### 1. Route Protection

```jsx
// AppRouter.jsx
<Route path="admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
</Route>

<Route path="/" element={<UserProtectedRoute><Layout /></UserProtectedRoute>}>
  <Route path="dashboard" element={<UserDashboard />} />
  <Route path="profile" element={<Profile />} />
</Route>
```

### 2. Conditional UI Elements

```jsx
// Navbar.jsx
<AdminOnly>
  <NavLink to="/admin">Admin Panel</NavLink>
</AdminOnly>

<UserOnly>
  <NavLink to="/dashboard">Dashboard</NavLink>
</UserOnly>

<AuthenticatedOnly fallback={<LoginButton />}>
  <UserMenu />
</AuthenticatedOnly>
```

### 3. Action Buttons

```jsx
// Component.jsx
<PermissionGuard resource="users" action="delete">
  <Button onClick={deleteUser} colorScheme="red">
    Delete User
  </Button>
</PermissionGuard>

<RoleGuard requiredRoles={['ADMIN', 'MODERATOR']}>
  <Button onClick={moderateContent}>
    Moderate Content
  </Button>
</RoleGuard>
```

### 4. Conditional Logic

```jsx
// Component.jsx
const { isAdmin, canAccess } = useAuth();

const handleSubmit = () => {
  if (canAccess('bookings', 'create')) {
    // Create booking
  } else {
    // Show error message
  }
};

return (
  <div>
    {isAdmin() && (
      <AdminToolbar />
    )}
    
    <RoleSwitch
      admin={<AdminView data={data} />}
      user={<UserView data={limitedData} />}
      fallback={<AccessDenied />}
    />
  </div>
);
```

## Best Practices

1. **Use Route-Level Protection**: Always protect routes at the router level first
2. **Graceful Fallbacks**: Provide meaningful fallback content for unauthorized access
3. **Consistent Role Names**: Use consistent role naming throughout the application
4. **Permission Granularity**: Define permissions at an appropriate level of granularity
5. **Error Handling**: Handle authorization errors gracefully with user-friendly messages
6. **Testing**: Test authorization logic thoroughly for all user roles

## Security Notes

⚠️ **Important**: Client-side authorization is for UX only. Always validate permissions on the server side for actual security.

- Role checking prevents UI confusion but doesn't provide security
- Server-side validation is required for all sensitive operations
- Tokens should be validated on every API request
- Implement proper session management and token refresh

## Migration Guide

If you're upgrading from the basic ProtectedRoute:

1. Replace `<ProtectedRoute>` with role-specific variants where needed
2. Add role requirements to existing protected routes
3. Update components to use conditional rendering guards
4. Test all authorization scenarios thoroughly 