
"use client"; 

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
// Removed useAuth, useRouter, useEffect, Loader2

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Removed all auth checking logic, loading states, and redirection

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar /> {/* AppSidebar will no longer have logout button */}
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
