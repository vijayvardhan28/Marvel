import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || 'Agent',
          email: user.email
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let errorMsg = 'Failed to log in';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
         errorMsg = 'User does not exist';
      } else if (error.code === 'auth/wrong-password') {
         errorMsg = 'Invalid password';
      }
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      // Force local update so it's immediately available without waiting for the listener
      setCurrentUser({
        id: userCredential.user.uid,
        name: name,
        email: email
      });
      return { success: true };
    } catch (error) {
      let errorMsg = 'Failed to create an account';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'User already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters';
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
