import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Space AI — reuses the same Firebase project as ViewTube
const firebaseConfig = {
  apiKey: "AIzaSyCxmZkgMv7Ia7o2q6XtAD_FVOIl6smU_2c",
  authDomain: "viewtube-e58e6.firebaseapp.com",
  projectId: "viewtube-e58e6",
  storageBucket: "viewtube-e58e6.firebasestorage.app",
  messagingSenderId: "690793237049",
  appId: "1:690793237049:web:d8d0bf8b136edf61a65be8",
};

// Prevents "Firebase app already initialized" errors on hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
