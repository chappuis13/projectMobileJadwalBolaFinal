import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Input } from '../../components/Input'; // Komponen yang sudah kita buat
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // 1. Validasi Sederhana
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password and Confirm Password must match!');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // 2. Buat User di Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 3. Update Nama User (Opsional tapi bagus untuk Profile)
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName
        });
      }

      Alert.alert('Success', 'Account created! Welcome to the squad.');
      // Router akan otomatis redirect karena AuthContext mendeteksi login
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Tombol Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {/* Header Sesuai Desain */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="football" size={32} color={COLORS.accent} />
          </View>
          <Text style={styles.title}>Join the Squad</Text>
          <Text style={styles.subtitle}>Sign up to track your favorite matches.</Text>
        </View>

        {/* Form Input */}
        <View style={styles.form}>
          <Input 
            label="Full Name"
            placeholder="John Doe" 
            iconName="person-outline"
            value={fullName}
            onChangeText={setFullName}
          />
          <Input 
            label="Email Address"
            placeholder="example@email.com" 
            iconName="mail-outline"
            value={email}
            onChangeText={setEmail}
          />
          <Input 
            label="Password"
            placeholder="Min 6 characters" 
            iconName="lock-closed-outline" 
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          <Input 
            label="Confirm Password"
            placeholder="Re-enter password" 
            iconName="shield-checkmark-outline" 
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity 
            style={[styles.registerButton, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerText}>
              {loading ? 'Creating Account...' : 'Register Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already a member? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Log In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Deep Navy
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.card, // Card color lebih terang dikit
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
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
  registerButton: {
    height: 56,
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
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
