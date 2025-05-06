// firebase/config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbhfWGcp5l_jqQGtx9XUEq0vqTS5BMuhw",
  authDomain: "app-rotas-da-vida.firebaseapp.com",
  projectId: "app-rotas-da-vida",
  storageBucket: "app-rotas-da-vida.appspot.com",
  messagingSenderId: "682999662465",
  appId: "1:682999662465:web:9bf1a950070ae9455a8a80",
  measurementId: "G-BQ7SSBWC1F"
};

// ⚠️ Previne reinicializações no hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app); // 🔥 CERTO!
const db = getFirestore(app);

export { auth, db };
