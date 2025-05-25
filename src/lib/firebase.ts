
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// IMPORTANT: Replace these with your actual Firebase configuration values
// You should store these in a .env.local file and ensure it's in .gitignore

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Log a warning if the API key seems to be missing or is a placeholder
if (typeof window !== 'undefined') { // Only run this check on the client-side
  if (!apiKey) {
    console.warn(
      "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is NOT DEFINED. " +
      "Please ensure it is set in your .env or .env.local file (prefixed with NEXT_PUBLIC_), " +
      "that the values are correct, and that you have RESTARTED your development server."
    );
  } else if (apiKey === "YOUR_FIREBASE_API_KEY" || apiKey.includes("YOUR_ACTUAL_API_KEY") || apiKey.startsWith("YOUR_")) {
     console.warn(
      "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) appears to be a PLACEHOLDER string. " +
      "Please replace it in your .env or .env.local file with your actual Firebase API Key. " +
      "Ensure all other NEXT_PUBLIC_FIREBASE_ variables are also correctly set with real values. " +
      "Then, RESTART your development server."
    );
  }
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

let app: FirebaseApp;
if (!getApps().length) {
  // Check if essential config values are present (especially on client-side)
  // Firebase itself will perform more robust validation.
  if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
  } else {
    if (typeof window !== 'undefined') {
      console.error(
        "Firebase configuration is incomplete (apiKey, authDomain, or projectId might be missing or still placeholders). " +
        "Firebase app NOT initialized on the client-side. " +
        "Please check your .env or .env.local file and ensure all NEXT_PUBLIC_FIREBASE_ variables are correctly set and RESTART your server."
      );
    }
    // To prevent runtime errors if 'app' is used before proper init,
    // you might assign a dummy or throw, but Firebase auth calls will fail anyway.
    // Assigning a dummy object to satisfy TypeScript for now.
    // @ts-ignore
    app = undefined;
  }
} else {
  app = getApps()[0];
}

// @ts-ignore - app might be undefined if config was incomplete client-side.
const auth: Auth = app ? getAuth(app) : ({} as Auth); // Provide a type assertion to avoid compile error if app is undefined.

export { app, auth };
