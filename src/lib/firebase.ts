
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// IMPORTANT: Replace these with your actual Firebase configuration values
// You should store these in a .env.local file (or .env) and ensure it's in .gitignore

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

let app: FirebaseApp | undefined = undefined;
let authInstance: Auth | undefined = undefined;

const isPlaceholder = (value: string | undefined, name: string) => {
  if (!value) {
    if (typeof window !== 'undefined') {
      // This specific warning is deferred to the essentialConfigValid check block
    }
    return true;
  }
  if (value.startsWith("YOUR_") || value.includes("YOUR_ACTUAL_") || value.includes("XXXXX") || value.trim() === "") {
    if (typeof window !== 'undefined') {
      // This specific warning is deferred to the essentialConfigValid check block
    }
    return true;
  }
  return false;
};

const essentialConfigValid = 
  !isPlaceholder(firebaseConfig.apiKey, "apiKey") &&
  !isPlaceholder(firebaseConfig.authDomain, "authDomain") &&
  !isPlaceholder(firebaseConfig.projectId, "projectId");

if (!getApps().length) {
  if (essentialConfigValid) {
    try {
      app = initializeApp(firebaseConfig);
      authInstance = getAuth(app);
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      // app and authInstance remain undefined
    }
  } else {
    if (typeof window !== 'undefined') { // Only log this specific error client-side if essential config was bad
      console.error(
        "Firebase configuration is incomplete or uses placeholder values. " +
        "Firebase app NOT initialized. " +
        "Please check your .env or .env.local file and ensure all NEXT_PUBLIC_FIREBASE_ variables are correctly set and RESTART your server."
      );
    }
    // app and authInstance remain undefined
  }
} else {
  app = getApps()[0];
  if (essentialConfigValid) {
     authInstance = getAuth(app);
  } else {
     if (typeof window !== 'undefined') {
        console.warn(
          "Firebase was previously initialized, but current config appears invalid. Auth may not work correctly. " +
          "Forcing authInstance to undefined. Please check .env variables and RESTART your server."
        );
     }
     authInstance = undefined; // Explicitly set to undefined if config is now invalid
  }
 
}

export { app, authInstance as auth };
