// API Service for React Native
const API_BASE_URL = 'http://192.168.1.4:7000/api'; // Local development API URL

class ApiService {
  constructor() {
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API call method
  async apiCall(endpoint, method = 'GET', data = null) {
    // Create AbortController for timeout compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Making API call to: ${url}`, { method, data });
      
      const config = {
        method,
        headers: this.getHeaders(),
        signal: controller.signal,
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      // Clear the timeout since request completed
      clearTimeout(timeoutId);
      
      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response text:', errorText);
        console.error('API error status:', response.status);
        console.error('API error URL:', url);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        console.error('API error response:', errorData);
        
        // Provide more specific error messages based on status code
        let errorMessage;
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your credentials.';
            break;
          case 401:
            errorMessage = 'Invalid email or password.';
            break;
          case 403:
            errorMessage = 'Access denied.';
            break;
          case 404:
            errorMessage = 'API endpoint not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
          default:
            errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('API success response:', result);
      return result;
    } catch (error) {
      // Clear the timeout in case of error
      clearTimeout(timeoutId);
      
      console.error('API call failed:', error);
      
      // Handle network errors and timeouts
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network request failed');
      }
      
      // Handle timeout errors
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Authentication API calls
  async login(email, password) {
    return this.apiCall('/auth/login', 'POST', { email, password });
  }

  async register(userData) {
    return this.apiCall('/auth/register', 'POST', userData);
  }

  async getProfile() {
    return this.apiCall('/auth/profile');
  }

  // Company API calls
  async getCompanies() {
    return this.apiCall('/companies');
  }

  async getCompany(id) {
    return this.apiCall(`/companies/${id}`);
  }

  async createCompany(companyData) {
    return this.apiCall('/companies', 'POST', companyData);
  }

  async updateCompany(id, companyData) {
    return this.apiCall(`/companies/${id}`, 'PUT', companyData);
  }

  async deleteCompany(id) {
    return this.apiCall(`/companies/${id}`, 'DELETE');
  }

  async getCompaniesByManager(managerId) {
    return this.apiCall(`/companies/manager/${managerId}`);
  }

  // Student API calls
  async getStudents() {
    return this.apiCall('/students');
  }

  async getStudent(id) {
    return this.apiCall(`/students/${id}`);
  }

  async getStudentByUserId(userId) {
    return this.apiCall(`/students/user/${userId}`);
  }

  async createStudent(studentData) {
    return this.apiCall('/students', 'POST', studentData);
  }

  async updateStudent(id, studentData) {
    return this.apiCall(`/students/${id}`, 'PUT', studentData);
  }

  async deleteStudent(id) {
    return this.apiCall(`/students/${id}`, 'DELETE');
  }

  async getAvailableStudents() {
    return this.apiCall('/students/available');
  }

  // Assignment API calls
  async getAssignments() {
    return this.apiCall('/assignments');
  }

  async getAssignment(id) {
    return this.apiCall(`/assignments/${id}`);
  }

  async createAssignment(assignmentData) {
    return this.apiCall('/assignments', 'POST', assignmentData);
  }

  async updateAssignment(id, assignmentData) {
    return this.apiCall(`/assignments/${id}`, 'PUT', assignmentData);
  }

  async deleteAssignment(id) {
    return this.apiCall(`/assignments/${id}`, 'DELETE');
  }

  async getAssignmentsByStudent(studentId) {
    return this.apiCall(`/assignments/student/${studentId}`);
  }

  async getAssignmentsByCompany(companyId) {
    return this.apiCall(`/assignments/company/${companyId}`);
  }

  async getAssignmentsByManager(managerId) {
    return this.apiCall(`/assignments/manager/${managerId}`);
  }

  // Certificate API calls
  async getCertificates() {
    return this.apiCall('/certificates');
  }

  async getCertificate(id) {
    return this.apiCall(`/certificates/${id}`);
  }

  async createCertificate(certificateData) {
    return this.apiCall('/certificates', 'POST', certificateData);
  }

  async updateCertificate(id, certificateData) {
    return this.apiCall(`/certificates/${id}`, 'PUT', certificateData);
  }

  async deleteCertificate(id) {
    return this.apiCall(`/certificates/${id}`, 'DELETE');
  }

  async getCertificatesByStudent(studentId) {
    return this.apiCall(`/certificates/student/${studentId}`);
  }

  async getCertificatesByCompany(companyId) {
    return this.apiCall(`/certificates/company/${companyId}`);
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;





