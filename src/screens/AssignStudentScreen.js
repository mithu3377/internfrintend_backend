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
import apiService from '../services/ApiService.js';

const AssignStudentScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load ALL students then filter on client to ensure correctness
      const studentsApi = await apiService.getStudents();
      // Load all companies
      const allCompanies = await apiService.getCompanies();
      
      console.log('AssignStudentScreen: Loaded students:', studentsApi);
      console.log('AssignStudentScreen: Loaded companies:', allCompanies);
      
      // Normalize and filter on the client to be robust across backends
      const normalized = (studentsApi || []).map(s => ({
        studentID: s.studentID ?? s.StudentID,
        userID: s.userID ?? s.UserID,
        name: s.name ?? s.Name,
        regNo: s.regNo ?? s.RegNo,
        technology: s.technology ?? s.Technology,
        hasShownInterest: s.hasShownInterest ?? s.HasShownInterest ?? (s.internshipStatus ?? s.InternshipStatus) === 1,
        assignedCompanyID: s.assignedCompanyID ?? s.AssignedCompanyID ?? null,
        internshipStatus: s.internshipStatus ?? s.InternshipStatus,
        certificateStatus: s.certificateStatus ?? s.CertificateStatus,
      }));

      // Only students who showed interest (regardless of current assignment status)
      const interestedAndUnassigned = normalized.filter(s =>
        (s.hasShownInterest === true || s.internshipStatus === 1) &&
        s.studentID
      );

      // Ensure uniqueness by studentID to avoid duplicates
      const uniqueById = Object.values(interestedAndUnassigned.reduce((acc, s) => {
        acc[s.studentID] = acc[s.studentID] || s;
        return acc;
      }, {}));

      setStudents(uniqueById);
      setCompanies(allCompanies || []);
    } catch (error) {
      console.error('AssignStudentScreen: Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (student) => {
    if (!selectedCompanyId) {
      Alert.alert('Error', 'Please select a company first');
      return;
    }

    try {
      // Find the selected company
      const company = companies.find(c => c.companyID === parseInt(selectedCompanyId));
      
      if (!company) {
        Alert.alert('Error', 'Company not found');
        return;
      }

      // Check if company has available slots
      if (company.currentInternships >= company.maxInternships) {
        Alert.alert('Error', 'Company has no available slots');
        return;
      }

      // Create assignment - Use PascalCase for C# backend
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(now.getMonth() + 3); // 3 months internship
      
      const assignmentData = {
        StudentID: student.studentID || student.StudentID,
        CompanyID: company.companyID,
        StudentName: student.name || student.Name,
        CompanyName: company.name,
        AssignedDate: now.toISOString(),
        StartDate: now.toISOString(),
        EndDate: endDate.toISOString(),
        Status: 1, // Assigned
        Progress: 0,
        CertificateIssued: false,
      };

      await apiService.createAssignment(assignmentData);

      // Update student - set assigned company - Use PascalCase for C# backend
      const updatedStudent = {
        StudentID: student.studentID || student.StudentID,
        UserID: student.userID || student.UserID,
        Name: student.name || student.Name,
        RegNo: student.regNo || student.RegNo,
        Technology: student.technology || student.Technology,
        HasShownInterest: true,
        AssignedCompanyID: company.companyID,
        AssignedCompanyName: company.name,
        InternshipStatus: 2, // Assigned
        CertificateStatus: student.certificateStatus || student.CertificateStatus || 1,
      };
      await apiService.updateStudent(student.studentID || student.StudentID, updatedStudent);

      // Update company - increment current internships
      const updatedCompany = {
        CompanyID: company.companyID,
        Name: company.name,
        Area: company.area,
        Technologies: company.technologies,
        MaxInternships: company.maxInternships || company.MaxInternships,
        CurrentInternships: company.currentInternships + 1,
        ManagerID: company.managerID || company.ManagerID,
        IsActive: company.isActive !== undefined ? company.isActive : true,
      };
      await apiService.updateCompany(company.companyID, updatedCompany);

      Alert.alert('Success', 'Student assigned successfully!', [
        { text: 'OK', onPress: loadData }
      ]);

      // Reset selection
      setSelectedCompanyId('');
    } catch (error) {
      console.error('AssignStudentScreen: Error assigning student:', error);
      Alert.alert('Error', 'Failed to assign student. Please try again.');
    }
  };

  // `students` already filtered and normalized above
  const studentsWithInterest = students;
  
  console.log('AssignStudentScreen: Total students from API:', students.length);
  console.log('AssignStudentScreen: Students with interest data:', studentsWithInterest);
  
  const availableCompanies = companies.filter(company => 
    company.isActive && company.currentInternships < company.maxInternships
  );

  const filteredStudents = studentsWithInterest.filter(student =>
    (student.regNo || student.RegNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.name || student.Name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.loadingText}>Loading...</Text>
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
              key={company.companyID}
              style={[
                styles.companyCard,
                selectedCompanyId === company.companyID.toString() && styles.selectedCompanyCard
              ]}
              onPress={() => setSelectedCompanyId(company.companyID.toString())}
            >
              <Text style={[
                styles.companyName,
                selectedCompanyId === company.companyID.toString() && styles.selectedCompanyName
              ]}>
                {company.name}
              </Text>
              <Text style={[
                styles.companyArea,
                selectedCompanyId === company.companyID.toString() && styles.selectedCompanyArea
              ]}>
                {company.area}
              </Text>
              <Text style={[
                styles.companySlots,
                selectedCompanyId === company.companyID.toString() && styles.selectedCompanySlots
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
            <View key={student.studentID || student.StudentID} style={styles.studentCard}>
              <View style={styles.cardContent}>
                <Text style={styles.studentName}>{student.name || student.Name}</Text>
                <Text style={styles.aridNumber}>{student.regNo || student.RegNo}</Text>
                <Text style={styles.technology}>{student.technology || student.Technology}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.assignButton,
                  !selectedCompanyId && styles.disabledButton
                ]}
                onPress={() => handleAssign(student)}
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

export default AssignStudentScreen;
