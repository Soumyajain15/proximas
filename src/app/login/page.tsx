
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/'); // Redirect to homepage
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
