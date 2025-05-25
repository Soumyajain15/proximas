
"use client";

import type { User as FirebaseUser, AuthError } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth as firebaseAuthInstanceFromLib } from "@/lib/firebase"; // Renamed import
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  type UserCredential,
  type Auth as FirebaseAuth // Import Auth type
} from "firebase/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  signup: (email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  firebaseAuthInstance: FirebaseAuth | undefined; // Expose the auth instance
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Use the imported auth instance directly
  const firebaseAuthInstance = firebaseAuthInstanceFromLib;
  const router = useRouter();

  useEffect(() => {
    if (!firebaseAuthInstance) {
      console.error("Firebase Auth instance is not available in AuthProvider. Authentication will not work. Please check Firebase configuration in .env file and restart your server.");
      setLoading(false); 
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [firebaseAuthInstance]); // Add firebaseAuthInstance to dependency array

  const login = (email: string, pass: string): Promise<UserCredential> => {
    if (!firebaseAuthInstance) {
      return Promise.reject(new Error("Firebase Auth is not initialized. Cannot log in."));
    }
    return signInWithEmailAndPassword(firebaseAuthInstance, email, pass);
  };

  const signup = (email: string, pass: string): Promise<UserCredential> => {
    if (!firebaseAuthInstance) {
      return Promise.reject(new Error("Firebase Auth is not initialized. Cannot sign up."));
    }
    return createUserWithEmailAndPassword(firebaseAuthInstance, email, pass);
  };

  const logout = async (): Promise<void> => {
    if (!firebaseAuthInstance) {
      console.warn("Firebase Auth is not initialized. Logging out locally.");
      setUser(null); 
      router.push('/login'); 
      return Promise.resolve();
    }
    try {
      await firebaseSignOut(firebaseAuthInstance);
      setUser(null); 
    } catch (error) {
      console.error("Error during Firebase sign out:", error);
      setUser(null); // Ensure user is cleared even if signout fails remotely
    } finally {
      router.push('/login'); 
    }
  };

  const sendPasswordReset = (email: string): Promise<void> => {
    if (!firebaseAuthInstance) {
      return Promise.reject(new Error("Firebase Auth is not initialized. Cannot send password reset email."));
    }
    return firebaseSendPasswordResetEmail(firebaseAuthInstance, email);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    sendPasswordReset,
    firebaseAuthInstance, // Provide the instance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
