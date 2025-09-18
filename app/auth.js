import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { signIn, signUp } from '../lib/supabase';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user',
  });
  const router = useRouter();

  const userTypes = [
    { id: 'user', label: 'Citizen', icon: '👤', color: '#1E40AF' },
    { id: 'admin', label: 'Administrator', icon: '👨‍💼', color: '#10B981' },
    { id: 'tender', label: 'Contractor', icon: '🏗️', color: '#F59E0B' },
  ];

  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      let result;

      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.userType);
      }

      if (result.error) {
        Alert.alert('Authentication Error', result.error.message);
        return;
      }

      if (!isLogin) {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.'
        );
        setIsLogin(true);
        return;
      }

      // Login successful: navigate
      const userType = result.user.user_metadata?.user_type || 'user';
      console.log('Logged in user:', result.user);
      console.log('User type:', userType);

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
      Alert.alert('Error', 'Authentication failed: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🏛️</Text>
        <Text style={styles.title}>जनConnect</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Welcome back!' : 'Join your community'}
        </Text>
      </View>

      <View style={styles.form}>
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

        <View style={styles.inputContainer}>
          <Lock size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
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

        <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
          <Text style={styles.authButtonText}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchLink}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
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
  authButton: {
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
