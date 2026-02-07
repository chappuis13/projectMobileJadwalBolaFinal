import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { logoutWithConfirmation, getUserInfo } from '../../utils/authHelpers';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const userInfo = getUserInfo(user);

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => router.push('/profile/edit'),
    },
    {
      icon: 'lock-closed-outline',
      title: 'Change Password',
      onPress: () => router.push('/profile/change-password'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: 'heart-outline',
      title: 'Favorite Teams',
      onPress: () => router.push('/favorites'),
    },
    {
      icon: 'analytics-outline',
      title: 'My Predictions',
      onPress: () => router.push('/predictions'),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      onPress: () => console.log('Settings'),
    },
  ];

  const handleLogout = () => {
    logoutWithConfirmation(() => {
      router.replace('/auth/login');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {userInfo?.photoURL ? (
              <Image source={{ uri: userInfo.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={COLORS.textSecondary} />
              </View>
            )}
          </View>
          
          <Text style={styles.userName}>{userInfo?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{userInfo?.email}</Text>
          
          {!userInfo?.emailVerified && (
            <View style={styles.verifyBadge}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.warning} />
              <Text style={styles.verifyText}>Email not verified</Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={22} color={COLORS.accent} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Sign In</Text>
            <Text style={styles.infoValue}>
              {userInfo?.lastSignIn ? new Date(userInfo.lastSignIn).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: SIZES.padding,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  verifyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
  },
  verifyText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.warning,
    marginLeft: 6,
  },
  menuContainer: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  infoContainer: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 16,
  },
  logoutText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.danger,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
