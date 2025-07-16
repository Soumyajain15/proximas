
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"; 
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Compass,
  LayoutDashboard,
  BriefcaseBusiness,
  MessagesSquare,
  FileText,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Bot, 
  Info,
  Moon,
  Sun,
  ScanSearch, // Added for ATS Checker
  LogOut, // Added for Logout
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context"; // Removed as auth is removed

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/career-path", icon: BriefcaseBusiness, label: "Career Path Guidance" },
  { href: "/interview-simulator", icon: MessagesSquare, label: "Interview Simulator" },
  { href: "/resume-builder", icon: FileText, label: "Resume Builder" },
  { href: "/ats-checker", icon: ScanSearch, label: "ATS Score Checker" }, // Added ATS Score Checker
  { href: "/market-trends", icon: TrendingUp, label: "Market Trends" },
  { href: "/improvement-tracking", icon: BarChart3, label: "Improvement Tracking" },
  { href: "/ai-chatbot", icon: Bot, label: "AI Chatbot" },
  { href: "/faq", icon: HelpCircle, label: "FAQ" },
  { href: "/about", icon: Info, label: "About" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, isMobile } = useSidebar();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // const { logout, user } = useAuth(); // Removed as auth is removed

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // const handleLogout = async () => { // Removed as auth is removed
  //   await logout();
  //   // Optionally, redirect to login page or homepage after logout
  //   // router.push('/login'); 
  // };

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-sidebar-border shadow-lg">
      <SidebarHeader className="p-4 flex items-center gap-2.5">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <Compass className="h-8 w-8 text-sidebar-primary" />
          <span
            className={cn(
              "text-xl font-semibold text-sidebar-foreground whitespace-nowrap transition-opacity duration-200",
              open || isMobile ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            Proxima
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent asChild>
        <ScrollArea className="flex-1">
          <SidebarMenu className="gap-1 p-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                    tooltip={{
                      children: item.label,
                      className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border",
                    }}
                    className={cn(
                      "justify-start",
                       (open || isMobile) ? "" : "justify-center"
                    )}
                  >
                    <a>
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className={cn("transition-opacity duration-200", (open || isMobile) ? "opacity-100" : "opacity-0 w-0")}>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-2">
        {/* {user && ( // Removed as auth is removed
          <Button
            variant="ghost"
            size={(open || isMobile) ? "default" : "icon"}
            onClick={handleLogout}
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              (open || isMobile) ? "justify-start" : "justify-center"
            )}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn("ml-2 transition-opacity duration-200", (open || isMobile) ? "opacity-100" : "opacity-0 w-0")}>
              Logout
            </span>
          </Button>
        )} */}
        {mounted && (
          <Button 
            variant="ghost" 
            size={(open || isMobile) ? "default" : "icon"} 
            onClick={toggleTheme}
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", 
              (open || isMobile) ? "justify-start" : "justify-center"
            )}
            aria-label="Toggle theme"
            title={resolvedTheme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5 shrink-0" />
            ) : (
              <Moon className="h-5 w-5 shrink-0" />
            )}
            <span className={cn("ml-2 transition-opacity duration-200", (open || isMobile) ? "opacity-100" : "opacity-0 w-0")}>
              {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
