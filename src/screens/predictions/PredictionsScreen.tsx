// src/screens/predictions/PredictionsScreen.tsx
// Contoh implementasi Full CRUD dengan SQLite
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Prediction } from '../../types';
import { getPredictions, deletePrediction } from '../../services/sqlite';
import { Ionicons } from '@expo/vector-icons';

export default function PredictionsScreen() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load predictions saat screen dibuka
  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const data = await getPredictions();
      setPredictions(data);
    } catch (error) {
      console.error('Error loading predictions:', error);
      Alert.alert('Error', 'Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Prediction',
      'Are you sure you want to delete this prediction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePrediction(id);
              loadPredictions(); // Refresh list
              Alert.alert('Success', 'Prediction deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete prediction');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Prediction }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.matchId}>Match ID: {item.match_id}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{item.home_score} - {item.away_score}</Text>
      </View>
      
      {item.note && (
        <Text style={styles.note}>{item.note}</Text>
      )}
      
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading predictions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Predictions</Text>
        <Text style={styles.subtitle}>
          {predictions.length} prediction{predictions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {predictions.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="football-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No predictions yet</Text>
          <Text style={styles.emptySubtext}>
            Start predicting match results!
          </Text>
        </View>
      ) : (
        <FlatList
          data={predictions}
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchId: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  score: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.textPrimary,
  },
  note: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  date: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
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
