import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '../context/NavigationContext.js';

// Import screens
import LoginScreen from '../screens/LoginScreen.js';
import StudentDashboard from '../screens/StudentDashboard.js';
import AdminDashboard from '../screens/AdminDashboard.js';
import ManagerDashboard from '../screens/ManagerDashboard.js';
import AddCompanyScreen from '../screens/AddCompanyScreen.js';
import AssignStudentScreen from '../screens/AssignStudentScreen.js';
import HiredInternsScreen from '../screens/HiredInternsScreen.js';
import CertificatesScreen from '../screens/CertificatesScreen.js';
import StudentDetailsScreen from '../screens/StudentDetailsScreen.js';
import CheckProgressScreen from '../screens/CheckProgressScreen.js';
import GenerateInternshipScreen from '../screens/GenerateInternshipScreen.js';
import InternshipRequestScreen from '../screens/InternshipRequestScreen.js';

const AppNavigator = () => {
  const { isAuthenticated, user } = useAuth();
  const { currentScreen } = useNavigation();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Render screens based on current navigation state
  switch (currentScreen) {
    case 'LoginScreen':
      return <LoginScreen />;
    case 'AdminDashboard':
      // Only show AdminDashboard if user is actually an admin
      if (user?.role === 'admin') {
        return <AdminDashboard />;
      }
      // If not admin, redirect to appropriate dashboard
      if (user?.role === 'student') {
        return <StudentDashboard />;
      }
      if (user?.role === 'manager') {
        return <ManagerDashboard />;
      }
      return <AdminDashboard />; // fallback
    case 'StudentDashboard':
      return <StudentDashboard />;
    case 'ManagerDashboard':
      return <ManagerDashboard />;
    case 'AddCompanyScreen':
      return <AddCompanyScreen />;
    case 'AssignStudentScreen':
      return <AssignStudentScreen />;
    case 'HiredInternsScreen':
      return <HiredInternsScreen />;
    case 'CertificatesScreen':
      return <CertificatesScreen />;
    case 'StudentDetailsScreen':
      return <StudentDetailsScreen />;
    case 'CheckProgressScreen':
      return <CheckProgressScreen />;
    case 'GenerateInternshipScreen':
      return <GenerateInternshipScreen />;
    case 'InternshipRequestScreen':
      return <InternshipRequestScreen />;
    default:
      // Fallback to role-based default screen
      if (user?.role === 'student') {
        return <StudentDashboard />;
      }
      if (user?.role === 'admin') {
        return <AdminDashboard />;
      }
      if (user?.role === 'manager') {
        return <ManagerDashboard />;
      }
      return (
        <View style={styles.container}>
          <Text>Unknown user role</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
