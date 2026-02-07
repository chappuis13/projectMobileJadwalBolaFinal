import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Navigasi Expo Router
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Input } from '../../components/Input';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Sukses! AuthContext akan otomatis mengarahkan ke Home
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header & Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="football" size={42} color={COLORS.accent} />
          </View>
          <Text style={styles.title}>JadwalBola</Text>
          <Text style={styles.subtitle}>Welcome back! Please login to continue.</Text>
        </View>

        {/* 2. Form Input */}
        <View style={styles.form}>
          <Input 
            label="Email Address"
            placeholder="Enter your email" 
            iconName="mail-outline"
            value={email}
            onChangeText={setEmail}
          />
          <Input 
            label="Password"
            placeholder="Enter your password" 
            iconName="lock-closed-outline" 
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity 
            style={styles.forgotPass}
            onPress={() => router.push('/auth/forgot-password')}
          >
            <Text style={styles.forgotPassText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* 3. Main Button */}
          <TouchableOpacity 
            style={[styles.signInButton, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.signInText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. Social Login Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* 5. Social Buttons */}
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={20} color={COLORS.textPrimary} />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
          <Ionicons name="logo-facebook" size={20} color={COLORS.textPrimary} />
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>

        {/* 6. Footer Register Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.linkText}>Create Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Deep Navy Background
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPassText: {
    color: COLORS.accent,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  signInButton: {
    height: 56,
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // Efek glow di Android
  },
  signInText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textSecondary,
    marginHorizontal: 16,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  socialButton: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  facebookButton: {
    backgroundColor: COLORS.facebook,
    marginTop: 12,
  },
  socialText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  linkText: {
    color: COLORS.accent,
    fontFamily: FONTS.semiBold,
  },
});
