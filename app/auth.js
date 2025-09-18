import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle } from 'lucide-react-native';
import { signIn, signUp, sendVerificationEmail } from '../lib/supabase';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationSent, setVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
  });
  const router = useRouter();

  const userTypes = [
    { id: 'user', label: 'Citizen', icon: '👤', color: '#1E40AF' },
    { id: 'admin', label: 'Administrator', icon: '👨‍💼', color: '#10B981' },
    { id: 'tender', label: 'Contractor', icon: '🏗️', color: '#F59E0B' },
  ];

  const handleAuthButtonPress = async () => {
    console.log('Button pressed - isLogin:', isLogin, 'currentStep:', currentStep);
    console.log('Form data:', formData);

    // For signup step 1, just validate and move to next step
    if (!isLogin && currentStep === 1) {
      console.log('Processing step 1 validation...');

      // Step 1 validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      if (!isValidEmail(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
      if (!isValidPhone(formData.phone)) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }

      console.log('Step 1 validation passed, moving to step 2');
      // Move to step 2
      setCurrentStep(2);
      return; // This is correct - we only want to move to next step
    }

    console.log('Proceeding to handleAuth...');
    // For login or signup step 2, proceed with authentication
    await handleAuth();
  };


  const handleAuth = async () => {
    // LOGIN FLOW
    if (isLogin) {
      if (!formData.email || !formData.password) {
        Alert.alert('Error', 'Please fill in email and password');
        return;
      }

      try {
        const result = await signIn(formData.email, formData.password);
        if (result.error) {
          Alert.alert('Authentication Error', result.error.message);
          return;
        }

        // Navigate based on user type
        const userType = result.user.user_metadata?.user_type || 'user';
        switch (userType) {
          case 'admin':
            router.replace('/admin-dashboard');
            break;
          case 'tender':
            router.replace('/tender-dashboard');
            break;
          default:
            router.replace('/(tabs)'); // citizen/home screen
        }
      } catch (error) {
        Alert.alert('Error', 'Login failed: ' + error.message);
      }
      return;
    }

    // SIGNUP FLOW
    if (currentStep === 1) {
      // Validate personal info
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      if (!isValidEmail(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
      if (!isValidPhone(formData.phone)) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }

      // Move to step 2
      setCurrentStep(2);
      return; // stop here, don’t try to create account yet
    }

    if (currentStep === 2) {
      // Validate password info
      if (!formData.password || !formData.confirmPassword) {
        Alert.alert('Error', 'Please fill in password fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return;
      }

      try {
        const profileData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        };

        const result = await signUp(formData.email, formData.password, formData.userType, profileData);

        if (result.error) {
          Alert.alert('Authentication Error', result.error.message);
          return;
        }

        setVerificationSent(true);
        Alert.alert(
          'Account Created Successfully!',
          'Please check your email and click the verification link to activate your account. You can then sign in.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsLogin(true);
                setCurrentStep(1);
                setVerificationSent(false);
                resetForm();
              },
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Signup failed: ' + error.message);
      }
    }
  };


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      password: '',
      confirmPassword: '',
      userType: 'user',
    });
  };

  const goNextStep = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (!isValidEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    // update step
    setCurrentStep(2);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => {
    if (isLogin) return null;

    return (
      <View style={styles.stepIndicator}>
        <View style={styles.stepContainer}>
          <View style={[styles.step, currentStep >= 1 && styles.stepActive]}>
            <Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>1</Text>
          </View>
          <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
          <View style={[styles.step, currentStep >= 2 && styles.stepActive]}>
            <Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text>
          </View>
        </View>
        <View style={styles.stepLabels}>
          <Text style={styles.stepLabel}>Personal Info</Text>
          <Text style={styles.stepLabel}>Account Setup</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>🏛️</Text>
          <Text style={styles.title}>जनConnect</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back!' :
              currentStep === 1 ? 'Create your account' : 'Set up your password'}
          </Text>
        </View>

        {renderStepIndicator()}

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeLabel}>Select User Type</Text>
              <View style={styles.userTypeButtons}>
                {userTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.userTypeButton,
                      formData.userType === type.id && styles.userTypeButtonActive,
                      { borderColor: type.color },
                    ]}
                    onPress={() => setFormData({ ...formData, userType: type.id })}
                  >
                    <Text style={styles.userTypeIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.userTypeText,
                        formData.userType === type.id && { color: type.color },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 1: Personal Information (Sign up only) */}
          {!isLogin && currentStep === 1 && (
            <>
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <User size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <User size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address *"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Phone size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  multiline
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          {/* Step 2: Password Setup (Sign up only) or Login Form */}
          {(isLogin || (!isLogin && currentStep === 2)) && (
            <>
              {isLogin && (
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={isLogin ? "Password" : "Create Password *"}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          <View style={styles.buttonContainer}>
            {!isLogin && currentStep === 2 && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.authButton} onPress={handleAuthButtonPress}>
              <Text style={styles.authButtonText}>
                {isLogin ? 'Sign In' : currentStep === 1 ? 'Continue' : 'Create Account'}
              </Text>
            </TouchableOpacity>


          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => {
              setIsLogin(!isLogin);
              setCurrentStep(1);
              resetForm();
            }}>
              <Text style={styles.switchLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  stepIndicator: {
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: '#1E40AF',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  stepLineActive: {
    backgroundColor: '#1E40AF',
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  userTypeContainer: {
    marginBottom: 30,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  userTypeButtons: {
    gap: 12,
  },
  userTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  userTypeButtonActive: {
    backgroundColor: '#F0F9FF',
  },
  userTypeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  authButton: {
    flex: 1,
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  authButtonHalf: {
    flex: 2,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchText: {
    color: '#6B7280',
    fontSize: 14,
  },
  switchLink: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '600',
  },
});
