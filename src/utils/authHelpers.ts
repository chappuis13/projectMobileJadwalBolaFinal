// src/utils/authHelpers.ts
// Helper functions untuk Firebase Authentication

import { 
  signOut, 
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { Alert } from 'react-native';

/**
 * Logout user dari aplikasi
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    let message = error.message;
    
    if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address.';
    }
    
    return { success: false, error: message };
  }
};

/**
 * Re-authenticate user (needed before sensitive operations)
 */
export const reauthenticateUser = async (currentPassword: string) => {
  const user = auth.currentUser;
  
  if (!user || !user.email) {
    return { success: false, error: 'No user logged in' };
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Incorrect password' };
  }
};

/**
 * Update user password
 */
export const changePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  
  if (!user) {
    return { success: false, error: 'No user logged in' };
  }

  // Re-authenticate first
  const reauth = await reauthenticateUser(currentPassword);
  if (!reauth.success) {
    return reauth;
  }

  try {
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Update user email
 */
export const changeEmail = async (newEmail: string, currentPassword: string) => {
  const user = auth.currentUser;
  
  if (!user) {
    return { success: false, error: 'No user logged in' };
  }

  // Re-authenticate first
  const reauth = await reauthenticateUser(currentPassword);
  if (!reauth.success) {
    return reauth;
  }

  try {
    await updateEmail(user, newEmail);
    return { success: true };
  } catch (error: any) {
    let message = error.message;
    
    if (error.code === 'auth/email-already-in-use') {
      message = 'This email is already in use.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address.';
    }
    
    return { success: false, error: message };
  }
};

/**
 * Get user display info
 */
export const getUserInfo = (user: User | null) => {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'User',
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    createdAt: user.metadata.creationTime,
    lastSignIn: user.metadata.lastSignInTime,
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  
  if (password.length < 8) {
    return { valid: true, message: 'Password is weak. Consider using 8+ characters' };
  }
  
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  
  if (!hasNumber || !hasLetter) {
    return { valid: true, message: 'Consider using both letters and numbers' };
  }
  
  return { valid: true };
};

/**
 * Format Firebase error messages to user-friendly text
 */
export const formatFirebaseError = (errorCode: string): string => {
  const errors: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/weak-password': 'Password is too weak.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };

  return errors[errorCode] || 'An error occurred. Please try again.';
};

/**
 * Logout with confirmation
 */
export const logoutWithConfirmation = (onConfirm: () => void) => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          const result = await logoutUser();
          if (result.success) {
            onConfirm();
          } else {
            Alert.alert('Error', result.error || 'Failed to logout');
          }
        }
      }
    ]
  );
};
