import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '../context/NavigationContext.js';
import apiService from '../services/ApiService.js';

const CertificatesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigation();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      console.log('CertificatesScreen: Loading students with assignments...');
      
      // Get all students
      const allStudents = await apiService.getStudents();
      
      // Filter students who are assigned (internshipStatus = 2)
      const assignedStudents = allStudents.filter(student => 
        (student.internshipStatus === 2 || student.InternshipStatus === 2) &&
        (student.assignedCompanyID || student.AssignedCompanyID)
      );
      
      console.log('CertificatesScreen: Assigned students found:', assignedStudents.length);
      setStudents(assignedStudents);
    } catch (error) {
      console.error('CertificatesScreen: Error loading students:', error);
      Alert.alert('Error', 'Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCertify = async (student) => {
    try {
      const studentId = student.studentID || student.StudentID;
      
      // Update student's certificate status to 3 (Issued)
      const updatedStudent = {
        StudentID: studentId,
        UserID: student.userID || student.UserID,
        Name: student.name || student.Name,
        RegNo: student.regNo || student.RegNo,
        Technology: student.technology || student.Technology,
        HasShownInterest: student.hasShownInterest || student.HasShownInterest,
        AssignedCompanyID: student.assignedCompanyID || student.AssignedCompanyID,
        AssignedCompanyName: student.assignedCompanyName || student.AssignedCompanyName,
        InternshipStatus: student.InternshipStatus || student.internshipStatus || 2,
        CertificateStatus: 3, // Issued
      };
      
      await apiService.updateStudent(studentId, updatedStudent);
      
      // Get assignments for this student to find the relevant assignment
      const assignments = await apiService.getAssignmentsByStudent(studentId);
      
      if (assignments && assignments.length > 0) {
        // Use the first assignment (most recent or active)
        const assignment = assignments[0];
        
        // Check if certificate already exists for this student
        const existingCertificates = await apiService.getCertificatesByStudent(studentId);
        
        if (!existingCertificates || existingCertificates.length === 0) {
          // Calculate duration from assignment dates or use default
          const startDate = assignment.StartDate || assignment.startDate || new Date();
          const endDate = assignment.EndDate || assignment.endDate || new Date();
          const durationMs = new Date(endDate) - new Date(startDate);
          const durationMonths = Math.round(durationMs / (1000 * 60 * 60 * 24 * 30)); // Approximate months
          
          // Create certificate record
          const certificateData = {
            AssignmentID: assignment.AssignmentID || assignment.assignmentID,
            StudentID: studentId,
            CompanyID: student.assignedCompanyID || student.AssignedCompanyID || assignment.CompanyID || assignment.companyID,
            StudentName: student.name || student.Name,
            CompanyName: student.assignedCompanyName || student.AssignedCompanyName || assignment.CompanyName || assignment.companyName,
            IssueDate: new Date().toISOString(),
            Duration: durationMonths > 0 ? `${durationMonths} Months` : '3 Months',
            SkillsAcquired: student.technology || student.Technology || 'Various',
            ProjectDescription: `Completed internship at ${student.assignedCompanyName || student.AssignedCompanyName || 'Company'}`,
            IsVerified: true
          };
          
          await apiService.createCertificate(certificateData);
          
          // Update assignment to mark certificate as issued
          if (assignment.AssignmentID || assignment.assignmentID) {
            const updatedAssignment = {
              ...assignment,
              CertificateIssued: true,
              Status: 3 // Completed
            };
            await apiService.updateAssignment(
              assignment.AssignmentID || assignment.assignmentID,
              updatedAssignment
            );
          }
        }
      }
      
      Alert.alert('Success', 'Certificate issued successfully!');
      loadStudents(); // Reload the list
    } catch (error) {
      console.error('CertificatesScreen: Error issuing certificate:', error);
      Alert.alert('Error', 'Failed to issue certificate. Please try again.');
    }
  };

  const filteredStudents = students.filter(student =>
    (student.regNo || student.RegNo || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigate('AdminDashboard')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search By Reg No"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Student List */}
      <ScrollView style={styles.listContainer}>
        {filteredStudents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No assigned students</Text>
            <Text style={styles.emptySubtext}>Students need to be assigned first</Text>
          </View>
        ) : (
          filteredStudents.map((student) => (
            <View key={student.studentID || student.StudentID} style={styles.studentCard}>
              <View style={styles.cardContent}>
                <Text style={styles.studentName}>{student.name || student.Name}</Text>
                <Text style={styles.aridNumber}>{student.regNo || student.RegNo}</Text>
                <Text style={styles.technology}>{student.technology || student.Technology}</Text>
              </View>
              <TouchableOpacity
                style={styles.certifyButton}
                onPress={() => handleCertify(student)}
              >
                <Text style={styles.certifyButtonText}>
                  {(student.certificateStatus === 3 || student.CertificateStatus === 3) 
                    ? 'Certified' 
                    : 'Issue Certificate'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 15,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  studentCard: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aridNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
  },
  technology: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  certifyButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  certifyButtonText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
});

export default CertificatesScreen;
