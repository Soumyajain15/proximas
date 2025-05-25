
"use client"; // This layout now needs to be a client component for auth checks

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-foreground font-semibold">Loading Your CareerCompass...</p>
        <p className="text-sm text-muted-foreground">Please wait while we prepare your dashboard.</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the useEffect redirect,
    // but as a fallback, prevent rendering the layout.
    // You could also show a "Redirecting to login..." message here.
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-foreground font-semibold">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar /> {/* AppSidebar will have logout button */}
      <SidebarInset className="bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:hidden">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <PanelLeft className="h-6 w-6" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </SidebarTrigger>
            <h1 className="text-xl font-semibold text-primary">CareerCompass AI</h1>
          </header>
          <ScrollArea className="h-[calc(100vh-theme(spacing.14))] lg:h-screen">
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
