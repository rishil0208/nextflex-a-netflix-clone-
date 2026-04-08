import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForBuildOnlyPleaseDoNotUse",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "localhost",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy",
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
