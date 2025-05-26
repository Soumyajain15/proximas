
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;

// Check if essential Firebase config values are present and NOT placeholders
const isConfigValid = 
  firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_") &&
  firebaseConfig.authDomain && !firebaseConfig.authDomain.startsWith("YOUR_") &&
  firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("YOUR_");

if (isConfigValid) {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      authInstance = getAuth(app);
      if (typeof window !== 'undefined') {
        // console.log("Firebase app initialized successfully."); // Optional: for debugging
      }
    } catch (error) {
      console.error("Error initializing Firebase app:", error);
      app = undefined;
      authInstance = undefined;
    }
  } else {
    app = getApps()[0];
    authInstance = getAuth(app);
  }
} else {
  app = undefined;
  authInstance = undefined;
  if (typeof window !== 'undefined') { 
    console.error(
      "Firebase configuration is incomplete or uses placeholder values. " +
      "Firebase app NOT initialized. " +
      "Please check your .env or .env.local file and ensure all NEXT_PUBLIC_FIREBASE_ variables are correctly set and RESTART your server."
    );
  }
}

export { app, authInstance };
