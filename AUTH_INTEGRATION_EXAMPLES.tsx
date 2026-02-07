// EXAMPLE: Cara menggunakan AuthProvider di _layout.tsx atau App.tsx
// File: app/_layout.tsx (untuk Expo Router)

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Komponen untuk handle routing based on auth state
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // User not logged in, redirect to login
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // User logged in, redirect to home
      router.replace('/home');
    }
  }, [user, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="home/index" />
      <Stack.Screen name="predictions/index" />
      <Stack.Screen name="predictions/add" />
      <Stack.Screen name="favorites/index" />
      <Stack.Screen name="match-detail" />
    </Stack>
  );
}

export default function RootLayout() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Initialize database
  const { isReady: dbReady, error: dbError } = useDatabase();

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  useEffect(() => {
    if (dbError) {
      console.error('Database error:', dbError);
    }
  }, [dbError]);

  if (!fontsLoaded || !dbReady) {
    return null; // Show splash screen
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

/* 
===========================================
ALTERNATIVE: Simple App.tsx Implementation
===========================================
*/

// File: App.tsx (untuk React Native CLI atau simple setup)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/home/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

/* 
===========================================
EXAMPLE: Logout Function di Profile Screen
===========================================
*/

// File: src/screens/profile/ProfileScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              // AuthContext will automatically redirect to login
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.displayName || 'User'}!</Text>
      <Text style={styles.email}>{user?.email}</Text>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  email: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  logoutText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});

/* 
===========================================
EXAMPLE: Protected Route Component
===========================================
*/

// File: src/components/ProtectedRoute.tsx

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return user ? <>{children}</> : null;
};

// Usage in HomeScreen:
// export default function HomeScreen() {
//   return (
//     <ProtectedRoute>
//       <View>
//         {/* Your home screen content */}
//       </View>
//     </ProtectedRoute>
//   );
// }
