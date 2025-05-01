import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyCukNqldtYcbCxX1EKNC73EBFMH7_S-OyQ",
  authDomain: "dischan-6db88.firebaseapp.com",
  databaseURL: "https://dischan-6db88-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dischan-6db88",
  storageBucket: "dischan-6db88.firebasestorage.app",
  messagingSenderId: "595533552403",
  appId: "1:595533552403:web:ac97570dbdc9a99a27d8e6",
  measurementId: "G-R0M5EF6ZB2"
};

// Firebaseの初期化（重複を防ぐ）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const database = getDatabase(app); 