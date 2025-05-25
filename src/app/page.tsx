
"use client"; // Make landing page a client component to use useAuth

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Compass, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context"; // Import useAuth
import { useEffect, useState } from "react"; // Import useEffect and useState

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [getStartedLink, setGetStartedLink] = useState("/login"); // Default to login

  useEffect(() => {
    if (!loading) {
      if (user) {
        setGetStartedLink("/dashboard");
      } else {
        setGetStartedLink("/login");
      }
    }
  }, [user, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6 text-center selection:bg-primary/20 selection:text-primary">
      <div className="mb-8">
        <Compass className="h-24 w-24 text-primary animate-pulse" />
      </div>
      <h1 className="text-5xl font-bold text-primary mb-6">
        Welcome to CareerCompass AI
      </h1>
      <p className="text-xl text-foreground mb-10 max-w-2xl">
        Your personal AI-driven career coach for professional success. Navigate your career path with clarity and confidence.
      </p>
      
      {loading ? (
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg" disabled>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading...
        </Button>
      ) : (
        <Link href={getStartedLink}>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transition-shadow duration-300">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      )}

      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CareerCompass AI. All rights reserved.
      </footer>
    </div>
  );
}
