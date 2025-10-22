// Importar Firebase desde CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDypM61Gz-Ic5eGc4LGdKhR1mmGvjpeQ2M",
  authDomain: "urban-cats.firebaseapp.com",
  projectId: "urban-cats",
  storageBucket: "urban-cats.firebasestorage.app",
  messagingSenderId: "568836944315",
  appId: "1:568836944315:web:7170686f0d6a60dc47a49e",
  measurementId: "G-LQWK3L4NJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

console.log('✅ Firebase initialized successfully');