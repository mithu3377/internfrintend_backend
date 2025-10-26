import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ 
  children, 
  initialScreen
}) => {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [screenHistory, setScreenHistory] = useState([initialScreen]);

  const navigate = (screen) => {
    setCurrentScreen(screen);
    setScreenHistory(prev => [...prev, screen]);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(previousScreen);
      setScreenHistory(newHistory);
    }
  };

  const value = {
    currentScreen,
    navigate,
    goBack,
    screenHistory,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

