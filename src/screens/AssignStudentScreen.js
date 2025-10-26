import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '../context/NavigationContext.js';
import apiService from '../services/ApiService';

const AssignStudentScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load students and companies in parallel
      const [studentsData, companiesData] = await Promise.all([
        apiService.getStudents(),
        apiService.getCompanies()
      ]);
      
      setStudents(studentsData);
      setCompanies(companiesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (studentId) => {
    if (!selectedCompanyId) {
      Alert.alert('Error', 'Please select a company first');
      return;
    }

    try {
      // Create assignment using API
      const student = students.find(s => s.id === studentId);
      const company = companies.find(c => c.id === selectedCompanyId);
      
      const assignmentData = {
        studentId: studentId,
        companyId: selectedCompanyId,
        studentName: `${student?.regNo || 'Unknown'} (${student?.technology || 'Unknown Tech'})`,
        companyName: company?.name || '',
        assignedDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        status: 1, // 1=Assigned
        progress: 0,
        certificateIssued: false,
      };

      await apiService.createAssignment(assignmentData);
      
      // Update student status
      if (student) {
        await apiService.updateStudent(studentId, {
          userId: student.userId,
          regNo: student.regNo,
          technology: student.technology,
          hasShownInterest: student.hasShownInterest,
          assignedCompanyId: selectedCompanyId,
          assignedCompanyName: company?.name || '',
          internshipStatus: 2, // 2=Assigned
          certificateStatus: student.certificateStatus,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      // Update company current internships count
      if (company) {
        await apiService.updateCompany(selectedCompanyId, {
          name: company.name,
          area: company.area,
          technologies: company.technologies || '',
          maxInternships: company.maxInternships,
          currentInternships: company.currentInternships + 1,
          managerId: company.managerId,
          managerName: company.managerName,
          managerEmail: company.managerEmail,
          isActive: company.isActive,
        });
      }

      Alert.alert('Success', 'Student assigned successfully!');
      
      // Refresh data
      loadData();
      
    } catch (err) {
      console.error('Error assigning student:', err);
      Alert.alert('Error', 'Failed to assign student. Please try again.');
    }
  };

  const studentsWithInterest = students.filter(student => 
    student.hasShownInterest && student.internshipStatus === 1
  );
  
  const availableCompanies = companies.filter(company => 
    company.isActive && company.currentInternships < company.maxInternships
  );

  const filteredStudents = studentsWithInterest.filter(student =>
    student.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.loadingText}>Loading students and companies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
            placeholder="Search By Reg No or Name"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Company Selection */}
      <View style={styles.companySelectionContainer}>
        <Text style={styles.sectionTitle}>Select Company for Assignment</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.companyScrollView}>
          {availableCompanies.map((company) => (
            <TouchableOpacity
              key={company.id}
              style={[
                styles.companyCard,
                selectedCompanyId === company.id && styles.selectedCompanyCard
              ]}
              onPress={() => setSelectedCompanyId(company.id)}
            >
              <Text style={[
                styles.companyName,
                selectedCompanyId === company.id && styles.selectedCompanyName
              ]}>
                {company.name}
              </Text>
              <Text style={[
                styles.companyArea,
                selectedCompanyId === company.id && styles.selectedCompanyArea
              ]}>
                {company.area}
              </Text>
              <Text style={[
                styles.companySlots,
                selectedCompanyId === company.id && styles.selectedCompanySlots
              ]}>
                {company.maxInternships - company.currentInternships}/{company.maxInternships} slots
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Student List */}
      <ScrollView style={styles.listContainer}>
        {filteredStudents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No students with interest</Text>
            <Text style={styles.emptySubtext}>Students need to show interest first</Text>
          </View>
        ) : (
          filteredStudents.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.cardContent}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.aridNumber}>{student.regNo}</Text>
                <Text style={styles.technology}>{student.technology}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.assignButton,
                  !selectedCompanyId && styles.disabledButton
                ]}
                onPress={() => handleAssign(student.id)}
                disabled={!selectedCompanyId}
              >
                <Text style={[
                  styles.assignButtonText,
                  !selectedCompanyId && styles.disabledButtonText
                ]}>
                  Assign
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
  assignButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  assignButtonText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  companySelectionContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  companyScrollView: {
    marginTop: 5,
  },
  companyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    minWidth: 120,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCompanyCard: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedCompanyName: {
    color: '#FFFFFF',
  },
  companyArea: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  selectedCompanyArea: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  companySlots: {
    fontSize: 11,
    color: '#999',
  },
  selectedCompanySlots: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  disabledButtonText: {
    color: '#999',
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

export default AssignStudentScreen;
