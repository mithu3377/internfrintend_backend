import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const InternshipPortal = () => {
  const internships = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp Solutions',
      duration: '3 months',
      location: 'Remote',
      salary: '$2,000/month',
      color: '#FF6B6B',
    },
    {
      id: 2,
      title: 'Mobile App Developer',
      company: 'InnovateLab',
      duration: '6 months',
      location: 'New York',
      salary: '$2,500/month',
      color: '#4ECDC4',
    },
    {
      id: 3,
      title: 'Data Science Intern',
      company: 'DataFlow Inc',
      duration: '4 months',
      location: 'San Francisco',
      salary: '$3,000/month',
      color: '#45B7D1',
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'CreativeStudio',
      duration: '3 months',
      location: 'Los Angeles',
      salary: '$2,200/month',
      color: '#96CEB4',
    },
    {
      id: 5,
      title: 'Backend Developer',
      company: 'CloudTech',
      duration: '5 months',
      location: 'Seattle',
      salary: '$2,800/month',
      color: '#FFEAA7',
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'ScaleUp',
      duration: '4 months',
      location: 'Austin',
      salary: '$3,200/month',
      color: '#DDA0DD',
    },
  ];

  const renderInternshipCard = (internship) => (
    <TouchableOpacity
      key={internship.id}
      style={[styles.card, { backgroundColor: internship.color }]}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{internship.title}</Text>
        <Text style={styles.companyName}>{internship.company}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{internship.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{internship.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Salary:</Text>
            <Text style={styles.detailValue}>{internship.salary}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎓 Internship Portal</Text>
        <Text style={styles.headerSubtitle}>
          Discover amazing internship opportunities
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>150+</Text>
          <Text style={styles.statLabel}>Active Internships</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Companies</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Students Placed</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Featured Internships</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {internships.map(renderInternshipCard)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonRed]}>
            <Text style={styles.actionButtonText}>📝 Create Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonTeal]}>
            <Text style={styles.actionButtonText}>🔍 Search Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonBlue]}>
            <Text style={styles.actionButtonText}>📊 Track Applications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonGreen]}>
            <Text style={styles.actionButtonText}>💼 My Applications</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Ready to kickstart your career? 🚀
        </Text>
        <TouchableOpacity style={styles.getStartedButton}>
          <Text style={styles.getStartedButtonText}>Get Started Today!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#667EEA',
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8EAED',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667EEA',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  card: {
    width: width * 0.8,
    marginRight: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  companyName: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 15,
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    width: 60,
  },
  detailValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonRed: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonTeal: {
    backgroundColor: '#4ECDC4',
  },
  actionButtonBlue: {
    backgroundColor: '#45B7D1',
  },
  actionButtonGreen: {
    backgroundColor: '#96CEB4',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#667EEA',
    padding: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  getStartedButtonText: {
    color: '#667EEA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InternshipPortal;
