import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebaseの設定
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Firebaseの初期化（重複を防ぐ）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const database = getDatabase(app); 