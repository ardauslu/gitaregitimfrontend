import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDyCsA_JOcy-3pz4gAO1-p59PxENn3woU0",
    authDomain: "gitaregitim-3c520.firebaseapp.com",
    projectId: "gitaregitim-3c520",
    storageBucket: "gitaregitim-3c520.firebasestorage.app",
    messagingSenderId: "378173653440",
    appId: "1:378173653440:web:7d142e3c9b3f1918bfc825",
    measurementId: "G-NBLBJXS9DF"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);