
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
  isFirebaseReady: boolean; 
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
      if (typeof window !== 'undefined') {
         console.warn(
           "AuthProvider: Firebase Auth instance is not available. This typically means Firebase app initialization failed. " +
           "Please check previous console messages for details on Firebase configuration issues (likely in your .env file - ensure it's correct and you've restarted the server). " +
           "Authentication will not work."
         );
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
      console.error("AuthContext: Error in onAuthStateChanged listener:", error);
      toast({ title: "Auth Listener Error", description: "Could not listen to authentication changes.", variant: "destructive"});
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    if (!firebaseAuthInstance) {
      toast({ title: "System Error", description: "Authentication system is not ready. Please check Firebase configuration.", variant: "destructive" });
      throw new Error("Firebase Auth is not initialized.");
    }
    const userCredential = await signInWithEmailAndPassword(firebaseAuthInstance, email, pass);
    return userCredential.user;
  };

  const signup = async (email: string, pass: string): Promise<User | null> => {
     if (!firebaseAuthInstance) {
      toast({ title: "System Error", description: "Authentication system is not ready. Please check Firebase configuration.", variant: "destructive" });
      throw new Error("Firebase Auth is not initialized.");
    }
    const userCredential = await createUserWithEmailAndPassword(firebaseAuthInstance, email, pass);
    return userCredential.user;
  };

  const logout = async () => {
     if (!firebaseAuthInstance) {
       toast({ title: "System Error", description: "Authentication system is not ready. Please check Firebase configuration.", variant: "destructive" });
      throw new Error("Firebase Auth is not initialized.");
    }
    await signOut(firebaseAuthInstance);
    setUser(null);
  };
  
  const sendPasswordReset = async (email: string) => {
    if (!firebaseAuthInstance) {
      toast({ title: "System Error", description: "Authentication system is not ready. Please check Firebase configuration.", variant: "destructive" });
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
