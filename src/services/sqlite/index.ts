// src/services/sqlite/index.ts
// Central export untuk semua SQLite operations

export { initDB, db } from './db';

// Predictions CRUD
export {
  addPrediction,
  getPredictions,
  getPredictionByMatchId,
  updatePrediction,
  deletePrediction
} from './predictions';

// Favorites CRUD
export {
  addFavoriteTeam,
  getFavoriteTeams,
  isFavoriteTeam,
  removeFavoriteTeam,
  removeFavoriteById
} from './favorites';
