import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '../context/NavigationContext.js';
import apiService from '../services/ApiService.js';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load the logged-in student's record
        let normalizedStudent = null;
        try {
          const studentRecord = await apiService.getStudentByUserId(user?.id || 0);
          normalizedStudent = Array.isArray(studentRecord) ? studentRecord[0] : studentRecord;
        } catch (innerErr) {
          // If not found or 404, fall back to loading all students and finding by UserID or Name
          const message = (innerErr && innerErr.message ? innerErr.message : '').toLowerCase();
          if (message.includes('not found') || message.includes('404')) {
            try {
              const all = await apiService.getStudents();
              const byId = all.find(s => s.userID === user?.id || s.UserID === user?.id) || null;
              if (byId) {
                normalizedStudent = byId;
              } else if (user?.name) {
                const uname = (user.name || '').toLowerCase();
                normalizedStudent = all.find(s => (s.name || s.Name || '').toLowerCase() === uname) || null;
              }
            } catch (fallbackErr) {
              console.warn('StudentDashboard: Fallback load of students failed:', fallbackErr);
            }
          } else {
            throw innerErr;
          }
        }
        // Normalize to a consistent camelCase object for reliable rendering/status
        const normalizedCamel = normalizedStudent ? {
          studentID: normalizedStudent.studentID ?? normalizedStudent.StudentID,
          userID: normalizedStudent.userID ?? normalizedStudent.UserID,
          name: normalizedStudent.name ?? normalizedStudent.Name,
          regNo: normalizedStudent.regNo ?? normalizedStudent.RegNo,
          technology: normalizedStudent.technology ?? normalizedStudent.Technology,
          hasShownInterest: normalizedStudent.hasShownInterest ?? normalizedStudent.HasShownInterest ?? (normalizedStudent.internshipStatus ?? normalizedStudent.InternshipStatus) === 1,
          assignedCompanyID: normalizedStudent.assignedCompanyID ?? normalizedStudent.AssignedCompanyID ?? null,
          assignedCompanyName: normalizedStudent.assignedCompanyName ?? normalizedStudent.AssignedCompanyName ?? null,
          internshipStatus: normalizedStudent.internshipStatus ?? normalizedStudent.InternshipStatus ?? 0,
          certificateStatus: normalizedStudent.certificateStatus ?? normalizedStudent.CertificateStatus ?? 1,
        } : null;
        setStudent(normalizedCamel);

        // Load assignments for the logged-in user's name to avoid UserID mismatches
        const allAssignments = await apiService.getAssignments();
        const uname = ((user?.name) || (normalizedCamel?.name) || '').toLowerCase();
        const filteredByName = (allAssignments || []).filter(a => (a.studentName || '').toLowerCase() === uname);
        setAssignments(filteredByName);
      } catch (error) {
        console.error('StudentDashboard: Failed to load data:', error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const getStatusText = (status) => {
    switch (status) {
      // For Student.InternshipStatus: 0=Not Assigned, 1=Shown Interest, 2=Assigned
      // For Assignment.Status: 1=Assigned, 2=In Progress, 3=Completed
      case 0: return 'Not Assigned';
      case 1: return 'Shown Interest';
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

  // Determine the most relevant current assignment (prefer active one)
  const currentAssignment = assignments.find(a => a.status === 2) 
    || assignments.find(a => a.status === 1)
    || null;

  const getCompanyName = () => {
    if (currentAssignment) {
      return currentAssignment.companyName;
    }
    if (student?.assignedCompanyName || student?.AssignedCompanyName) {
      return student.assignedCompanyName || student.AssignedCompanyName;
    }
    return 'Not Assigned';
  };

  const getInternshipStatus = () => {
    if (currentAssignment) {
      return getStatusText(currentAssignment.status);
    }
    if (student?.internshipStatus !== undefined || student?.InternshipStatus !== undefined) {
      return getStatusText(student.internshipStatus ?? student.InternshipStatus);
    }
    return 'Not Assigned';
  };

  const getCertificateStatus = () => {
    if (currentAssignment) {
      return getCertificateText(currentAssignment.certificateIssued ? 3 : 1);
    }
    if (student?.certificateStatus !== undefined || student?.CertificateStatus !== undefined) {
      return getCertificateText(student.certificateStatus ?? student.CertificateStatus);
    }
    return 'Not Available';
  };


  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.welcomeBanner}>
          <Text style={styles.graduationIcon}>🎓</Text>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>Welcome Back,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <Text>Loading your internship status...</Text>
        </View>
      </ScrollView>
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
});

export default StudentDashboard;
