// Data Service for React Native - Simulates database operations using AsyncStorage
import { AsyncStorage } from 'react-native';

class DataService {
  constructor() {
    this.storageKeys = {
      companies: 'internship_companies',
      students: 'internship_students',
      assignments: 'internship_assignments',
      certificates: 'internship_certificates',
      internships: 'internship_opportunities'
    };
  }

  // Initialize with seed data
  async initialize() {
    try {
      // Check if data already exists
      const companies = await this.getCompanies();
      if (companies.length === 0) {
        await this.seedData();
      }
    } catch (error) {
      console.error('DataService initialization failed:', error);
    }
  }

  // Seed initial data
  async seedData() {
    const companies = [
      {
        id: 1,
        name: 'TechCorp Solutions',
        area: 'Frontend Development',
        maxInternships: 3,
        currentInternships: 0,
        managerName: 'Manager Name',
        managerEmail: 'manager@company.com',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'TechCorp Solutions',
        area: 'Backend Development',
        maxInternships: 2,
        currentInternships: 0,
        managerName: 'John Smith',
        managerEmail: 'john@techcorp.com',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'DataFlow Inc',
        area: 'Data Science',
        maxInternships: 4,
        currentInternships: 0,
        managerName: 'Manager Name',
        managerEmail: 'manager@company.com',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'CloudTech',
        area: 'DevOps',
        maxInternships: 2,
        currentInternships: 0,
        managerName: 'John Smith',
        managerEmail: 'john@techcorp.com',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'InnovateLab',
        area: 'Mobile Development',
        maxInternships: 3,
        currentInternships: 0,
        managerName: 'Manager Name',
        managerEmail: 'manager@company.com',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    const students = [
      {
        id: 1,
        name: 'Qadis Parvez',
        email: 'qadis@student.com',
        regNo: '2021-Arid-4566',
        technology: 'Flutter',
        hasShownInterest: false,
        internshipStatus: 1,
        certificateStatus: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Ali Haider',
        email: 'ali@student.com',
        regNo: '2021-Arid-4404',
        technology: 'React Native',
        hasShownInterest: true,
        internshipStatus: 1,
        certificateStatus: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Daud Ansar',
        email: 'daud@student.com',
        regNo: '2020-Arid-0126',
        technology: 'React JS',
        hasShownInterest: true,
        internshipStatus: 1,
        certificateStatus: 1,
        createdAt: new Date().toISOString()
      }
    ];

    await this.saveData(this.storageKeys.companies, companies);
    await this.saveData(this.storageKeys.students, students);
    await this.saveData(this.storageKeys.assignments, []);
    await this.saveData(this.storageKeys.certificates, []);
    await this.saveData(this.storageKeys.internships, []);

    console.log('DataService: Seed data created successfully');
  }

  // Generic data operations
  async saveData(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  async getData(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting data:', error);
      return [];
    }
  }

  // Company operations
  async getCompanies() {
    return await this.getData(this.storageKeys.companies);
  }

  async addCompany(companyData) {
    try {
      const companies = await this.getCompanies();
      const newCompany = {
        id: Date.now(), // Simple ID generation
        ...companyData,
        createdAt: new Date().toISOString(),
        isActive: true,
        currentInternships: 0
      };
      companies.push(newCompany);
      await this.saveData(this.storageKeys.companies, companies);
      console.log('DataService: Company added successfully');
      return { success: true, data: newCompany };
    } catch (error) {
      console.error('Error adding company:', error);
      return { success: false, message: 'Failed to add company' };
    }
  }

  async updateCompany(id, updateData) {
    try {
      const companies = await this.getCompanies();
      const index = companies.findIndex(c => c.id === id);
      if (index !== -1) {
        companies[index] = { ...companies[index], ...updateData };
        await this.saveData(this.storageKeys.companies, companies);
        return { success: true, data: companies[index] };
      }
      return { success: false, message: 'Company not found' };
    } catch (error) {
      console.error('Error updating company:', error);
      return { success: false, message: 'Failed to update company' };
    }
  }

  // Student operations
  async getStudents() {
    return await this.getData(this.storageKeys.students);
  }

  async getStudentByEmail(email) {
    const students = await this.getStudents();
    return students.find(s => s.email === email);
  }

  async updateStudent(email, updateData) {
    try {
      const students = await this.getStudents();
      const index = students.findIndex(s => s.email === email);
      if (index !== -1) {
        students[index] = { ...students[index], ...updateData };
        await this.saveData(this.storageKeys.students, students);
        return { success: true, data: students[index] };
      }
      return { success: false, message: 'Student not found' };
    } catch (error) {
      console.error('Error updating student:', error);
      return { success: false, message: 'Failed to update student' };
    }
  }

  // Assignment operations
  async getAssignments() {
    return await this.getData(this.storageKeys.assignments);
  }

  async addAssignment(assignmentData) {
    try {
      const assignments = await this.getAssignments();
      const newAssignment = {
        id: Date.now(),
        ...assignmentData,
        assignedDate: new Date().toISOString(),
        status: 1, // Active
        progress: 0,
        certificateIssued: false
      };
      assignments.push(newAssignment);
      await this.saveData(this.storageKeys.assignments, assignments);
      
      // Update company current internships count
      await this.updateCompanyInternshipCount(assignmentData.companyId, 1);
      
      console.log('DataService: Assignment added successfully');
      return { success: true, data: newAssignment };
    } catch (error) {
      console.error('Error adding assignment:', error);
      return { success: false, message: 'Failed to add assignment' };
    }
  }

  async updateCompanyInternshipCount(companyId, change) {
    try {
      const companies = await this.getCompanies();
      const index = companies.findIndex(c => c.id === companyId);
      if (index !== -1) {
        companies[index].currentInternships += change;
        await this.saveData(this.storageKeys.companies, companies);
      }
    } catch (error) {
      console.error('Error updating company internship count:', error);
    }
  }

  // Internship opportunity operations
  async getInternships() {
    return await this.getData(this.storageKeys.internships);
  }

  async addInternship(internshipData) {
    try {
      const internships = await this.getInternships();
      const newInternship = {
        id: Date.now(),
        ...internshipData,
        createdAt: new Date().toISOString(),
        isActive: true,
        applicationsCount: 0
      };
      internships.push(newInternship);
      await this.saveData(this.storageKeys.internships, internships);
      console.log('DataService: Internship opportunity added successfully');
      return { success: true, data: newInternship };
    } catch (error) {
      console.error('Error adding internship:', error);
      return { success: false, message: 'Failed to add internship' };
    }
  }

  // Certificate operations
  async getCertificates() {
    return await this.getData(this.storageKeys.certificates);
  }

  async addCertificate(certificateData) {
    try {
      const certificates = await this.getCertificates();
      const newCertificate = {
        id: Date.now(),
        ...certificateData,
        certificateNumber: `CERT-${Date.now()}`,
        issueDate: new Date().toISOString(),
        isVerified: false
      };
      certificates.push(newCertificate);
      await this.saveData(this.storageKeys.certificates, certificates);
      console.log('DataService: Certificate added successfully');
      return { success: true, data: newCertificate };
    } catch (error) {
      console.error('Error adding certificate:', error);
      return { success: false, message: 'Failed to add certificate' };
    }
  }

  // Clear all data (for testing)
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(this.storageKeys));
      console.log('DataService: All data cleared');
      return { success: true };
    } catch (error) {
      console.error('Error clearing data:', error);
      return { success: false, message: 'Failed to clear data' };
    }
  }
}

export default new DataService();
