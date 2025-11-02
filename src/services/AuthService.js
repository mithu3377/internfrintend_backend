import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './ApiService';

class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
  }

  // Initialize auth service - check for stored token
  async initialize() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        this.token = token;
        const user = JSON.parse(userData);
        // Normalize role to lowercase for consistency
        if (user.role) {
          user.role = user.role.toLowerCase();
        }
        this.user = user;
        apiService.setToken(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth initialization failed:', error);
      return false;
    }
  }

  // Login user - accepts email but sends as username to backend
  async login(email, password) {
    try {
      console.log('AuthService: Attempting API login...');
      // Backend expects username, so we use the email field as username
      const response = await apiService.login(email, password);
      
      if (response.token && response.user) {
        this.token = response.token;
        // Normalize role to lowercase for consistency
        response.user.role = (response.user.role || '').toLowerCase();
        this.user = response.user;
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        // Set token in API service
        apiService.setToken(response.token);
        
        console.log('AuthService: API login successful');
        console.log('AuthService: Normalized user role:', response.user.role);
        return { success: true, user: response.user };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('AuthService: API login failed:', error);
      
      // Fallback to mock authentication for development
      if (error.message.includes('Network request failed') || 
          error.message.includes('Network error') ||
          error.message.includes('fetch') ||
          error.message.includes('Request timed out') ||
          error.message.includes('AbortError')) {
        console.log('AuthService: Using mock authentication due to network/timeout error');
        return this.mockLogin(email, password);
      }
      
      return { success: false, message: error.message || 'Login failed' };
    }
  }

  // Mock login for development/testing
  async mockLogin(email, password) {
    console.log('AuthService: Mock login attempt for:', email);
    
    const mockUsers = {
      // Backend test users
      'admin': { 
        id: 1, 
        username: 'admin',
        email: 'admin@portal.com', 
        role: 'Admin', 
        name: 'Administrator',
        token: 'mock-admin-token-123'
      },
      'manager': { 
        id: 2, 
        username: 'manager',
        email: 'manager@portal.com', 
        role: 'Manager', 
        name: 'Manager',
        token: 'mock-manager-token-123'
      },
      'student': { 
        id: 3, 
        username: 'student',
        email: 'student@portal.com', 
        role: 'Student', 
        name: 'Student',
        token: 'mock-student-token-123'
      },
      // Old mock users
      'nauman@admin.com': { 
        id: 4, 
        email: 'nauman@admin.com', 
        role: 'admin', 
        name: 'Nauman Admin',
        token: 'mock-admin-token-123'
      },
      'ali@student.com': { 
        id: 2, 
        email: 'ali@student.com', 
        role: 'student', 
        name: 'Ali Student',
        token: 'mock-student-token-123'
      },
      'qadis@student.com': { 
        id: 3, 
        email: 'qadis@student.com', 
        role: 'student', 
        name: 'Qadis Student',
        token: 'mock-student-token-456'
      },
      'daud@student.com': { 
        id: 4, 
        email: 'daud@student.com', 
        role: 'student', 
        name: 'Daud Ansar',
        token: 'mock-student-token-789'
      },
      'manager@company.com': { 
        id: 8, 
        email: 'manager@company.com', 
        role: 'manager', 
        name: 'Manager Name',
        companyName: 'TechCorp Solutions',
        technology: 'Frontend Development',
        token: 'mock-manager-token-123'
      },
      'john@techcorp.com': { 
        id: 9, 
        email: 'john@techcorp.com', 
        role: 'manager', 
        name: 'John Smith',
        companyName: 'TechCorp Solutions',
        technology: 'Backend Development',
        token: 'mock-manager-token-456'
      }
    };

    const mockPasswords = {
      // Backend test passwords
      'admin': 'admin123',
      'manager': 'manager123',
      'student': 'student123',
      // Old mock passwords
      'nauman@admin.com': 'Admin123',
      'ali@student.com': 'Pass789',
      'qadis@student.com': 'Student456',
      'daud@student.com': 'Daud2024',
      'manager@company.com': 'Manager321',
      'john@techcorp.com': 'John@Tech'
    };

      if (mockUsers[email] && mockPasswords[email] === password) {
        const user = {...mockUsers[email]}; // Create a copy
        // Normalize role to lowercase for consistency
        user.role = (user.role || '').toLowerCase();
        this.token = user.token;
        this.user = user;
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('authToken', user.token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        
        // Set token in API service
        apiService.setToken(user.token);
        
        console.log('AuthService: Mock login successful for:', email);
        console.log('AuthService: Normalized user role:', user.role);
        return { success: true, user: user };
      }
    
    console.log('AuthService: Mock login failed - invalid credentials for:', email);
    return { success: false, message: 'Invalid email or password' };
  }

  // Register user
  async register(userData) {
    try {
      const response = await apiService.register(userData);
      
      if (response.token && response.user) {
        this.token = response.token;
        this.user = response.user;
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        // Set token in API service
        apiService.setToken(response.token);
        
        return { success: true, user: response.user };
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  }

  // Logout user
  async logout() {
    try {
      this.token = null;
      this.user = null;
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      // Clear token from API service
      apiService.setToken(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message || 'Logout failed' };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get user role
  getUserRole() {
    return this.user?.role || null;
  }

  // Check if user is admin
  isAdmin() {
    return this.user?.role === 'admin';
  }

  // Check if user is student
  isStudent() {
    return this.user?.role === 'student';
  }

  // Check if user is manager
  isManager() {
    return this.user?.role === 'manager';
  }

  // Refresh user profile
  async refreshProfile() {
    try {
      const response = await apiService.getProfile();
      
      if (response) {
        this.user = response;
        await AsyncStorage.setItem('userData', JSON.stringify(response));
        return { success: true, user: response };
      }
      
      return { success: false, message: 'Failed to refresh profile' };
    } catch (error) {
      console.error('Profile refresh error:', error);
      return { success: false, message: error.message || 'Failed to refresh profile' };
    }
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;





