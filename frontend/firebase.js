    
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tajathela.firebaseapp.com",
  projectId: "tajathela",
  storageBucket: "tajathela.firebasestorage.app",
  messagingSenderId: "584298245129",
  appId: "1:584298245129:web:fb481a558a8a36e59c5cd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app,auth}