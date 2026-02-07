# 🔄 SQLite Migration Guide - Old API → Modern API

## ✅ Migration Completed

Project berhasil di-upgrade dari **Expo SQLite Old API** (callback-based) ke **Modern API** (async/await) untuk performa lebih baik dan kode yang lebih bersih.

---

## 📊 Perubahan Utama

### 1. **Database Connection**

#### ❌ Old API (Callback)
```typescript
import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabase('jadwalbola.db');
```

#### ✅ New API (Sync)
```typescript
import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabaseSync('jadwalbola.db');
```

---

### 2. **Create Tables**

#### ❌ Old API (Transaction with Callbacks)
```typescript
export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS favorite_teams (...)`,
        [],
        () => resolve(true),
        (_, error) => reject(error)
      );
    });
  });
};
```

#### ✅ New API (Async/Await)
```typescript
export const initDB = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS favorite_teams (...);
      CREATE TABLE IF NOT EXISTS prediction_notes (...);
    `);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing DB:', error);
  }
};
```

**Keuntungan:**
- ✅ Bisa execute multiple statements sekaligus
- ✅ `PRAGMA journal_mode = WAL` untuk performa lebih baik
- ✅ Tidak ada "callback hell"

---

### 3. **INSERT Data (CREATE)**

#### ❌ Old API
```typescript
export const addPrediction = (matchId: string, home: number, away: number, note: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO prediction_notes (...) VALUES (?, ?, ?, ?, ?)',
        [matchId, home, away, note, new Date().toISOString()],
        (_, result) => resolve(result),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};
```

#### ✅ New API
```typescript
export const addPrediction = async (matchId: string, home: number, away: number, note: string) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO prediction_notes (...) VALUES (?, ?, ?, ?, ?)',
      [matchId, home, away, note, new Date().toISOString()]
    );
    return result.lastInsertRowId; // Return ID langsung
  } catch (error) {
    console.error('❌ Error adding prediction:', error);
    throw error;
  }
};
```

**Keuntungan:**
- ✅ Lebih bersih dengan `async/await`
- ✅ `result.lastInsertRowId` untuk get ID baru
- ✅ Error handling dengan try-catch

---

### 4. **SELECT Data (READ)**

#### ❌ Old API
```typescript
export const getPredictions = () => {
  return new Promise<Prediction[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM prediction_notes ORDER BY created_at DESC',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};
```

#### ✅ New API
```typescript
export const getPredictions = async () => {
  try {
    const allRows = await db.getAllAsync<Prediction>(
      'SELECT * FROM prediction_notes ORDER BY created_at DESC'
    );
    return allRows; // Return array langsung
  } catch (error) {
    console.error('❌ Error fetching predictions:', error);
    return [];
  }
};
```

**Keuntungan:**
- ✅ `getAllAsync<Type>()` untuk TypeScript support
- ✅ Return array langsung tanpa perlu akses `rows._array`

---

### 5. **SELECT Single Row**

#### ❌ Old API
```typescript
export const getPredictionByMatchId = (matchId: string) => {
  return new Promise<Prediction | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM prediction_notes WHERE match_id = ? LIMIT 1',
        [matchId],
        (_, { rows: { _array } }) => resolve(_array[0] || null),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};
```

#### ✅ New API
```typescript
export const getPredictionByMatchId = async (matchId: string) => {
  try {
    const result = await db.getFirstAsync<Prediction>(
      'SELECT * FROM prediction_notes WHERE match_id = ? LIMIT 1',
      [matchId]
    );
    return result || null; // Return object atau null
  } catch (error) {
    console.error('❌ Error fetching prediction:', error);
    return null;
  }
};
```

**Keuntungan:**
- ✅ `getFirstAsync<Type>()` langsung return 1 row
- ✅ Tidak perlu `_array[0]`

---

### 6. **UPDATE Data**

#### ❌ Old API
```typescript
export const updatePrediction = (id: number, home: number, away: number, note: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE prediction_notes SET home_score = ?, away_score = ?, note = ? WHERE id = ?',
        [home, away, note, id],
        (_, result) => resolve(result),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};
```

#### ✅ New API
```typescript
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
```

---

### 7. **DELETE Data**

#### ❌ Old API
```typescript
export const deletePrediction = (id: number) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM prediction_notes WHERE id = ?',
        [id],
        (_, result) => resolve(result),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};
```

#### ✅ New API
```typescript
export const deletePrediction = async (id: number) => {
  try {
    await db.runAsync('DELETE FROM prediction_notes WHERE id = ?', [id]);
  } catch (error) {
    console.error('❌ Error deleting prediction:', error);
    throw error;
  }
};
```

---

## 📝 Summary of Changes

### Files Modified:
1. ✅ `src/services/sqlite/db.ts` - Database initialization
2. ✅ `src/services/sqlite/predictions.ts` - Predictions CRUD
3. ✅ `src/services/sqlite/favorites.ts` - Favorites CRUD

### API Changes:
| Operation | Old API | New API |
|-----------|---------|---------|
| **Open DB** | `openDatabase()` | `openDatabaseSync()` |
| **Create Table** | `transaction() + executeSql()` | `execAsync()` |
| **INSERT** | `transaction() + executeSql()` | `runAsync()` |
| **SELECT All** | `executeSql() + rows._array` | `getAllAsync<T>()` |
| **SELECT One** | `executeSql() + rows._array[0]` | `getFirstAsync<T>()` |
| **UPDATE** | `transaction() + executeSql()` | `runAsync()` |
| **DELETE** | `transaction() + executeSql()` | `runAsync()` |

---

## 🚀 Benefits

### 1. **Cleaner Code**
- ❌ No more callback hell
- ✅ Modern async/await syntax
- ✅ Better error handling with try-catch

### 2. **Better Performance**
- ✅ `PRAGMA journal_mode = WAL` enabled
- ✅ Faster read operations
- ✅ Better concurrency

### 3. **Type Safety**
- ✅ `getAllAsync<Prediction>()` returns typed array
- ✅ `getFirstAsync<Prediction>()` returns typed object
- ✅ Better TypeScript integration

### 4. **Easier to Maintain**
- ✅ Less boilerplate code
- ✅ More readable
- ✅ Modern JavaScript standards

---

## 🧪 Testing

Setelah migrasi, test semua CRUD operations:

```typescript
// Test CREATE
await addPrediction('match-1', 2, 1, 'Home team will win');

// Test READ
const predictions = await getPredictions(); // Should return array
const singlePrediction = await getPredictionByMatchId('match-1'); // Should return object

// Test UPDATE
await updatePrediction(1, 3, 1, 'Updated score');

// Test DELETE
await deletePrediction(1);
```

---

## ✅ Checklist

- [x] Database connection updated to `openDatabaseSync()`
- [x] `initDB()` updated to use `execAsync()`
- [x] All CRUD operations updated to modern API
- [x] Type safety with generics (`getAllAsync<T>`, `getFirstAsync<T>`)
- [x] Error handling with try-catch
- [x] Console logs for debugging
- [x] WAL mode enabled for better performance

---

## 📚 References

- [Expo SQLite Documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [SQLite WAL Mode](https://www.sqlite.org/wal.html)
- [Modern Async/Await Best Practices](https://javascript.info/async-await)

---

**Migration Date:** February 7, 2026  
**Migrated By:** GitHub Copilot  
**Status:** ✅ Complete  

🎉 **Your code is now modern, clean, and performant!**
