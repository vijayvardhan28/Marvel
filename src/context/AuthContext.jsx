import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mcuCurrentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('mcuUsers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mcuCurrentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mcuCurrentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mcuUsers', JSON.stringify(users));
  }, [users]);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    const emailExists = users.some(u => u.email === email);
    if (!emailExists) {
      return { success: false, error: 'User does not exist' };
    }
    return { success: false, error: 'Invalid password' };
  };

  const signup = (name, email, password) => {
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
