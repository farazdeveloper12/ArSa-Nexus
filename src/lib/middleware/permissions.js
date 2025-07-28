// lib/middleware/permissions.js
export const roles = {
  USER: 'user',
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

export const roleHierarchy = {
  [roles.USER]: 1,
  [roles.EMPLOYEE]: 2,
  [roles.MANAGER]: 3,
  [roles.ADMIN]: 4
};

export const checkPermission = (requiredRole) => async (req, res, next) => {
  const userRole = req.user.role;
  
  // Ensure role exists in our hierarchy
  if (!userRole || !roleHierarchy[userRole]) {
    return res.status(403).json({ success: false, message: 'Invalid user role' });
  }
  
  if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
    return next();
  }
  
  return res.status(403).json({ success: false, message: 'You do not have permission to access this resource' });
};