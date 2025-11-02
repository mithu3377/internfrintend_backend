import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const CompaniesListScreen = () => {
  const [companies] = useState([]);
  const { isAdmin, user } = useAuth();

  const handleCreateCompany = () => {
    Alert.alert('Success', 'Company created successfully!');
  };

  const handleUpdateCompany = (companyId) => {
    Alert.alert('Success', 'Company updated successfully!');
  };

  const handleDeleteCompany = (companyId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this company?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Company deleted successfully!');
          },
        },
      ]
    );
  };

  const renderCompanyItem = ({ item }) => (
    <View style={styles.companyItem}>
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>{item.name}</Text>
        <Text style={styles.companyArea}>Area: {item.area}</Text>
        <Text style={styles.companyInternships}>
          Internships: {item.currentInternships}/{item.maxInternships}
        </Text>
        <Text style={styles.companyManager}>Manager: {item.managerName}</Text>
      </View>
      
      {isAdmin && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.updateButton]}
            onPress={() => handleUpdateCompany(item.id)}
          >
            <Text style={styles.actionButtonText}>Update</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteCompany(item.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Companies</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateCompany}
          >
            <Text style={styles.addButtonText}>+ Add Company</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCompanyItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#667EEA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  companyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
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
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  companyArea: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  companyInternships: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  companyManager: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CompaniesListScreen;





