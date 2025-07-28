import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';


// Create the Auth Context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize authentication state from localStorage on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // For demo purposes using hardcoded credentials
      // In production, this would make an API call
      if (email === 'admin@arsanexus.com' && password === 'adminpass') {
        const userData = {
          id: '1',
          email,
          name: 'Admin User',
          role: 'admin'
        };
        
        localStorage.setItem('admin_token', 'demo_token');
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else if (email === 'manager@arsanexus.com' && password === 'manager123') {
        const userData = {
          id: '2',
          email,
          name: 'Manager User',
          role: 'manager'
        };
        
        localStorage.setItem('admin_token', 'demo_token');
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else if (email === 'employee@arsanexus.com' && password === 'employee123') {
        const userData = {
          id: '3',
          email,
          name: 'Employee User',
          role: 'employee'
        };
        
        localStorage.setItem('admin_token', 'demo_token');
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    router.push('/admin/login');
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    
    try {
      // This would make an API call in production
      // For now, just simulate a successful registration
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        role: 'user'
      };
      
      setLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return { success: false, message: 'Registration failed' };
    }
  };

  // Check if user has permission for a specific action
  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // For managers and employees, we would check specific permissions
    // This is a simplified implementation
    const rolePermissions = {
      manager: ['view_dashboard', 'manage_content', 'manage_users', 'edit_pages'],
      employee: ['view_dashboard', 'view_content']
    };
    
    return user.role && rolePermissions[user.role]?.includes(permission);
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    hasPermission,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;