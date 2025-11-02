import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '../context/NavigationContext.js';
import apiService from '../services/ApiService.js';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const [managerCompany, setManagerCompany] = useState(null);
  const [activeInterns, setActiveInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagerData();
  }, []);

  const loadManagerData = async () => {
    try {
      setLoading(true);
      // Load manager's companies
      const companies = await apiService.getCompaniesByManager(user?.id || 0);
      
      if (companies && companies.length > 0) {
        setManagerCompany(companies[0]);
        
        // Load active interns for this company
        const interns = await apiService.getAssignmentsByCompany(companies[0].companyID);
        setActiveInterns(interns || []);
      }
    } catch (error) {
      console.error('ManagerDashboard: Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.buildingIcon}>🏢</Text>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <Text style={styles.userName}>{user?.name || user?.username}</Text>
          <Text style={styles.companyName}>{managerCompany?.name || 'Company Not Found'}</Text>
          <Text style={styles.internshipCount}>
            Active Interns: {activeInterns.length}/{managerCompany?.maxInternships || 0}
          </Text>
          <Text style={styles.areaOfDev}>Area: {managerCompany?.area || 'Not Specified'}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigate('AddCompanyScreen')}
        >
          <Text style={styles.actionButtonText}>+ Add Company</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigate('GenerateInternshipScreen')}
        >
          <Text style={styles.actionButtonText}>+ Add Internship</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigate('CheckProgressScreen')}
        >
          <Text style={styles.actionButtonText}>Check Intern Progress</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigate('StudentDetailsScreen')}
        >
          <Text style={styles.actionButtonText}>Add Progress / Certificate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.actionButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  welcomeBanner: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildingIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  internshipCount: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  areaOfDev: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManagerDashboard;
