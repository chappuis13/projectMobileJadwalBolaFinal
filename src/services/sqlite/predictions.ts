// src/services/sqlite/predictions.ts
import { db } from './db';
import { Prediction } from '../../types';

// CREATE (Modern async/await)
export const addPrediction = async (matchId: string, home: number, away: number, note: string) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO prediction_notes (match_id, home_score, away_score, note, created_at) VALUES (?, ?, ?, ?, ?)',
      [matchId, home, away, note, new Date().toISOString()]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Error adding prediction:', error);
    throw error;
  }
};

// READ (Modern async/await)
export const getPredictions = async () => {
  try {
    const allRows = await db.getAllAsync<Prediction>('SELECT * FROM prediction_notes ORDER BY created_at DESC');
    return allRows;
  } catch (error) {
    console.error('❌ Error fetching predictions:', error);
    return [];
  }
};

// READ by Match ID (Modern async/await)
export const getPredictionByMatchId = async (matchId: string) => {
  try {
    const result = await db.getFirstAsync<Prediction>(
      'SELECT * FROM prediction_notes WHERE match_id = ? LIMIT 1',
      [matchId]
    );
    return result || null;
  } catch (error) {
    console.error('❌ Error fetching prediction by match ID:', error);
    return null;
  }
};

// UPDATE (Modern async/await)
export const updatePrediction = async (id: number, home: number, away: number, note: string) => {
  try {
    await db.runAsync(
      'UPDATE prediction_notes SET home_score = ?, away_score = ?, note = ? WHERE id = ?',
      [home, away, note, id]
    );
  } catch (error) {
    console.error('❌ Error updating prediction:', error);
    throw error;
  }
};

// DELETE (Modern async/await)
export const deletePrediction = async (id: number) => {
  try {
    await db.runAsync('DELETE FROM prediction_notes WHERE id = ?', [id]);
  } catch (error) {
    console.error('❌ Error deleting prediction:', error);
    throw error;
  }
};
