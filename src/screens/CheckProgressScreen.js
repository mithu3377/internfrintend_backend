import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '../context/NavigationContext.js';
import apiService from '../services/ApiService.js';

const CheckProgressScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [managerCompany, setManagerCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    loadManagerData();
  }, []);

  const loadManagerData = async () => {
    try {
      setLoading(true);
      console.log('CheckProgressScreen: Loading manager data for user ID:', user?.id);
      
      // Load manager's companies
      const companies = await apiService.getCompaniesByManager(user?.id || 0);
      console.log('CheckProgressScreen: Companies found:', companies);
      
      if (companies && companies.length > 0) {
        const firstCompany = companies[0];
        setManagerCompany(firstCompany);
        console.log('CheckProgressScreen: Using company:', firstCompany);
        
        // Load active interns for this company
        const interns = await apiService.getAssignmentsByCompany(firstCompany.companyID || firstCompany.CompanyID);
        console.log('CheckProgressScreen: Assignments loaded:', interns);
        setAssignments(interns || []);
      } else {
        console.log('CheckProgressScreen: No companies found for manager');
        setAssignments([]);
      }
    } catch (error) {
      console.error('CheckProgressScreen: Error loading data:', error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const activeAssignments = assignments.filter(assignment => 
    assignment.status === 1 || assignment.status === 2
  );

  const filteredAssignments = activeAssignments.filter(assignment =>
    assignment.studentName && assignment.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgressColor = (progress) => {
    if (progress === 100) return '#4CAF50'; // Green for completed
    return '#FF5722'; // Red for in progress
  };

  const renderProgressCircle = (progress) => {
    const color = getProgressColor(progress);
    const isCompleted = progress === 100;
    
    return (
      <View style={styles.progressCircle}>
        <View style={[styles.progressArc, { borderColor: color }]}>
          {isCompleted && <View style={styles.completedDot} />}
        </View>
      </View>
    );
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigate('ManagerDashboard')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search By Name"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Intern List */}
      <ScrollView style={styles.listContainer}>
        {filteredAssignments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active interns</Text>
            <Text style={styles.emptySubtext}>No students are currently assigned to your company</Text>
          </View>
        ) : (
          filteredAssignments.map((assignment) => (
            <View key={assignment.assignmentID} style={styles.internCard}>
              <View style={styles.cardContent}>
                <Text style={styles.internName}>{assignment.studentName}</Text>
                <Text style={styles.projectName}>{managerCompany?.area || 'Internship'}</Text>
                <Text style={styles.technology}>Status: {assignment.status === 1 ? 'Assigned' : assignment.status === 2 ? 'In Progress' : 'Completed'}</Text>
              </View>
              <View style={styles.progressContainer}>
                {renderProgressCircle(assignment.progress || 0)}
                <Text style={styles.progressText}>{assignment.progress || 0}%</Text>
              </View>
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
  internCard: {
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
  internName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  projectName: {
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
  progressContainer: {
    marginLeft: 15,
  },
  progressCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressArc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
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

export default CheckProgressScreen;
