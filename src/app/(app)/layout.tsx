
"use client"; 

// Authentication logic has been removed. This layout no longer performs auth checks.
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react"; // Loader2 and useAuth removed
// import { useAuth } from "@/contexts/auth-context"; // Removed

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { user, isLoading, isFirebaseReady } = useAuth(); // Removed
  // const router = useRouter(); // Removed

  // useEffect(() => { // Removed auth check
  //   if (!isLoading && isFirebaseReady && !user) {
  //     router.push("/login");
  //   }
  // }, [user, isLoading, isFirebaseReady, router]);

  // if (isLoading || !isFirebaseReady) { // Removed loading state related to auth
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center bg-background">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary" />
  //       <p className="ml-4 text-muted-foreground">Loading application...</p>
  //     </div>
  //   );
  // }

  // if (!user && isFirebaseReady) { // Removed
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center bg-background">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary" />
  //       <p className="ml-4 text-muted-foreground">Redirecting...</p>
  //     </div>
  //   );
  // }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:hidden">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <PanelLeft className="h-6 w-6" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </SidebarTrigger>
            <h1 className="text-xl font-semibold text-primary">Proxima AI</h1>
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
