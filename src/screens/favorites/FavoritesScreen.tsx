// src/screens/favorites/FavoritesScreen.tsx
// Implementasi Simple CRUD untuk Favorite Teams
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { FavoriteTeam } from '../../types';
import { getFavoriteTeams, removeFavoriteById } from '../../services/sqlite';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavoriteTeams();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorite teams');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: number, teamName: string) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${teamName} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFavoriteById(id);
              loadFavorites(); // Refresh list
              Alert.alert('Success', 'Team removed from favorites');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove team');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: FavoriteTeam }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.logo_url }} 
        style={styles.logo}
      />
      
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.team_name}</Text>
        <Text style={styles.teamId}>ID: {item.team_id}</Text>
      </View>

      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemove(item.id, item.team_name)}
      >
        <Ionicons name="heart" size={24} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Teams</Text>
        <Text style={styles.subtitle}>
          {favorites.length} team{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="heart-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No favorite teams yet</Text>
          <Text style={styles.emptySubtext}>
            Start adding your favorite teams!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
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
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  listContent: {
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 16,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  teamId: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  removeButton: {
    padding: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
