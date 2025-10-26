import React, { useState, useEffect, useCallback } from 'react';
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
import apiService from '../services/ApiService';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudentData();
  }, [user, loadStudentData]);

  const loadStudentData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get student by user ID
      const studentData = await apiService.getStudentByUserId(user.id);
      if (studentData) {
        setStudent(studentData);
        // Get assignments for this student
        const studentAssignments = await apiService.getAssignmentsByStudent(studentData.id);
        setAssignments(studentAssignments);
      }
    } catch (err) {
      console.error('Error loading student data:', err);
      setError('Failed to load student data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const currentAssignment = assignments.find(assignment => 
    assignment.status === 1 || assignment.status === 2
  );

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Not Assigned';
      case 2: return 'Assigned';
      case 3: return 'In Progress';
      case 4: return 'Completed';
      default: return 'Not Assigned';
    }
  };

  const getCertificateText = (certificateStatus) => {
    switch (certificateStatus) {
      case 1: return 'Not Available';
      case 2: return 'In Progress';
      case 3: return 'Issued';
      default: return 'Not Available';
    }
  };

  const getCompanyName = () => {
    if (currentAssignment) {
      return currentAssignment.companyName;
    }
    if (student?.assignedCompanyName) {
      return student.assignedCompanyName;
    }
    return 'Not Assigned';
  };

  const getInternshipStatus = () => {
    if (currentAssignment) {
      return getStatusText(currentAssignment.status);
    }
    if (student?.internshipStatus) {
      return getStatusText(student.internshipStatus);
    }
    return 'Not Assigned';
  };

  const getCertificateStatus = () => {
    if (currentAssignment) {
      return getCertificateText(currentAssignment.certificateIssued ? 3 : 1);
    }
    if (student?.certificateStatus) {
      return getCertificateText(student.certificateStatus);
    }
    return 'Not Available';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStudentData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.graduationIcon}>🎓</Text>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
      </View>

      {/* Student Information */}
      {student && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>🎓</Text>
              <Text style={styles.statusLabel}>Registration No :</Text>
              <Text style={styles.statusValue}>{student.regNo}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>💻</Text>
              <Text style={styles.statusLabel}>Technology :</Text>
              <Text style={styles.statusValue}>{student.technology}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>📋</Text>
              <Text style={styles.statusLabel}>Interest Shown :</Text>
              <Text style={styles.statusValue}>{student.hasShownInterest ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Internship Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Internship Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>🏢</Text>
            <Text style={styles.statusLabel}>Company :</Text>
            <Text style={styles.statusValue}>
              {getCompanyName()}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>📊</Text>
            <Text style={styles.statusLabel}>Status :</Text>
            <Text style={styles.statusValue}>
              {getInternshipStatus()}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>📜</Text>
            <Text style={styles.statusLabel}>Certificate :</Text>
            <Text style={styles.statusValue}>
              {getCertificateStatus()}
            </Text>
          </View>
          {currentAssignment?.progress !== undefined && (
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>📈</Text>
              <Text style={styles.statusLabel}>Progress :</Text>
              <Text style={styles.statusValue}>{currentAssignment.progress}%</Text>
            </View>
          )}
        </View>
      </View>

      {/* History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        <View style={styles.historyCard}>
          <Text style={styles.historyLabel}>Past Internships:</Text>
          <Text style={styles.historyValue}>
            {assignments.filter(a => a.status === 3).length}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.requestButton}
          onPress={() => navigate('InternshipRequestScreen')}
        >
          <Text style={styles.buttonText}>Request For Internship</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
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
  welcomeBanner: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  graduationIcon: {
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
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    color: '#666',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyValue: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
  },
  requestButton: {
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5722',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#667EEA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentDashboard;
