# 🚀 Quick Start Guide - JadwalBola App

## 📋 Prerequisites

- Node.js 18+ installed
- Expo Go app on your phone (iOS/Android)
- Firebase account & project setup

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Required Expo Packages

```bash
# Navigation & Router
npx expo install expo-router expo-linking expo-constants expo-status-bar

# UI Components
npx expo install react-native-safe-area-context react-native-screens

# Fonts
npx expo install expo-font @expo-google-fonts/poppins

# Icons
npx expo install @expo/vector-icons

# Firebase
npm install firebase

# SQLite Database
npx expo install expo-sqlite

# Additional utilities
npx expo install react-native-gesture-handler
```

### 3. Firebase Setup

1. Buka https://console.firebase.google.com
2. Buat project baru atau gunakan existing "jadwalbola-final"
3. Enable **Authentication** → Email/Password
4. Copy Firebase config ke `src/config/firebase.ts`

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Start Development Server

```bash
npx expo start
```

Options:
- Press `i` - Open iOS simulator
- Press `a` - Open Android emulator
- Scan QR code - Open in Expo Go app on your phone

## 📱 App Structure

```
jadwalBolaFinal/
├── app/                      # Expo Router pages
│   ├── _layout.tsx           # Root layout (Gatekeeper)
│   ├── index.tsx             # Initial redirector
│   ├── auth/                 # Authentication screens
│   ├── (tabs)/               # Bottom tab navigation
│   └── predictions/          # Predictions screens
├── src/
│   ├── components/           # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── MatchCard.tsx
│   ├── constants/            # Theme colors & fonts
│   │   └── theme.ts
│   ├── context/              # State management
│   │   └── AuthContext.tsx
│   ├── screens/              # Screen components
│   │   ├── auth/
│   │   ├── home/
│   │   ├── favorites/
│   │   ├── predictions/
│   │   └── profile/
│   ├── services/             # Business logic
│   │   └── sqlite/           # SQLite CRUD operations
│   ├── types/                # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/                # Helper functions
│   │   └── authHelpers.ts
│   └── config/               # Configuration files
│       └── firebase.ts
└── assets/                   # Images, fonts, etc
```

## 🎯 Main Features

### ✅ Authentication
- Login with email & password
- Register new account
- Forgot password
- Auto-redirect based on auth state

### ✅ Bottom Navigation
- Home - Match schedules
- Favorites - Saved teams
- Predictions - User predictions
- Profile - User settings & logout

### ✅ SQLite Database
- Favorite teams CRUD
- Match predictions CRUD
- Persistent local storage

### ✅ Modern UI/UX
- Deep Navy theme (#0A1929)
- Electric Blue accents (#3B82F6)
- Poppins font family
- Smooth animations

## 🧪 Testing the App

### Test Authentication Flow:

1. **Start app** → Should show Login screen
2. **Click "Create Account"** → Register form appears
3. **Fill form & register** → Auto-login & redirect to Home
4. **Close app & reopen** → Should stay logged in (Home screen)
5. **Go to Profile** → Click Logout → Back to Login screen

### Test Navigation:

1. **Bottom tabs** → Tap each tab (Home, Favorites, Predictions, Profile)
2. **Add prediction** → Navigate to Predictions → Press add button
3. **View favorites** → Navigate to Favorites tab

### Test SQLite:

1. **Add favorite team** → Should save to SQLite
2. **Close app & reopen** → Favorites still there
3. **Add prediction** → Should save to SQLite
4. **Delete prediction** → Should remove from SQLite

## 🐛 Troubleshooting

### Problem: "Cannot find module"
**Solution:** Run `npm install` and restart Metro bundler

### Problem: Fonts not loading
**Solution:** 
```bash
npx expo install expo-font @expo-google-fonts/poppins
```
Clear cache: `npx expo start -c`

### Problem: Firebase auth not working
**Solution:** 
1. Check Firebase config in `firebase.ts`
2. Enable Email/Password auth in Firebase Console
3. Check internet connection

### Problem: SQLite database errors
**Solution:**
```bash
npx expo install expo-sqlite
```
Clear app data and restart

### Problem: Navigation not working
**Solution:**
```bash
npx expo install expo-router
```
Check `app.json` has `"expo-router"` in plugins

### Problem: Metro bundler cache issues
**Solution:**
```bash
npx expo start -c
# or
rm -rf node_modules
npm install
npx expo start
```

## 📝 Development Commands

```bash
# Start development server
npx expo start

# Start with cache cleared
npx expo start -c

# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Run TypeScript type checking
npx tsc --noEmit

# Preview production build
npx expo export
```

## 🎨 Theme Colors

```typescript
const COLORS = {
  primary: '#0A1929',      // Deep Navy Background
  surface: '#172B4D',      // Input fields
  card: '#1E3A5F',         // Cards
  accent: '#3B82F6',       // Electric Blue
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
};
```

## 📚 Key Files to Understand

1. **app/_layout.tsx** - Auth gatekeeper & font loading
2. **src/context/AuthContext.tsx** - Global auth state
3. **src/services/sqlite/db.ts** - Database initialization
4. **src/constants/theme.ts** - Design system colors & fonts
5. **app/(tabs)/_layout.tsx** - Bottom tab configuration

## 🚀 Deployment

### Prepare for Production:

1. **Update Firebase config** with production credentials
2. **Test all features** thoroughly
3. **Build app:**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```
4. **Submit to stores:**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## ✅ Checklist Before Running

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Firebase project created
- [ ] Firebase config updated in `src/config/firebase.ts`
- [ ] Email/Password auth enabled in Firebase
- [ ] Expo Go app installed on phone (for testing)

## 🎉 Ready to Run!

```bash
npx expo start
```

Scan QR code with Expo Go app (Android) or Camera app (iOS) to open the app on your phone.

**Happy Coding! 🎊**

---

## 📞 Need Help?

- Check Firebase Console for auth errors
- Check Metro bundler terminal for build errors
- Clear cache if seeing stale data: `npx expo start -c`
- Restart Expo Go app on phone
- Check network connection for Firebase calls
