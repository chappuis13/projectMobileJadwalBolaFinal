// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA59Cmf9T4n32FUUnpsyT7lMsWzIzt_FE8",
  authDomain: "jadwalbola-final.firebaseapp.com",
  projectId: "jadwalbola-final",
  storageBucket: "jadwalbola-final.firebasestorage.app",
  messagingSenderId: "834702994998",
  appId: "1:1:834702994998:web:37552618fd35d3e92db297"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);