
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
  SidebarTrigger,
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
  Github,
  PanelLeft,
  LogOut, // Import LogOut icon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context"; // Import useAuth
import { useToast } from "@/hooks/use-toast";


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/career-path", icon: BriefcaseBusiness, label: "Career Path Guidance" },
  { href: "/interview-simulator", icon: MessagesSquare, label: "Interview Simulator" },
  { href: "/resume-builder", icon: FileText, label: "Resume Builder" },
  { href: "/market-trends", icon: TrendingUp, label: "Market Trends" },
  { href: "/improvement-tracking", icon: BarChart3, label: "Improvement Tracking" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, isMobile, toggleSidebar } = useSidebar();
  const { logout, user } = useAuth(); // Get logout function and user
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      // Router push is handled within logout function in auth-context
    } catch (error) {
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
    }
  };

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
            CareerCompass
          </span>
        </Link>
        {isMobile && (
           <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={toggleSidebar}>
            <PanelLeft className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
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
        {user && ( /* Show logout button only if user is logged in */
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={cn("w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", (open || isMobile) ? "justify-start" : "justify-center")}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn("ml-2 transition-opacity duration-200", (open || isMobile) ? "opacity-100" : "opacity-0 w-0")}>Logout</span>
          </Button>
        )}
        <Button variant="ghost" className={cn("w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", (open || isMobile) ? "justify-start" : "justify-center") } asChild>
          <Link href="https://github.com/Soumyajain15/Carrercompass" target="_blank">
            <Github className="h-5 w-5 shrink-0" />
            <span className={cn("ml-2 transition-opacity duration-200", (open || isMobile) ? "opacity-100" : "opacity-0 w-0")}>View on GitHub</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
