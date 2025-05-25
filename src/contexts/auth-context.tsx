
"use client";

import type { User as FirebaseUser, AuthError } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth as firebaseAuthInstance } from "@/lib/firebase"; // Renamed import
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  type UserCredential
} from "firebase/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  signup: (email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!firebaseAuthInstance) {
      console.error("Firebase Auth instance is not available in AuthProvider. Authentication will not work. Please check Firebase configuration.");
      setLoading(false); // Stop loading, user will remain null
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      setUser(null); // Clear user state locally
      router.push('/login'); // Redirect to login
      return Promise.resolve(); // Or reject, depending on desired behavior
    }
    try {
      await firebaseSignOut(firebaseAuthInstance);
      setUser(null); // Ensure user state is cleared
    } catch (error) {
      console.error("Error during Firebase sign out:", error);
      // Still clear user state locally and redirect
      setUser(null);
    } finally {
      router.push('/login'); // Redirect to login after logout attempt
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
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
