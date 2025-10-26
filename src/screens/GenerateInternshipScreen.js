import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '../context/NavigationContext.js';
import apiService from '../services/ApiService';

const GenerateInternshipScreen = () => {
  const [hiringFor, setHiringFor] = useState('');
  const [internshipAllowed, setInternshipAllowed] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const handleGenerateInternship = async () => {
    if (!hiringFor || !internshipAllowed || !duration || !startDate || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const internshipsCount = parseInt(internshipAllowed, 10);
    if (isNaN(internshipsCount) || internshipsCount <= 0) {
      Alert.alert('Error', 'Please enter a valid number of internships');
      return;
    }

    try {
      setLoading(true);
      
      // Get manager's company
      const companies = await apiService.getCompaniesByManager(user.id);
      if (!companies || companies.length === 0) {
        Alert.alert('Error', 'No company found for this manager');
        return;
      }

      const company = companies[0];
      
      // Update company with new internship details
      const updateData = {
        name: company.name,
        area: hiringFor,
        technologies: company.technologies || '',
        maxInternships: internshipsCount,
        currentInternships: company.currentInternships,
        managerId: company.managerId,
        managerName: company.managerName,
        managerEmail: company.managerEmail,
        isActive: company.isActive,
      };

      await apiService.updateCompany(company.id, updateData);
      
      Alert.alert('Success', 'Internship generated successfully!', [
        {
          text: 'OK',
          onPress: () => navigate('ManagerDashboard')
        }
      ]);
      
      // Reset form
      setHiringFor('');
      setInternshipAllowed('');
      setDuration('');
      setStartDate('');
      setDescription('');
      
    } catch (error) {
      console.error('Error generating internship:', error);
      Alert.alert('Error', 'Failed to generate internship. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigate('ManagerDashboard')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate Internship</Text>
      </View>
      
      <View style={styles.formContainer}>
        {/* Hiring For */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hiring For</Text>
          <TextInput
            style={styles.input}
            placeholder="Technology"
            placeholderTextColor="#999"
            value={hiringFor}
            onChangeText={setHiringFor}
          />
        </View>

        {/* Internship Allowed */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Internship Allowed</Text>
          <TextInput
            style={styles.input}
            placeholder="Count"
            placeholderTextColor="#999"
            value={internshipAllowed}
            onChangeText={setInternshipAllowed}
            keyboardType="numeric"
          />
        </View>

        {/* Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            placeholder="Months"
            placeholderTextColor="#999"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>

        {/* Start Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YY"
            placeholderTextColor="#999"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Role Description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Generate Internship Button */}
        <TouchableOpacity 
          style={[styles.generateButton, loading && styles.disabledButton]} 
          onPress={handleGenerateInternship}
          disabled={loading}
        >
          <Text style={styles.generateButtonText}>
            {loading ? 'Generating...' : 'Generate Internship'}
          </Text>
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
  header: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
  },
  generateButton: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
});

export default GenerateInternshipScreen;
