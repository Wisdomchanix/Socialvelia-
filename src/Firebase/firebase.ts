// src/Firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Add Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDUgmckVvJvrRDLfGkb6sHFQnjfxdz0Sz4",
  authDomain: "socialvelia-67786.firebaseapp.com",
  projectId: "socialvelia-67786",
  storageBucket: "socialvelia-67786.firebasestorage.app",
  messagingSenderId: "433719908113",
  appId: "1:433719908113:web:c3cc5b07062b7e01435eb0",
  measurementId: "G-8JXKGJGN8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ✅ Firestore Database
export const db = getFirestore(app);

export default app;
