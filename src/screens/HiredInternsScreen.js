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
import { useNavigation } from '../context/NavigationContext.js';
import apiService from '../services/ApiService.js';

const HiredInternsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hiredInterns, setHiredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigation();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const assignments = await apiService.getAssignments();
      setHiredInterns(assignments || []);
    } catch (error) {
      console.error('HiredInternsScreen: Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterns = hiredInterns.filter(intern =>
    intern.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    intern.companyName.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search By Company or Student Name"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Hired Interns List */}
      <ScrollView style={styles.listContainer}>
        {filteredInterns.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No assignments found</Text>
            <Text style={styles.emptySubtext}>No students have been assigned to companies yet</Text>
          </View>
        ) : (
          filteredInterns.map((intern) => (
            <View key={intern.assignmentID} style={styles.internCard}>
              <View style={styles.cardContent}>
                <Text style={styles.companyName}>{intern.companyName}</Text>
                <Text style={styles.positionName}>{intern.studentName}</Text>
                <Text style={styles.statusText}>
                  Status: {intern.status === 1 ? 'Assigned' : intern.status === 2 ? 'In Progress' : 'Completed'}
                </Text>
                {intern.progress !== undefined && (
                  <Text style={styles.progressText}>Progress: {intern.progress}%</Text>
                )}
              </View>
              <TouchableOpacity style={styles.hiredButton}>
                <Text style={styles.hiredButtonText}>
                  {intern.status === 3 ? 'Completed' : 'Active'}
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
  hiredButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  hiredButtonText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
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

export default HiredInternsScreen;
