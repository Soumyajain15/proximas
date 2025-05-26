
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  type User, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { authInstance as firebaseAuthInstance } from "@/lib/firebase"; 
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFirebaseReady: boolean; // Added to indicate if Firebase itself initialized
  login: (email: string, pass: string) => Promise<User | null>;
  signup: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!firebaseAuthInstance) {
      // This console.error is already handled in firebase.ts if config is bad
      // It's good to also check here to prevent further operations
      if (typeof window !== 'undefined') {
         console.error("Firebase Auth instance is not available in AuthProvider. Authentication will not work. Please check Firebase configuration in .env file and restart your server.");
      }
      setIsLoading(false); 
      setIsFirebaseReady(false);
      return;
    }

    setIsFirebaseReady(true); // Firebase auth instance is available
    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    }, (error) => {
      console.error("Error in onAuthStateChanged listener:", error);
      toast({ title: "Auth Listener Error", description: "Could not listen to authentication changes.", variant: "destructive"});
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    if (!firebaseAuthInstance) {
      toast({ title: "System Error", description: "Authentication system is not ready. Please contact support.", variant: "destructive" });
      throw new Error("Firebase Auth is not initialized.");
    }
    const userCredential = await signInWithEmailAndPassword(firebaseAuthInstance, email, pass);
    return userCredential.user;
  };

  const signup = async (email: string, pass: string): Promise<User | null> => {
     if (!firebaseAuthInstance) {
      toast({ title: "System Error", description: "Authentication system is not ready. Please contact support.", variant: "destructive" });
      throw new Error("Firebase Auth is not initialized.");
    }
    const userCredential = await createUserWithEmailAndPassword(firebaseAuthInstance, email, pass);
    return userCredential.user;
  };

  const logout = async () => {
     if (!firebaseAuthInstance) {
       toast({ title: "System Error", description: "Authentication system is not ready. Please contact support.", variant: "destructive" });
      throw new Error("Firebase Auth is not initialized.");
    }
    await signOut(firebaseAuthInstance);
    setUser(null);
  };
  
  const sendPasswordReset = async (email: string) => {
    if (!firebaseAuthInstance) {
      toast({ title: "System Error", description: "Authentication system is not ready. Please contact support.", variant: "destructive" });
      throw new Error("Firebase Auth is not initialized.");
    }
    await sendPasswordResetEmail(firebaseAuthInstance, email);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, sendPasswordReset, isFirebaseReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
