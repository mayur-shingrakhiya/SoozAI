import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem('soozai_current_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      // Get all users from localStorage
      const usersData = localStorage.getItem('soozai_users') || '[]';
      const users = JSON.parse(usersData);

      // Find user with matching credentials
      const foundUser = users.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('soozai_current_user', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
      }

      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // Register new user
  const register = async (email, password, name) => {
    try {
      // Get existing users
      const usersData = localStorage.getItem('soozai_users') || '[]';
      const users = JSON.parse(usersData);

      // Check if user already exists
      if (users.some(u => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password, // In production, this should be hashed
        name: name || email.split('@')[0],
        provider: 'email',
        createdAt: new Date().toISOString(),
        profilePicture: null
      };

      // Add to users array
      users.push(newUser);
      localStorage.setItem('soozai_users', JSON.stringify(users));

      // Initialize user's data file
      initializeUserData(newUser.id);

      // Log in the user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('soozai_current_user', JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  // Login with Google
  const loginWithGoogle = async (googleUser) => {
    try {
      const { email, name, picture, sub } = googleUser;

      // Get existing users
      const usersData = localStorage.getItem('soozai_users') || '[]';
      const users = JSON.parse(usersData);

      // Check if user exists
      let existingUser = users.find(u => u.email === email && u.provider === 'google');

      if (!existingUser) {
        // Create new Google user
        existingUser = {
          id: `user_google_${sub}_${Date.now()}`,
          email,
          name,
          profilePicture: picture,
          provider: 'google',
          googleId: sub,
          createdAt: new Date().toISOString()
        };

        users.push(existingUser);
        localStorage.setItem('soozai_users', JSON.stringify(users));

        // Initialize user data
        initializeUserData(existingUser.id);
      }

      // Log in the user
      setUser(existingUser);
      setIsAuthenticated(true);
      localStorage.setItem('soozai_current_user', JSON.stringify(existingUser));

      return { success: true, user: existingUser };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Google login failed' };
    }
  };

  // Initialize user data structure
  const initializeUserData = (userId) => {
    const userDataKey = `soozai_user_data_${userId}`;
    const initialData = {
      userId,
      chats: [],
      settings: {
        theme: 'dark',
        streamingEnabled: true
      },
      profile: {
        preferences: {},
        lastActive: new Date().toISOString()
      }
    };

    localStorage.setItem(userDataKey, JSON.stringify(initialData));
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('soozai_current_user');
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('soozai_current_user', JSON.stringify(updatedUser));

    // Update in users list
    const usersData = localStorage.getItem('soozai_users') || '[]';
    const users = JSON.parse(usersData);
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('soozai_users', JSON.stringify(users));
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
