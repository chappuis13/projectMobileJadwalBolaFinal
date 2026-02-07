import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { format, addDays, subDays } from 'date-fns';

import { MatchCard } from '../../components/MatchCard';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { fetchMatches } from '../../services/api';
import { Match } from '../../types';
import { useAuth } from '../../context/AuthContext';

// DAFTAR LIGA
const TOP_LEAGUES = [
  { id: 'PL', name: 'Premier League', logo: 'https://crests.football-data.org/PL.png' },
  { id: 'PD', name: 'La Liga', logo: 'https://crests.football-data.org/PD.png' },
  { id: 'SA', name: 'Serie A', logo: 'https://crests.football-data.org/SA.png' },
  { id: 'BL1', name: 'Bundesliga', logo: 'https://crests.football-data.org/BL1.png' },
  { id: 'CL', name: 'Champions League', logo: 'https://crests.football-data.org/CL.png' },
  { id: 'DED', name: 'Eredivisie', logo: 'https://crests.football-data.org/DED.png' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateTabs = [
    { label: 'Yesterday', val: subDays(new Date(), 1) },
    { label: 'Today', val: new Date() },
    { label: 'Tomorrow', val: addDays(new Date(), 1) },
  ];

  const loadMatches = async (date: Date) => {
    setLoading(true);
    const dateString = format(date, 'yyyy-MM-dd');
    const data = await fetchMatches(dateString);
    setMatches(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMatches(selectedDate);
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.displayName || 'Coach'} 👋</Text>
          <Text style={styles.title}>Match Schedule</Text>
        </View>
        <View style={styles.profilePic} />
      </View>

      {/* 2. Top Leagues Selector */}
      <View style={{ marginBottom: 10 }}>
        <Text style={[styles.sectionTitle, { marginLeft: SIZES.padding, marginBottom: 10 }]}>
          Top Leagues
        </Text>
        <FlatList
          horizontal
          data={TOP_LEAGUES}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.leagueCard}
              onPress={() => router.push({
                pathname: "/home/league-detail",
                params: { leagueCode: item.id, leagueName: item.name }
              })}
            >
              <View style={styles.leagueIconContainer}>
                <Image source={{ uri: item.logo }} style={styles.leagueIcon} resizeMode="contain" />
              </View>
              <Text style={styles.leagueName} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 3. Date Selector */}
      <View style={styles.dateContainer}>
        {dateTabs.map((item, index) => {
          const isActive = format(selectedDate, 'yyyy-MM-dd') === format(item.val, 'yyyy-MM-dd');
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.dateItem, isActive && styles.activeDateItem]}
              onPress={() => setSelectedDate(item.val)}
            >
              <Text style={[styles.dateText, isActive && styles.activeDateText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Match List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Fetching live scores...</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No matches scheduled for this date.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <MatchCard
              homeTeam={{ name: item.homeTeam.shortName || item.homeTeam.name, logoUrl: item.homeTeam.crest }}
              awayTeam={{ name: item.awayTeam.shortName || item.awayTeam.name, logoUrl: item.awayTeam.crest }}
              status={item.status as any} // <-- FIX: Tambahkan 'as any' biar TS ga marah
              score={{ home: item.score.fullTime.home ?? 0, away: item.score.fullTime.away ?? 0 }}
              date={format(new Date(item.utcDate), 'HH:mm')}
              leagueName={item.competition.name}
              onPress={() => router.push({
                pathname: "/match-detail",
                params: { matchId: item.id } 
              })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: 24,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  leagueCard: {
    marginRight: 16,
    alignItems: 'center',
    width: 80,
  },
  leagueIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  leagueIcon: {
    width: 35,
    height: 35,
  },
  leagueName: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 11,
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginVertical: 10,
  },
  dateItem: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  activeDateItem: {
    backgroundColor: COLORS.accent,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  activeDateText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 10,
    fontFamily: FONTS.regular,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  }
});