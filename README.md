# ⚽ JadwalBola - Football Match Schedule App

> Modern React Native app untuk jadwal pertandingan sepak bola dengan Firebase Authentication dan SQLite Database.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React_Native-Expo-blue)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)
![SQLite](https://img.shields.io/badge/SQLite-Database-green)

## ✨ Features

- 🔐 **Authentication** - Login, Register, Forgot Password dengan Firebase
- 📅 **Match Schedule** - Lihat jadwal pertandingan (Live & Upcoming)
- ❤️ **Favorites** - Simpan tim favorit ke SQLite
- 📊 **Predictions** - Buat prediksi skor pertandingan
- 👤 **User Profile** - Kelola akun dan settings
- 🎨 **Modern UI** - Deep Navy theme dengan Electric Blue accents

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Expo Packages
```bash
npx expo install expo-router expo-font @expo-google-fonts/poppins expo-sqlite react-native-safe-area-context firebase
```

### 3. Configure Firebase
Update kredensial di `src/config/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};
```

### 4. Run App
```bash
npx expo start
```

Scan QR code dengan Expo Go app di smartphone Anda.

## 📱 Screenshots

### Authentication
- Login screen dengan validasi
- Register dengan password confirmation
- Forgot password untuk reset

### Home
- Match cards dengan status LIVE/SCHEDULED
- Team logos dan league info
- Date selector (Yesterday/Today/Tomorrow)

### Favorites & Predictions
- Simpan tim favorit
- Buat prediksi skor
- CRUD operations dengan SQLite

## 🏗️ Tech Stack

- **React Native** + Expo
- **TypeScript** untuk type safety
- **Expo Router** untuk file-based navigation
- **Firebase Auth** untuk authentication
- **SQLite** untuk local database
- **Context API** untuk state management
- **Poppins Font** untuk typography
- **Ionicons** untuk icons

## 📂 Project Structure

```
jadwalBolaFinal/
├── app/                    # Expo Router pages
│   ├── auth/              # Login, Register
│   └── (tabs)/            # Bottom navigation
├── src/
│   ├── components/        # Reusable components
│   ├── screens/           # Screen components
│   ├── services/sqlite/   # Database operations
│   ├── context/           # Auth context
│   ├── constants/         # Theme & colors
│   └── config/            # Firebase config
└── assets/                # Images & fonts
```

## 🎨 Design System

### Colors
```typescript
primary: '#0A1929'      // Deep Navy
accent: '#3B82F6'       // Electric Blue
card: '#1E3A5F'         // Elevated Navy
success: '#22C55E'      // Green
danger: '#EF4444'       // Red
```

### Typography
- **Poppins Bold** - Headlines
- **Poppins SemiBold** - Buttons
- **Poppins Medium** - Labels
- **Poppins Regular** - Body text

## 📚 Documentation

Lihat dokumentasi lengkap di:
- [QUICK_START.md](QUICK_START.md) - Setup & installation guide
- [EXPO_ROUTER_SETUP.md](EXPO_ROUTER_SETUP.md) - Navigation architecture
- [FIREBASE_AUTH_SETUP.md](FIREBASE_AUTH_SETUP.md) - Authentication system
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Complete overview

## 🔐 Authentication Flow

1. App checks auth state via AuthContext
2. Not logged in → Show Login screen
3. User can Login/Register/Reset Password
4. After auth → Redirect to Home with bottom tabs
5. Logout → Return to Login

## 💾 SQLite Database

### Tables
- **favorite_teams** - Simpan tim favorit
- **prediction_notes** - Simpan prediksi match

### Operations
- CREATE - Tambah favorites & predictions
- READ - List semua data
- UPDATE - Edit predictions
- DELETE - Hapus data

## 🎯 Main Screens

### Bottom Tabs
1. **Home** 🏠 - Match schedules
2. **Favorites** ❤️ - Saved teams
3. **Predictions** 📊 - Match predictions
4. **Profile** 👤 - User settings

## 🧪 Testing

```bash
# Start development server
npx expo start

# Clear cache
npx expo start -c

# Type checking
npx tsc --noEmit
```

### Test Checklist
- [ ] Register & Login berhasil
- [ ] Forgot password kirim email
- [ ] Bottom tabs navigation works
- [ ] Add/Remove favorites from SQLite
- [ ] Create/Edit/Delete predictions
- [ ] Logout clears auth state

## 🏆 Features Completed

✅ Firebase Authentication (Login/Register)  
✅ SQLite CRUD Operations  
✅ Bottom Tab Navigation  
✅ Reusable Component Library  
✅ Modern UI/UX Design  
✅ TypeScript Implementation  
✅ State Management (Context API)  
✅ Protected Routes  

## 🚧 Future Enhancements

- [ ] Real-time match data from API
- [ ] Push notifications
- [ ] Social sharing
- [ ] Leaderboard
- [ ] Dark/Light theme toggle

## 📦 Dependencies

```json
{
  "expo": "~54.0.33",
  "expo-router": "~6.0.23",
  "firebase": "^11.2.0",
  "expo-sqlite": "~16.0.10",
  "@expo-google-fonts/poppins": "^0.4.1",
  "react-native": "0.76.6",
  "typescript": "~5.3.3"
}
```

## 💡 Commands

```bash
# Development
npm start                # Start Expo dev server
npm run android         # Run on Android
npm run ios             # Run on iOS

# Production
eas build --platform android
eas build --platform ios
```

## 🐛 Troubleshooting

### Fonts not loading
```bash
npx expo install expo-font @expo-google-fonts/poppins
npx expo start -c
```

### Firebase errors
- Check config di `src/config/firebase.ts`
- Enable Email/Password di Firebase Console

### SQLite errors
```bash
npx expo install expo-sqlite
```

### Navigation issues
```bash
npx expo install expo-router
```

## 👨‍💻 Development

Developed with:
- Visual Studio Code
- Expo Go app for testing
- Firebase Console
- React Native DevTools

## 📄 License

Educational project untuk pembelajaran React Native, Firebase, dan SQLite.

## 🙏 Credits

- Expo team untuk amazing framework
- Firebase untuk authentication
- React Native community
- Design inspiration from modern sports apps

---

**Built with ❤️ using React Native + Expo**

📧 Questions? Create an issue or contact the developer.

⭐ Star this repo if you find it helpful!
