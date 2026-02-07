// EXAMPLE: Contoh implementasi lengkap di _layout.tsx atau App.tsx
// File: app/_layout.tsx (untuk Expo Router)

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useDatabase } from '@/hooks/useDatabase';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

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
      // Optionally show error to user
    }
  }, [dbError]);

  if (!fontsLoaded || !dbReady) {
    return null; // Show splash screen
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
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

/* 
===========================================
EXAMPLE: Menggunakan SQLite di HomeScreen
===========================================
*/

import { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { MatchCard } from '@/components/MatchCard';
import { isFavoriteTeam, addFavoriteTeam, removeFavoriteTeam } from '@/services/sqlite';

export default function HomeScreen() {
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Check favorite status untuk setiap tim
  const checkFavorite = async (teamId: string) => {
    const isFav = await isFavoriteTeam(teamId);
    setFavorites(prev => ({ ...prev, [teamId]: isFav }));
  };

  // Toggle favorite
  const toggleFavorite = async (teamId: string, teamName: string, logoUrl: string) => {
    const isFav = favorites[teamId];
    
    if (isFav) {
      await removeFavoriteTeam(teamId);
    } else {
      await addFavoriteTeam(teamId, teamName, logoUrl);
    }
    
    checkFavorite(teamId);
  };

  return (
    <View>
      <FlatList
        data={matches}
        renderItem={({ item }) => (
          <MatchCard
            {...item}
            onPress={() => {
              // Navigate to detail
            }}
            onFavoritePress={() => 
              toggleFavorite(item.homeTeam.id, item.homeTeam.name, item.homeTeam.logoUrl)
            }
            isFavorite={favorites[item.homeTeam.id]}
          />
        )}
      />
    </View>
  );
}

/* 
===========================================
EXAMPLE: Menggunakan Predictions
===========================================
*/

import { addPrediction, getPredictionByMatchId } from '@/services/sqlite';

export default function MatchDetailScreen({ matchId }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    loadPrediction();
  }, [matchId]);

  const loadPrediction = async () => {
    const pred = await getPredictionByMatchId(matchId);
    setPrediction(pred);
  };

  const handleSavePrediction = async (home: number, away: number, note: string) => {
    await addPrediction(matchId, home, away, note);
    loadPrediction(); // Refresh
  };

  return (
    <View>
      {/* UI untuk input prediksi */}
    </View>
  );
}
