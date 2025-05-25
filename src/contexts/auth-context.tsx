
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  type User, 
  type Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { authInstance as firebaseAuthInstance } from "@/lib/firebase"; // Renamed import
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  signup: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  isFirebaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!firebaseAuthInstance) {
      console.error("Firebase Auth instance is not available in AuthProvider. Authentication will not work. Please check Firebase configuration in .env file and restart your server.");
      setIsLoading(false); 
      setIsFirebaseReady(false);
      return;
    }
    setIsFirebaseReady(true);
    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (currentUser) => {
      setUser(currentUser);
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
    setUser(null); // Explicitly set user to null on logout
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
