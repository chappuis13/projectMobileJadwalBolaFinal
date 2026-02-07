import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { fetchStandings, fetchLeagueInfo } from '../../services/api';

// Tab Component Sederhana
const Tabs = ({ activeTab, onTabChange }: any) => (
  <View style={styles.tabContainer}>
    {['Standings', 'Matches', 'Teams'].map((tab) => (
      <TouchableOpacity 
        key={tab} 
        style={[styles.tabItem, activeTab === tab && styles.activeTab]}
        onPress={() => onTabChange(tab)}
      >
        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function LeagueDetailScreen() {
  const router = useRouter();
  const { leagueCode, leagueName } = useLocalSearchParams(); // Ambil parameter dari Home
  
  const [activeTab, setActiveTab] = useState('Standings');
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'Standings') {
      const data = await fetchStandings(leagueCode as string);
      setStandings(data);
    }
    // Nanti bisa tambah logika untuk fetchMatches by League di sini
    setLoading(false);
  };

  const renderStandingItem = ({ item }: any) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, { width: 30, textAlign: 'center' }]}>{item.position}</Text>
      <View style={[styles.cell, { flex: 3, flexDirection: 'row', alignItems: 'center' }]}>
        <Image source={{ uri: item.team.crest }} style={{ width: 24, height: 24, marginRight: 8 }} />
        <Text style={styles.teamName} numberOfLines={1}>{item.team.shortName || item.team.name}</Text>
      </View>
      <Text style={styles.cell}>{item.playedGames}</Text>
      <Text style={styles.cell}>{item.goalDifference}</Text>
      <Text style={[styles.cell, { fontWeight: 'bold', color: COLORS.accent }]}>{item.points}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{leagueName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />
      ) : activeTab === 'Standings' ? (
        <View style={styles.content}>
          {/* Table Header */}
          <View style={[styles.tableRow, { borderBottomWidth: 1, borderColor: COLORS.border, paddingBottom: 8 }]}>
            <Text style={[styles.headerCell, { width: 30 }]}>#</Text>
            <Text style={[styles.headerCell, { flex: 3 }]}>Club</Text>
            <Text style={styles.headerCell}>MP</Text>
            <Text style={styles.headerCell}>GD</Text>
            <Text style={styles.headerCell}>Pts</Text>
          </View>
          
          <FlatList
            data={standings}
            keyExtractor={(item) => item.team.id.toString()}
            renderItem={renderStandingItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.textSecondary }}>Feature coming soon!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  tabItem: {
    marginRight: 20,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  activeTabText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: 13,
    textAlign: 'center',
  },
  headerCell: {
    flex: 1,
    color: COLORS.textSecondary,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    textAlign: 'center',
  },
  teamName: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  }
});
