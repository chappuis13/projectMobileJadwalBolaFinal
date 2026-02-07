// src/services/sqlite/favorites.ts
import { db } from './db';
import { FavoriteTeam } from '../../types';

// CREATE - Add favorite team (Modern async/await)
export const addFavoriteTeam = async (teamId: string, teamName: string, logoUrl: string) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO favorite_teams (team_id, team_name, logo_url) VALUES (?, ?, ?)',
      [teamId, teamName, logoUrl]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Error adding favorite team:', error);
    throw error;
  }
};

// READ - Get all favorite teams (Modern async/await)
export const getFavoriteTeams = async () => {
  try {
    const allRows = await db.getAllAsync<FavoriteTeam>('SELECT * FROM favorite_teams ORDER BY team_name ASC');
    return allRows;
  } catch (error) {
    console.error('❌ Error fetching favorite teams:', error);
    return [];
  }
};

// READ - Check if team is favorite (Modern async/await)
export const isFavoriteTeam = async (teamId: string) => {
  try {
    const result = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM favorite_teams WHERE team_id = ? LIMIT 1',
      [teamId]
    );
    return result !== null;
  } catch (error) {
    console.error('❌ Error checking favorite team:', error);
    return false;
  }
};

// DELETE - Remove favorite team (Modern async/await)
export const removeFavoriteTeam = async (teamId: string) => {
  try {
    await db.runAsync('DELETE FROM favorite_teams WHERE team_id = ?', [teamId]);
  } catch (error) {
    console.error('❌ Error removing favorite team:', error);
    throw error;
  }
};

// DELETE by ID (Modern async/await)
export const removeFavoriteById = async (id: number) => {
  try {
    await db.runAsync('DELETE FROM favorite_teams WHERE id = ?', [id]);
  } catch (error) {
    console.error('❌ Error removing favorite by ID:', error);
    throw error;
  }
};
