// /contexts/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { employees, ROLES } from '@/utils/constants';

// Create context
const AuthContext = createContext();

// Auth Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthContext: Checking localStorage...');
    
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('✅ AuthContext: Found user:', userData.name);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ AuthContext: Error parsing user:', error);
        localStorage.removeItem('user');
      }
    }
    
    console.log('🏁 AuthContext: Loading complete');
    setLoading(false);
  }, []);

  const login = (employeeId, password) => {
    console.log('🔑 Login attempt for:', employeeId);
    
    // Find employee in the imported employees array
    const employee = employees.find(emp => 
      emp.id === employeeId && emp.password === password
    );
    
    if (employee) {
      console.log('✅ Login successful for:', employee.name);
      
      // Create user object without password
      const userData = {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        shift: employee.shift,
        role: employee.role,
        department: employee.department
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    }
    
    console.log('❌ Login failed');
    return { success: false, message: 'Invalid Employee ID or password' };
  };

  const logout = () => {
    console.log('👋 Logging out:', user?.name);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};