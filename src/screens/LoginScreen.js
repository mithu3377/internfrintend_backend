import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '../context/NavigationContext.js';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('ali@student.com');
  const [password, setPassword] = useState('Pass789');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { navigate } = useNavigation();

  const handleLogin = async () => {
    console.log('Login attempt started with:', { email, password: '***' });
    
    if (isLoading) {
      return; // Prevent multiple login attempts
    }
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Login timeout reached, resetting loading state');
      setIsLoading(false);
      Alert.alert('Error', 'Login request timed out. Please try again.');
    }, 15000); // 15 second timeout
    
    try {
      const result = await login(email, password);
      clearTimeout(timeoutId); // Clear timeout if login completes
      console.log('Login result:', result);
      
      if (!result.success) {
        Alert.alert('Error', result.message || 'Invalid credentials');
      } else {
        console.log('Login successful! Navigating to dashboard...');
        
        // Navigate to appropriate dashboard based on user role
        if (result.user?.role === 'admin') {
          navigate('AdminDashboard');
        } else if (result.user?.role === 'student') {
          navigate('StudentDashboard');
        } else if (result.user?.role === 'manager') {
          navigate('ManagerDashboard');
        } else {
          // Default fallback
          navigate('StudentDashboard');
        }
      }
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout if error occurs
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Login failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      
      {/* Background Gradient */}
      <View style={styles.gradientBackground} />
      
      {/* Main Card */}
      <View style={styles.card}>
        {/* Graduation Cap Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎓</Text>
        </View>
        
        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subtitleText}>Sign in to your internship portal</Text>
        
        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIconText}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sign In Button */}
        <TouchableOpacity 
          style={[styles.signInButton, isLoading && styles.signInButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: '#667EEA',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: height * 0.15,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 60,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  eyeIconText: {
    fontSize: 20,
  },
  signInButton: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
});

export default LoginScreen;