// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAX7x1XWIYcMHFR4WJXXvGsZ18u3xHLVqo",
  authDomain: "todoflow-45906.firebaseapp.com",
  projectId: "todoflow-45906",
  storageBucket: "todoflow-45906.appspot.com",
  messagingSenderId: "113670779831",
  appId: "1:113670779831:web:36238654a4f7213729ee32",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
