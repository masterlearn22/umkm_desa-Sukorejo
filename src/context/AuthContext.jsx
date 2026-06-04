import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('umkm-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('umkm-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('umkm-user');
    }
  }, [user]);

  const login = (userData) => {
    // Merge with any existing user data just in case, or overwrite
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user,
      login, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
