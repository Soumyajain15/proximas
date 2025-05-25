
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
      console.warn(
        `Firebase config value ${name} (e.g., ${name.toUpperCase()}) is NOT DEFINED. ` +
        "Please ensure it is set in your .env or .env.local file (prefixed with NEXT_PUBLIC_), " +
        "that the values are correct, and that you have RESTARTED your development server."
      );
    }
    return true;
  }
  if (value.startsWith("YOUR_") || value.includes("YOUR_ACTUAL_") || value.includes("XXXXX")) {
    if (typeof window !== 'undefined') {
      console.warn(
        `Firebase config value ${name} (e.g., ${name.toUpperCase()}) appears to be a PLACEHOLDER string: "${value}". ` +
        "Please replace it in your .env or .env.local file with your actual Firebase value. " +
        "Ensure all other NEXT_PUBLIC_FIREBASE_ variables are also correctly set with real values. " +
        "Then, RESTART your development server."
      );
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
  }
} else {
  app = getApps()[0];
  // Potentially, re-check config validity if app was already initialized (e.g. HMR)
  // For simplicity, we assume if getApps().length > 0, it was initialized correctly before.
  // However, if config changes via HMR (not typical for .env files), this could be an edge case.
  if (essentialConfigValid) {
     authInstance = getAuth(app);
  } else {
     if (typeof window !== 'undefined') {
        console.warn("Firebase was previously initialized, but current config appears invalid. Auth may not work correctly.");
     }
     // authInstance might be from a previous valid init, or could become problematic.
     // To be safe, if config is now invalid, we might want to clear authInstance
     // authInstance = undefined; // Or handle this state more explicitly
  }
 
}

export { app, authInstance as auth };
