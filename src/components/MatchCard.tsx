import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface Team {
  name: string;
  logoUrl: string; // URL gambar logo
}

interface MatchCardProps {
  homeTeam: Team;
  awayTeam: Team;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  date?: string;   // Jam (e.g., "19:45")
  score?: { home: number; away: number };
  leagueName: string;
  minute?: string; // Menit pertandingan (e.g., "72'")
  onPress: () => void;
}

export const MatchCard = ({
  homeTeam,
  awayTeam,
  status,
  date,
  score,
  leagueName,
  minute,
  onPress
}: MatchCardProps) => {

  // Fungsi untuk render status badge (Live/Upcoming)
  const renderStatus = () => {
    if (status === 'LIVE') {
      return (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE • {minute}</Text>
        </View>
      );
    }
    return (
      <View style={styles.scheduleBadge}>
        <Text style={styles.scheduleText}>{date}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Header Card: League Name */}
      <View style={styles.header}>
        <Text style={styles.leagueName}>{leagueName}</Text>
        {renderStatus()}
      </View>

      {/* Body: Teams & Score */}
      <View style={styles.body}>
        
        {/* Home Team */}
        <View style={styles.teamContainer}>
          <Image source={{ uri: homeTeam.logoUrl }} style={styles.logo} />
          <Text style={styles.teamName} numberOfLines={1}>{homeTeam.name}</Text>
        </View>

        {/* Score / VS */}
        <View style={styles.scoreContainer}>
          {status !== 'SCHEDULED' ? (
            <Text style={styles.scoreText}>
              {score?.home} - {score?.away}
            </Text>
          ) : (
            <Text style={styles.vsText}>VS</Text>
          )}
        </View>

        {/* Away Team */}
        <View style={styles.teamContainer}>
          <Image source={{ uri: awayTeam.logoUrl }} style={styles.logo} />
          <Text style={styles.teamName} numberOfLines={1}>{awayTeam.name}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card, // Warna Elevated Navy
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)', // Efek border tipis premium
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leagueName: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red transparan
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
    marginRight: 6,
  },
  liveText: {
    color: COLORS.danger,
    fontFamily: FONTS.bold,
    fontSize: 10,
  },
  scheduleBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scheduleText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    alignItems: 'center',
    width: '30%', // Memastikan layout seimbang
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  teamName: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 14,
    textAlign: 'center',
  },
  scoreContainer: {
    width: '30%',
    alignItems: 'center',
  },
  scoreText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: 28, // Skor besar sesuai desain
  },
  vsText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    fontSize: 20,
  },
});
