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

const InternshipRequestScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      console.log('InternshipRequest: Loading companies...');
      
      // Get all companies
      const companies = await apiService.getCompanies();
      console.log('InternshipRequest: Companies loaded:', companies);
      
      // Filter companies with available slots
      const available = companies.filter(company => {
        const hasAvailableSlots = company.currentInternships < company.maxInternships;
        const isActive = company.isActive === undefined || company.isActive === true;
        const result = isActive && hasAvailableSlots;
        console.log(`Company ${company.companyID}: isActive=${isActive}, hasSlots=${hasAvailableSlots}, show=${result}`);
        return result;
      });
      
      console.log('InternshipRequest: Total companies:', companies.length);
      console.log('InternshipRequest: Available companies:', available.length);
      setAvailableCompanies(available);
    } catch (error) {
      console.error('InternshipRequest: Error loading companies:', error);
      Alert.alert('Error', 'Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (companyId) => {
    try {
      console.log('InternshipRequest: Showing interest for company:', companyId);
      
      // Get the student record: try by UserID; fallback by Name match
      const students = await apiService.getStudents();
      let currentStudent = students.find(s => s.userID === user?.id || s.UserID === user?.id);
      if (!currentStudent && user?.name) {
        const uname = (user.name || '').toLowerCase();
        currentStudent = students.find(s => (s.name || s.Name || '').toLowerCase() === uname);
      }
      
      console.log('InternshipRequest: Current student found:', currentStudent);
      
      if (currentStudent) {
        // Update student's interest status - Use PascalCase for C# backend
        // IMPORTANT: Set AssignedCompanyID to null to make them available for assignment
        const updatedStudent = {
          StudentID: currentStudent.studentID || currentStudent.StudentID,
          UserID: currentStudent.userID || currentStudent.UserID,
          Name: currentStudent.name || currentStudent.Name,
          RegNo: currentStudent.regNo || currentStudent.RegNo,
          Technology: currentStudent.technology || currentStudent.Technology,
          HasShownInterest: true, // Set to true
          InternshipStatus: 1, // 1 = Shown Interest
          AssignedCompanyID: null, // CRITICAL: Set to null to make them available
          AssignedCompanyName: null, // CRITICAL: Set to null
          CertificateStatus: currentStudent.certificateStatus || currentStudent.CertificateStatus || 1,
        };
        
        const studentId = currentStudent.studentID || currentStudent.StudentID;
        await apiService.updateStudent(studentId, updatedStudent);
        console.log('InternshipRequest: Interest updated successfully with InternshipStatus: 1');
      }
      
      Alert.alert(
        'Success', 
        'Your interest has been registered! Admin will assign you to a company based on availability.',
        [{ text: 'OK', onPress: () => navigate('StudentDashboard') }]
      );
    } catch (error) {
      console.error('InternshipRequest: Error showing interest:', error);
      Alert.alert('Error', 'Failed to register interest. Please try again.');
    }
  };

  // Filter companies based on search query
  const filteredCompanies = availableCompanies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.technologies.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigate('StudentDashboard')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search By Company Name or Area"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Company List */}
      <ScrollView style={styles.listContainer}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#667EEA" />
            <Text style={styles.emptySubtext}>Loading companies...</Text>
          </View>
        ) : filteredCompanies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No companies available</Text>
            <Text style={styles.emptySubtext}>
              {availableCompanies.length === 0 
                ? 'All internship slots are currently filled'
                : 'No companies match your search'}
            </Text>
          </View>
        ) : (
          filteredCompanies.map((company) => (
            <View key={company.companyID} style={styles.internshipCard}>
              <View style={styles.cardContent}>
                <Text style={styles.companyName}>{company.name}</Text>
                <Text style={styles.positionName}>{company.area}</Text>
                <Text style={styles.technologiesText}>{company.technologies}</Text>
                <Text style={styles.slotsText}>
                  Available Slots: {company.maxInternships - company.currentInternships}/{company.maxInternships}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => handleRequest(company.companyID)}
              >
                <Text style={styles.requestButtonText}>Show Interest</Text>
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
  internshipCard: {
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
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  positionName: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  technologiesText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  requestButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  requestButtonText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  slotsText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
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
});

export default InternshipRequestScreen;
