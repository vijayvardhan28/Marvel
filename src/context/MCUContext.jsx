import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MCUContext = createContext();

export const useMCU = () => useContext(MCUContext);

export const MCUProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`mcuTrackerData_${currentUser.id}`);
      setUserData(saved ? JSON.parse(saved) : {});
    } else {
      setUserData({});
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`mcuTrackerData_${currentUser.id}`, JSON.stringify(userData));
    }
  }, [userData, currentUser]);

  const updateItem = (id, data) => {
    if (!currentUser) return; // Prevent updates if not logged in
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

  const value = {
    userData,
    updateItem,
    markWatched,
    rateItem,
    reviewItem
  };

  return (
    <MCUContext.Provider value={value}>
      {children}
    </MCUContext.Provider>
  );
};
