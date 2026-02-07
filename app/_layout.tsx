// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../src/constants/theme';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { initDB } from '../src/services/sqlite';

const MainLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Jika tidak ada user & tidak di halaman auth -> Lempar ke Login
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Jika ada user tapi masih di halaman auth -> Lempar ke Home
      router.replace('/(tabs)/home');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return <Slot />;
};

export default function RootLayout() {
  // Load Font di sini agar global
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Initialize SQLite database
  useEffect(() => {
    initDB()
      .then(() => console.log('✅ Database initialized'))
      .catch(error => console.error('❌ Database error:', error));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
