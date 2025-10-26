import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '../context/NavigationContext.js';
import apiService from '../services/ApiService';

const StudentDetailsScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState('Update Status');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [progressValue, setProgressValue] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [, setManagerCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  
  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    loadManagerData();
  }, [user, loadManagerData]);

  const loadManagerData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Check if user is a manager, if not redirect to appropriate dashboard
    if (user?.role !== 'manager') {
      if (user?.role === 'student') {
        navigate('StudentDashboard');
        return;
      } else if (user?.role === 'admin') {
        navigate('AdminDashboard');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get companies managed by this manager
      const companies = await apiService.getCompaniesByManager(user.id);
      if (companies && companies.length > 0) {
        const company = companies[0];
        setManagerCompany(company);
        
        // Get assignments for this company
        const companyAssignments = await apiService.getAssignmentsByCompany(company.id);
        setAssignments(companyAssignments);
      }
    } catch (err) {
      console.error('Error loading manager data:', err);
      setError('Failed to load student data');
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  const activeAssignments = assignments.filter(assignment => 
    assignment.status === 'assigned' || assignment.status === 'in_progress'
  );

  // Use assignment ID from route params or first available
  const assignmentId = activeAssignments[0]?.id;
  const currentAssignment = activeAssignments.find(a => a.id === assignmentId);

  const statusOptions = ['In-Progress', 'Completed'];

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsDropdownOpen(false);
  };

  const handleUpdateProgress = async () => {
    if (!currentAssignment) {
      Alert.alert('Error', 'No student assignment found. Please ensure students are assigned to your company first.');
      return;
    }

    if (selectedStatus === 'Update Status') {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    try {
      setUpdating(true);

    if (selectedStatus === 'In-Progress') {
      const progress = parseInt(progressValue, 10);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        Alert.alert('Error', 'Please enter a valid progress value (0-100)');
        return;
      }
        
        // Update assignment progress
        await apiService.updateAssignment(currentAssignment.id, {
          progress: progress,
          status: 'in_progress',
        });
        
      Alert.alert('Success', `Progress updated to ${progress}%`);
    } else if (selectedStatus === 'Completed') {
        // Complete the internship
        await apiService.updateAssignment(currentAssignment.id, {
          status: 'completed',
          endDate: new Date().toISOString(),
        });
        
      Alert.alert('Success', 'Internship marked as completed!');
      }

      // Refresh data
      loadManagerData();
      
    } catch (err) {
      console.error('Error updating progress:', err);
      Alert.alert('Error', 'Failed to update progress. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!currentAssignment) {
      Alert.alert('Error', 'No assignment selected');
      return;
    }

    if (currentAssignment.status !== 'completed') {
      Alert.alert('Error', 'Internship must be completed before issuing certificate');
      return;
    }

    try {
      setUpdating(true);
      
      // Create certificate
      const certificateData = {
        assignmentId: currentAssignment.id,
        studentId: currentAssignment.studentId,
        companyId: currentAssignment.companyId,
        studentName: currentAssignment.studentName,
        companyName: currentAssignment.companyName,
        issueDate: new Date().toISOString(),
        duration: '3 months',
        skillsAcquired: 'Various technical skills',
        projectDescription: 'Internship project completion',
        isVerified: true,
      };

      await apiService.createCertificate(certificateData);
      
      // Update assignment to mark certificate as issued
      await apiService.updateAssignment(currentAssignment.id, {
        certificateIssued: true,
      });
      
    Alert.alert('Success', 'Certificate issued successfully!');
      
      // Refresh data
      loadManagerData();
      
    } catch (err) {
      console.error('Error issuing certificate:', err);
      Alert.alert('Error', 'Failed to issue certificate. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.loadingText}>Loading student details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadManagerData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigate('ManagerDashboard')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Details</Text>
      </View>

      {/* Student Information Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Student Name</Text>
          <Text style={styles.tableValue}>
            {currentAssignment?.studentName || 'No assignment'}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Company</Text>
          <Text style={styles.tableValue}>
            {currentAssignment?.companyName || 'Not assigned'}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Status</Text>
          <Text style={styles.tableValue}>
            {currentAssignment?.status || 'Not assigned'}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Progress</Text>
          <Text style={styles.tableValue}>
            {currentAssignment?.progress || 0}%
          </Text>
        </View>
      </View>

      {/* No Assignment Message */}
      {!currentAssignment && (
        <View style={styles.noAssignmentContainer}>
          <Text style={styles.noAssignmentText}>
            No student assignments found. Students need to be assigned to your company before you can update their progress.
          </Text>
          <TouchableOpacity 
            style={styles.backToDashboardButton}
            onPress={() => navigate('ManagerDashboard')}
          >
            <Text style={styles.backToDashboardText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Update Status Section */}
      {currentAssignment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Status</Text>
        
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.dropdownText}>{selectedStatus}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownOptions}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownOption}
                onPress={() => handleStatusSelect(option)}
              >
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedStatus === 'In-Progress' && (
          <View style={styles.progressInputContainer}>
            <Text style={styles.progressLabel}>Progress (0-100):</Text>
            <TextInput
              style={styles.progressInput}
              placeholder="Enter progress percentage"
              placeholderTextColor="#999"
              value={progressValue}
              onChangeText={setProgressValue}
              keyboardType="numeric"
            />
          </View>
        )}
        </View>
      )}

      {/* Action Buttons */}
      {currentAssignment && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.updateButton, updating && styles.disabledButton]} 
            onPress={handleUpdateProgress}
            disabled={updating}
          >
            <Text style={styles.buttonText}>
              {updating ? 'Updating...' : 'Update Progress'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.uploadButton,
              (currentAssignment?.status !== 'completed' || updating) && styles.disabledButton
            ]} 
            onPress={handleIssueCertificate}
            disabled={currentAssignment?.status !== 'completed' || updating}
          >
            <Text style={[
              styles.buttonText,
              (currentAssignment?.status !== 'completed' || updating) && styles.disabledButtonText
            ]}>
              {updating ? 'Issuing...' : 'Issue Certificate'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer Text */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Certification of completion</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667EEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  tableValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
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
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  updateButton: {
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
  uploadButton: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
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
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
  progressInputContainer: {
    marginTop: 15,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  progressInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  disabledButtonText: {
    color: '#999',
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
  noAssignmentContainer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  noAssignmentText: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  backToDashboardButton: {
    backgroundColor: '#667EEA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backToDashboardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentDetailsScreen;
