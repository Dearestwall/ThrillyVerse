// src/lib/utils/permissions.ts - COMPLETE & ERROR-FREE

// Define UserRole type inline
type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin';

// Role hierarchy levels
const ROLE_LEVELS: Record<UserRole, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
  superadmin: 3,
};

// Check if user has minimum required role
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
};

// Check if user is admin or higher
export const isAdmin = (userRole: UserRole): boolean => {
  return hasRole(userRole, 'admin');
};

// Check if user is superadmin
export const isSuperAdmin = (userRole: UserRole): boolean => {
  return userRole === 'superadmin';
};

// Check if user can manage other users
export const canManageUsers = (userRole: UserRole, targetUserRole: UserRole): boolean => {
  // Superadmin can manage anyone
  if (isSuperAdmin(userRole)) return true;

  // Admin can manage users and moderators, but not other admins
  if (userRole === 'admin') {
    return targetUserRole === 'user' || targetUserRole === 'moderator';
  }

  // Moderators can't manage users
  return false;
};

// Check if user can approve materials
export const canApproveMaterials = (userRole: UserRole): boolean => {
  return hasRole(userRole, 'moderator');
};

// Check if user can create quizzes
export const canCreateQuizzes = (userRole: UserRole): boolean => {
  return hasRole(userRole, 'admin');
};

// Check if user can edit site settings
export const canEditSiteSettings = (userRole: UserRole): boolean => {
  return hasRole(userRole, 'admin');
};

// Check if user can make others admin
export const canMakeAdmin = (userRole: UserRole): boolean => {
  return isSuperAdmin(userRole);
};

// Check if user can delete content
export const canDeleteContent = (userRole: UserRole): boolean => {
  return hasRole(userRole, 'admin');
};

// Check if user can ban other users
export const canBanUsers = (userRole: UserRole, targetUserRole: UserRole): boolean => {
  // Can't ban admins or superadmins
  if (hasRole(targetUserRole, 'admin')) return false;

  return hasRole(userRole, 'moderator');
};

// Get permissions for a role
export const getPermissions = (userRole: UserRole) => {
  return {
    canManageUsers: hasRole(userRole, 'admin'),
    canApproveMaterials: canApproveMaterials(userRole),
    canCreateQuizzes: canCreateQuizzes(userRole),
    canEditSiteSettings: canEditSiteSettings(userRole),
    canMakeAdmin: canMakeAdmin(userRole),
    canDeleteContent: canDeleteContent(userRole),
    canBanUsers: hasRole(userRole, 'moderator'),
    canAccessAdminPanel: hasRole(userRole, 'moderator'),
    canEditHomepage: hasRole(userRole, 'admin'),
    canViewAnalytics: hasRole(userRole, 'admin'),
    canManageCategories: hasRole(userRole, 'admin'),
  };
};

// Export UserRole type for use in other files
export type { UserRole };