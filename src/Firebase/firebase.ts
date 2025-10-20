// src/Firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUgmckVvJvrRDLfGkb6sHFQnjfxdz0Sz4",
  authDomain: "socialvelia-67786.firebaseapp.com",
  projectId: "socialvelia-67786",
  storageBucket: "socialvelia-67786.firebasestorage.app",
  messagingSenderId: "433719908113",
  appId: "1:433719908113:web:c3cc5b07062b7e01435eb0",
  measurementId: "G-8JXKGJGN8B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
export const googleProvider = new GoogleAuthProvider();