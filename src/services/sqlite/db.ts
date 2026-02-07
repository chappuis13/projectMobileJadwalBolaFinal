// src/services/sqlite/db.ts
import * as SQLite from 'expo-sqlite';

// 1. Buka database dengan cara baru (Sync)
export const db = SQLite.openDatabaseSync('jadwalbola.db');

// 2. Inisialisasi Tabel (Async/Await Modern)
export const initDB = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS favorite_teams (
        id INTEGER PRIMARY KEY NOT NULL,
        team_id TEXT NOT NULL,
        team_name TEXT NOT NULL,
        logo_url TEXT
      );

      CREATE TABLE IF NOT EXISTS prediction_notes (
        id INTEGER PRIMARY KEY NOT NULL,
        match_id TEXT NOT NULL,
        home_score INTEGER,
        away_score INTEGER,
        note TEXT,
        created_at TEXT
      );
    `);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing DB:', error);
  }
};
