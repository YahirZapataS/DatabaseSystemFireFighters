// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2lSesqa4Tl66s8v5tS9ffubU6ahUWkLM",
  authDomain: "departamentocontraincendio.firebaseapp.com",
  projectId: "departamentocontraincendio",
  storageBucket: "departamentocontraincendio.appspot.com",
  messagingSenderId: "692733548359",
  appId: "1:692733548359:web:6d8f36c7d8beab3a0a1e62",
  measurementId: "G-K4C23DMBFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };