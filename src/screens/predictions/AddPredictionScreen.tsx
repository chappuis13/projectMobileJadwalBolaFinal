// src/screens/predictions/AddPredictionScreen.tsx
// Demonstrasi CREATE & UPDATE operations
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Button } from '../../components/Button';
import { addPrediction, updatePrediction, getPredictionByMatchId } from '../../services/sqlite';
import { Prediction } from '../../types';

export default function AddPredictionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const matchId = params.matchId as string;
  const editId = params.editId as string;

  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (editId) {
      loadPrediction();
    }
  }, [editId]);

  const loadPrediction = async () => {
    try {
      const prediction = await getPredictionByMatchId(matchId);
      if (prediction) {
        setHomeScore(prediction.home_score.toString());
        setAwayScore(prediction.away_score.toString());
        setNote(prediction.note || '');
        setIsEditMode(true);
      }
    } catch (error) {
      console.error('Error loading prediction:', error);
    }
  };

  const handleSave = async () => {
    // Validasi
    if (!homeScore || !awayScore) {
      Alert.alert('Error', 'Please enter both scores');
      return;
    }

    const home = parseInt(homeScore);
    const away = parseInt(awayScore);

    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      Alert.alert('Error', 'Please enter valid scores');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editId) {
        // UPDATE operation
        await updatePrediction(parseInt(editId), home, away, note);
        Alert.alert('Success', 'Prediction updated successfully');
      } else {
        // CREATE operation
        await addPrediction(matchId, home, away, note);
        Alert.alert('Success', 'Prediction saved successfully');
      }
      router.back();
    } catch (error) {
      console.error('Error saving prediction:', error);
      Alert.alert('Error', 'Failed to save prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditMode ? 'Edit Prediction' : 'Add Prediction'}
          </Text>
          <Text style={styles.subtitle}>Match ID: {matchId}</Text>
        </View>

        {/* Score Inputs */}
        <View style={styles.scoresContainer}>
          <View style={styles.scoreInputContainer}>
            <Text style={styles.label}>Home Score</Text>
            <TextInput
              style={styles.scoreInput}
              value={homeScore}
              onChangeText={setHomeScore}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={2}
            />
          </View>

          <Text style={styles.scoreDivider}>-</Text>

          <View style={styles.scoreInputContainer}>
            <Text style={styles.label}>Away Score</Text>
            <TextInput
              style={styles.scoreInput}
              value={awayScore}
              onChangeText={setAwayScore}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={2}
            />
          </View>
        </View>

        {/* Note Input */}
        <View style={styles.noteContainer}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add your analysis or reasoning..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <Button
          title={isEditMode ? 'Update Prediction' : 'Save Prediction'}
          onPress={handleSave}
          isLoading={loading}
        />

        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: SIZES.padding,
  },
  header: {
    marginBottom: 32,
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
  label: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  scoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  scoreInputContainer: {
    flex: 1,
  },
  scoreInput: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scoreDivider: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.textSecondary,
    marginHorizontal: 16,
  },
  noteContainer: {
    marginBottom: 24,
  },
  noteInput: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
