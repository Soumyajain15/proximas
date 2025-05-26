
"use client";

// This file is kept to prevent build errors from potential lingering imports,
// but authentication has been removed from the application.
// It no longer provides any functional authentication context.

import React, { createContext, useContext, type ReactNode } from "react";

interface AuthContextType {
  user: null; // Always null as auth is removed
  isLoading: boolean; // Always false
  isFirebaseReady: boolean; // Always false
  login?: () => Promise<null>; // Non-functional stubs
  signup?: () => Promise<null>;
  logout?: () => Promise<void>;
  sendPasswordReset?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    user: null,
    isLoading: false,
    isFirebaseReady: false,
    // Provide stub functions to avoid errors if useAuth is somehow still called
    login: async () => { console.warn("Login functionality has been removed."); return null; },
    signup: async () => { console.warn("Signup functionality has been removed."); return null; },
    logout: async () => { console.warn("Logout functionality has been removed."); },
    sendPasswordReset: async () => { console.warn("Password reset functionality has been removed."); },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This should ideally not be reached if AuthProvider is removed from layout
    console.warn("useAuth called outside of an AuthProvider that has been removed/stubbed.");
    // Return a default stubbed value to prevent runtime errors
    return { 
      user: null, 
      isLoading: false, 
      isFirebaseReady: false,
      login: async () => null,
      signup: async () => null,
      logout: async () => {},
      sendPasswordReset: async () => {},
    };
  }
  return context;
}
