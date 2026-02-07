# 🚀 Expo Router Navigation Setup

## 📁 Struktur Folder

```
app/
├── _layout.tsx              # Root layout dengan AuthProvider & Font loading
├── index.tsx                # Initial redirector
├── auth/
│   ├── _layout.tsx          # Auth group layout
│   ├── login.tsx            # Login screen
│   ├── register.tsx         # Register screen
│   └── forgot-password.tsx  # Forgot password screen
├── (tabs)/                  # Tab group (parentheses = group route)
│   ├── _layout.tsx          # Bottom tab navigation
│   ├── home.tsx             # Home screen
│   ├── favorites.tsx        # Favorites screen
│   ├── predictions.tsx      # Predictions list screen
│   └── profile.tsx          # Profile screen
└── predictions/
    ├── _layout.tsx          # Predictions stack layout
    └── add.tsx              # Add prediction screen
```

## 🔐 Gatekeeper Logic

File `app/_layout.tsx` bertindak sebagai "Gatekeeper" yang:

1. **Cek Auth State** - Monitor user login/logout via AuthContext
2. **Auto-redirect** - Lempar user ke halaman yang sesuai:
   - ❌ Not logged in + not in auth pages → Redirect ke Login
   - ✅ Logged in + in auth pages → Redirect ke Home
3. **Loading Screen** - Show spinner saat checking auth state
4. **Font Loading** - Load Poppins fonts globally
5. **DB Initialization** - Initialize SQLite database

## 🎯 Navigation Flow

```
App Start
    ↓
app/_layout.tsx (Load fonts + Init DB)
    ↓
<AuthProvider> wraps everything
    ↓
<MainLayout> checks auth state
    ↓
    ├─→ User NOT logged in
    │       ↓
    │   Redirect to /auth/login
    │       ↓
    │   User can navigate to:
    │   - /auth/register
    │   - /auth/forgot-password
    │       ↓
    │   After login success
    │       ↓
    └─→ User IS logged in
            ↓
        Redirect to /(tabs)/home
            ↓
        Bottom tabs available:
        - Home
        - Favorites
        - Predictions
        - Profile
            ↓
        Can navigate to:
        - /predictions/add
        - Other screens
            ↓
        Logout button in Profile
            ↓
        Back to /auth/login
```

## 📱 Bottom Tab Navigation

4 tabs tersedia setelah login:

1. **Home** 🏠 - Match schedule & live scores
2. **Favorites** ❤️ - Saved favorite teams
3. **Predictions** 📊 - User's match predictions
4. **Profile** 👤 - User profile & settings

## 🎨 Tab Bar Styling

- Background: Deep Navy (`COLORS.primary`)
- Active tab: Electric Blue (`COLORS.accent`)
- Inactive tab: Slate Gray (`COLORS.textSecondary`)
- Height: 60px
- Border top: Subtle border color

## 🔄 Protected Routes

Semua routes dalam `(tabs)` group otomatis protected karena:
- MainLayout akan redirect ke login jika tidak ada user
- User harus login dulu sebelum bisa akses tabs

## 📝 Screen Exports

Semua screen di-export dari `src/screens/`:

```typescript
// Example: app/(tabs)/home.tsx
import HomeScreen from '../../src/screens/home/HomeScreen';
export default HomeScreen;
```

Benefit:
- ✅ Clean separation of concerns
- ✅ Reusable screen components
- ✅ Easy testing
- ✅ Consistent file structure

## 🚀 Usage Examples

### Navigate to another screen

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to add prediction
router.push('/predictions/add');

// Navigate with params
router.push({
  pathname: '/match-detail',
  params: { matchId: '123' }
});

// Replace (can't go back)
router.replace('/(tabs)/home');

// Go back
router.back();
```

### Get route params

```typescript
import { useLocalSearchParams } from 'expo-router';

const params = useLocalSearchParams();
const matchId = params.matchId as string;
```

### Navigate between tabs

```typescript
// Just use router.push with tab name
router.push('/(tabs)/favorites');
router.push('/(tabs)/profile');
```

## 🎯 Key Features

✅ **Auto-redirect** based on auth state  
✅ **Protected routes** - No manual checks needed  
✅ **Loading states** - Smooth UX during auth checks  
✅ **Font loading** - Global Poppins fonts  
✅ **Database init** - SQLite ready on app start  
✅ **Bottom tabs** - Professional navigation  
✅ **Type-safe routing** - TypeScript support  
✅ **Deep linking** ready - URLs work out of the box  

## 🔧 Installation

Make sure these packages are installed:

```bash
# Core navigation
npx expo install expo-router

# Safe area handling
npx expo install react-native-safe-area-context

# Fonts
npx expo install expo-font @expo-google-fonts/poppins

# Icons
npx expo install @expo/vector-icons

# Firebase
npx expo install firebase

# SQLite
npx expo install expo-sqlite
```

## 📊 Route Overview

### Public Routes (No auth required)
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`

### Protected Routes (Auth required)
- `/(tabs)/home`
- `/(tabs)/favorites`
- `/(tabs)/predictions`
- `/(tabs)/profile`
- `/predictions/add`

## 🐛 Troubleshooting

### "Cannot find module" errors
- Make sure all screen files exist in `src/screens/`
- Check import paths are correct

### Infinite redirect loop
- Check AuthContext is not causing re-renders
- Verify conditional logic in MainLayout

### Tabs not showing
- Ensure you're navigating to `/(tabs)/home` not just `/home`
- Check tab bar style is not hidden

### Fonts not loading
- Verify font names match expo-google-fonts package
- Check fonts are loaded before rendering

## 🎉 Result

Navigation system yang:
- Professional dengan bottom tabs
- Secure dengan auth protection
- Smooth dengan loading states
- Type-safe dengan TypeScript
- Modern dengan Expo Router

**Ready untuk production!** 🚀
