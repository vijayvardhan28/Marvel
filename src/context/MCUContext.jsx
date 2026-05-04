import React, { createContext, useContext, useState, useEffect } from 'react';

const MCUContext = createContext();

export const useMCU = () => useContext(MCUContext);

export const MCUProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('mcuTrackerData');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('mcuTrackerData', JSON.stringify(userData));
  }, [userData]);

  const updateItem = (id, data) => {
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
