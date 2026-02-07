# SQLite Service Documentation

## 📦 Struktur Database

### Table: `favorite_teams`
```sql
CREATE TABLE favorite_teams (
  id INTEGER PRIMARY KEY NOT NULL,
  team_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  logo_url TEXT
);
```

### Table: `prediction_notes`
```sql
CREATE TABLE prediction_notes (
  id INTEGER PRIMARY KEY NOT NULL,
  match_id TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  note TEXT,
  created_at TEXT
);
```

## 🚀 Cara Penggunaan

### Inisialisasi Database
```typescript
import { initDB } from '@/services/sqlite';

// Di App.tsx atau _layout.tsx
useEffect(() => {
  initDB()
    .then(() => console.log('Database initialized'))
    .catch(error => console.error('DB Error:', error));
}, []);
```

### CRUD Operations - Predictions

#### CREATE - Tambah Prediksi
```typescript
import { addPrediction } from '@/services/sqlite';

const savePrediction = async () => {
  try {
    await addPrediction('match123', 2, 1, 'Chelsea will win');
    Alert.alert('Success', 'Prediction saved!');
  } catch (error) {
    console.error(error);
  }
};
```

#### READ - Ambil Semua Prediksi
```typescript
import { getPredictions } from '@/services/sqlite';

const loadPredictions = async () => {
  try {
    const predictions = await getPredictions();
    console.log(predictions);
  } catch (error) {
    console.error(error);
  }
};
```

#### READ - Ambil Prediksi by Match ID
```typescript
import { getPredictionByMatchId } from '@/services/sqlite';

const loadPrediction = async (matchId: string) => {
  try {
    const prediction = await getPredictionByMatchId(matchId);
    if (prediction) {
      console.log('Found:', prediction);
    }
  } catch (error) {
    console.error(error);
  }
};
```

#### UPDATE - Update Prediksi
```typescript
import { updatePrediction } from '@/services/sqlite';

const editPrediction = async () => {
  try {
    await updatePrediction(1, 3, 1, 'Updated prediction');
    Alert.alert('Success', 'Prediction updated!');
  } catch (error) {
    console.error(error);
  }
};
```

#### DELETE - Hapus Prediksi
```typescript
import { deletePrediction } from '@/services/sqlite';

const removePrediction = async (id: number) => {
  try {
    await deletePrediction(id);
    Alert.alert('Success', 'Prediction deleted!');
  } catch (error) {
    console.error(error);
  }
};
```

### CRUD Operations - Favorites

#### CREATE - Tambah Tim Favorit
```typescript
import { addFavoriteTeam } from '@/services/sqlite';

const addToFavorites = async () => {
  try {
    await addFavoriteTeam('team123', 'Chelsea FC', 'https://...');
    Alert.alert('Success', 'Team added to favorites!');
  } catch (error) {
    console.error(error);
  }
};
```

#### READ - Ambil Semua Tim Favorit
```typescript
import { getFavoriteTeams } from '@/services/sqlite';

const loadFavorites = async () => {
  try {
    const teams = await getFavoriteTeams();
    console.log(teams);
  } catch (error) {
    console.error(error);
  }
};
```

#### READ - Cek Apakah Tim Favorit
```typescript
import { isFavoriteTeam } from '@/services/sqlite';

const checkFavorite = async (teamId: string) => {
  try {
    const isFav = await isFavoriteTeam(teamId);
    console.log('Is favorite:', isFav);
  } catch (error) {
    console.error(error);
  }
};
```

#### DELETE - Hapus Tim Favorit
```typescript
import { removeFavoriteTeam, removeFavoriteById } from '@/services/sqlite';

// By team_id
const removeByTeamId = async (teamId: string) => {
  try {
    await removeFavoriteTeam(teamId);
    Alert.alert('Success', 'Team removed from favorites!');
  } catch (error) {
    console.error(error);
  }
};

// By id
const removeById = async (id: number) => {
  try {
    await removeFavoriteById(id);
    Alert.alert('Success', 'Team removed from favorites!');
  } catch (error) {
    console.error(error);
  }
};
```

## 📝 Best Practices

1. **Always handle errors** - Gunakan try-catch untuk semua operasi database
2. **Use TypeScript types** - Import types dari `@/types` untuk type safety
3. **Async/Await** - Semua fungsi database adalah async, jangan lupa await
4. **Initialize once** - Panggil `initDB()` hanya sekali saat app start
5. **Transaction safety** - Semua operasi sudah wrapped dalam transaction

## 🎯 Keunggulan Implementasi Ini

✅ **Modular Architecture** - Setiap tabel punya service sendiri  
✅ **Type Safe** - Full TypeScript dengan interface yang jelas  
✅ **Promise-based** - Modern async/await pattern  
✅ **Error Handling** - Proper error handling di setiap operasi  
✅ **Transaction Safe** - Semua operasi wrapped dalam database transaction  
✅ **Easy to Test** - Fungsi-fungsi kecil yang mudah di-test  

## 📊 Penilaian CRUD

Service ini memenuhi kriteria:
- ✅ **CREATE** - `addPrediction`, `addFavoriteTeam`
- ✅ **READ** - `getPredictions`, `getPredictionByMatchId`, `getFavoriteTeams`, `isFavoriteTeam`
- ✅ **UPDATE** - `updatePrediction`
- ✅ **DELETE** - `deletePrediction`, `removeFavoriteTeam`, `removeFavoriteById`
