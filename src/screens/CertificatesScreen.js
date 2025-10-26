import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '../context/NavigationContext.js';

const CertificatesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { navigate } = useNavigation();

  const students = [
    { id: '1', name: 'Qadis Parvez', aridNumber: '2021-Arid-4566', technology: 'Flutter' },
    { id: '2', name: 'Ali Haider', aridNumber: '2021-Arid-4404', technology: 'React Naive' },
    { id: '3', name: 'Daud Ansar', aridNumber: '2020-Arid-0126', technology: 'React JS' },
    { id: '4', name: 'M Subhan Saeed', aridNumber: '2021-Arid-4542', technology: 'Android' },
    { id: '5', name: 'Student Name', aridNumber: 'Arid Number', technology: 'Technology' },
    { id: '6', name: 'Ramish Wazir', aridNumber: '2021-Arid-4575', technology: 'Flutter' },
    { id: '7', name: 'Ammar Ali', aridNumber: '2020-Arid-0119', technology: 'React' },
  ];

  const handleCertify = (student) => {
    // Handle certification
    console.log('Certifying student:', student);
  };

  const filteredStudents = students.filter(student =>
    student.aridNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredStudents.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.cardContent}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.aridNumber}>{student.aridNumber}</Text>
              <Text style={styles.technology}>{student.technology}</Text>
            </View>
            <TouchableOpacity
              style={styles.certifyButton}
              onPress={() => handleCertify(student)}
            >
              <Text style={styles.certifyButtonText}>Certified</Text>
            </TouchableOpacity>
          </View>
        ))}
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
});

export default CertificatesScreen;
