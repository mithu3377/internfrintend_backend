import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/ApiService';

const InternshipContext = createContext(undefined);

export const useInternship = () => {
  const context = useContext(InternshipContext);
  if (context === undefined) {
    throw new Error('useInternship must be used within an InternshipProvider');
  }
  return context;
};

export const InternshipProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data on component mount
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // Load data from API
      const [companiesData, studentsData, assignmentsData] = await Promise.all([
        apiService.getCompanies(),
        apiService.getStudents(),
        apiService.getAssignments()
      ]);
      
      setCompanies(companiesData);
      setStudents(studentsData);
      setAssignments(assignmentsData);
      
      console.log('InternshipContext: Data initialized successfully');
    } catch (error) {
      console.error('InternshipContext: Failed to initialize data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (companyData) => {
    try {
      const result = await apiService.createCompany(companyData);
      setCompanies(prev => [...prev, result]);
      console.log('InternshipContext: Company added successfully');
      return { success: true, data: result };
    } catch (error) {
      console.error('InternshipContext: Failed to add company:', error);
      return { success: false, message: error.message || 'Failed to add company' };
    }
  };

  const updateCompany = (id, updates) => {
    setCompanies(prev => prev.map(company => 
      company.id === id ? { ...company, ...updates } : company
    ));
  };

  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      hasShownInterest: false,
      internshipStatus: 'not_assigned',
      certificateStatus: 'not_available',
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id, updates) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const showInterestInInternship = (studentId) => {
    updateStudent(studentId, { hasShownInterest: true });
  };

  const assignStudentToCompany = async (studentId, companyId) => {
    try {
      const company = companies.find(c => c.id === companyId);
      const student = students.find(s => s.id === studentId);
      
      if (!company || !student) {
        return { success: false, message: 'Company or student not found' };
      }
    
      // Check if company has available slots
      if (company.currentInternships >= company.maxInternships) {
        return { success: false, message: 'Company has no available internship slots' };
      }
    
      // Check if student has already shown interest
      if (!student.hasShownInterest) {
        return { success: false, message: 'Student has not shown interest in internships' };
      }
    
      // Create assignment using ApiService
      const assignmentData = {
        studentId,
        companyId,
        studentName: student.name,
        companyName: company.name,
        userId: studentId // For compatibility
      };
    
      const result = await apiService.createAssignment(assignmentData);
      setAssignments(prev => [...prev, result]);
    
      // Update company current internships count
      updateCompany(companyId, { currentInternships: company.currentInternships + 1 });
    
      // Update student status
      updateStudent(studentId, {
        assignedCompanyId: companyId,
        assignedCompanyName: company.name,
        internshipStatus: 'assigned',
      });
    
      console.log('InternshipContext: Student assigned successfully');
      return { success: true, data: result };
    } catch (error) {
      console.error('InternshipContext: Failed to assign student:', error);
      return { success: false, message: error.message || 'Failed to assign student' };
    }
  };

  const updateInternshipProgress = (assignmentId, progress) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, progress, status: 'in_progress' }
        : assignment
    ));
    
    // Update student status
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      updateStudent(assignment.studentId, { internshipStatus: 'in_progress' });
    }
  };

  const completeInternship = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, status: 'completed', endDate: new Date().toISOString() }
        : assignment
    ));
    
    // Update student status
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      updateStudent(assignment.studentId, { 
        internshipStatus: 'completed',
        endDate: new Date().toISOString(),
      });
      
      // Free up company slot
      const company = companies.find(c => c.id === assignment.companyId);
      if (company) {
        updateCompany(assignment.companyId, { 
          currentInternships: company.currentInternships - 1 
        });
      }
    }
  };

  const issueCertificate = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, certificateIssued: true }
        : assignment
    ));
    
    // Update student certificate status
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      updateStudent(assignment.studentId, { certificateStatus: 'issued' });
    }
  };

  const getAvailableCompanies = () => {
    return companies.filter(company => 
      company.isActive && company.currentInternships < company.maxInternships
    );
  };

  const getStudentsWithInterest = () => {
    return students.filter(student => 
      student.hasShownInterest && student.internshipStatus === 'not_assigned'
    );
  };

  const getStudentAssignments = (studentId) => {
    return assignments.filter(assignment => assignment.studentId === studentId);
  };

  const getCompanyAssignments = (companyId) => {
    return assignments.filter(assignment => assignment.companyId === companyId);
  };

  const value = {
    companies,
    students,
    assignments,
    loading,
    addCompany,
    updateCompany,
    addStudent,
    updateStudent,
    showInterestInInternship,
    assignStudentToCompany,
    updateInternshipProgress,
    completeInternship,
    issueCertificate,
    getAvailableCompanies,
    getStudentsWithInterest,
    getStudentAssignments,
    getCompanyAssignments,
  };

  return (
    <InternshipContext.Provider value={value}>
      {children}
    </InternshipContext.Provider>
  );
};
