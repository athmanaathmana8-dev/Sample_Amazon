/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 * Uses dummy data instead of API calls
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Dummy users data (for sample project)
const DUMMY_USERS_KEY = 'dummy_users';
const getDummyUsers = () => {
  const stored = localStorage.getItem(DUMMY_USERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Default dummy users
  const defaultUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123'
    }
  ];
  localStorage.setItem(DUMMY_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveDummyUsers = (users) => {
  localStorage.setItem(DUMMY_USERS_KEY, JSON.stringify(users));
};

// Generate a simple token
const generateToken = (userId) => {
  return `dummy_token_${userId}_${Date.now()}`;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        // Invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getDummyUsers();
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find user
    const foundUser = users.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password
    );
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }
    
    // Create user response (without password)
    const userData = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email
    };
    
    const token = generateToken(foundUser.id);
    
    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    
    return {
      token,
      user: userData
    };
  };

  const register = async (name, email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate password
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const users = getDummyUsers();
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user already exists
    const existingUser = users.find(
      u => u.email.toLowerCase() === normalizedEmail
    );
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      password: password
    };
    
    // Add to users list
    users.push(newUser);
    saveDummyUsers(users);
    
    // Create user response (without password)
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
    
    const token = generateToken(newUser.id);
    
    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    
    return {
      token,
      user: userData
    };
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

