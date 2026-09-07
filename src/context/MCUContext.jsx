import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';

const MCUContext = createContext();

export const useMCU = () => useContext(MCUContext);

export const MCUProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [userData, setUserData] = useState({});
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user data from Firestore whenever the logged-in user changes
  useEffect(() => {
    if (!currentUser) {
      setUserData({});
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data().watchData || {});
          setFollowing(userDoc.data().following || []);
        } else {
          setUserData({});
          setFollowing([]);
        }
      } catch (error) {
        console.error("Failed to load user data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Save user data to Firestore whenever it changes
  useEffect(() => {
    if (!currentUser || loading) return;

    const saveUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.id);
        await setDoc(userDocRef, { 
          watchData: userData,
          following: following,
          displayName: currentUser.name || 'Agent'
        }, { merge: true });
      } catch (error) {
        console.error("Failed to save user data to Firestore:", error);
      }
    };

    // Debounce: wait 500ms after the last change before saving
    const timeout = setTimeout(saveUserData, 500);
    return () => clearTimeout(timeout);
  }, [userData, following, currentUser, loading]);

  const updateItem = (id, data) => {
    if (!currentUser) return;
    setUserData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...data
      }
    }));
  };

  const markWatched = (id, watchedStatus) => {
    updateItem(id, { watched: watchedStatus });
  };

  const rateItem = (id, rating) => {
    updateItem(id, { rating });
  };

  const reviewItem = (id, review) => {
    updateItem(id, { review });
  };

  const setCustomRating = (id, customRating) => {
    updateItem(id, { customRating, watched: true });
  };

  const toggleFollow = (targetUserId) => {
    if (!currentUser) return;
    setFollowing(prev => {
      if (prev.includes(targetUserId)) {
        return prev.filter(id => id !== targetUserId);
      } else {
        return [...prev, targetUserId];
      }
    });
  };

  const value = {
    userData,
    updateItem,
    markWatched,
    rateItem,
    reviewItem,
    setCustomRating,
    following,
    toggleFollow
  };

  return (
    <MCUContext.Provider value={value}>
      {children}
    </MCUContext.Provider>
  );
};
