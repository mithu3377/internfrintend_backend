import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { AuthProvider } from './src/context/AuthContext.js';
import { InternshipProvider } from './src/context/InternshipContext.js';
import { NavigationProvider } from './src/context/NavigationContext.js';
import AppNavigator from './src/navigation/AppNavigator.js';

const AppContent = () => {
  return <AppNavigator />;
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthProvider>
      <InternshipProvider>
        <NavigationProvider initialScreen="LoginScreen">
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
        </NavigationProvider>
      </InternshipProvider>
    </AuthProvider>
  );
}

export default App;
