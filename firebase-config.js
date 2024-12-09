// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your Firebase config (replace these with your own Firebase credentials)
const firebaseConfig = {
    apiKey: "AIzaSyB-39CRp3xoZC5HuK5Urh2wSY_pNjuqDjI",
    authDomain: "wordracer-e3cbd.firebaseapp.com",
    projectId: "wordracer-e3cbd",
    storageBucket: "wordracer-e3cbd.firebasestorage.app",
    messagingSenderId: "167576538467",
    appId: "1:167576538467:web:69e1eda5d24ef5f9215756",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Authentication instance

// Google Auth provider
const provider = new GoogleAuthProvider();

// Login with Google
const loginWithGoogle = () => {
    return signInWithPopup(auth, provider);
};

// Logout
const logout = () => {
    return signOut(auth);
};

export { auth, loginWithGoogle, logout };
