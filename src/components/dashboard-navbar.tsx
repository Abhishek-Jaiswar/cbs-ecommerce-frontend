"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Sparkles,
  User,
  CreditCard,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";

interface DashboardNavbarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function DashboardNavbar({ user, breadcrumbs }: DashboardNavbarProps) {
  const pathname = usePathname();

  const resolvedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return breadcrumbs;
    }

    const segments = pathname.split("/").filter(Boolean);
    // Ignore the first segment if it is "dashboard" (which is represented by the root link)
    const activeSegments = segments[0] === "dashboard" ? segments.slice(1) : segments;

    return activeSegments.map((segment, index) => {
      const fullSegments = segments[0] === "dashboard" 
        ? ["dashboard", ...activeSegments.slice(0, index + 1)]
        : activeSegments.slice(0, index + 1);

      const href = "/" + fullSegments.join("/");
      
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { label, href };
    });
  }, [pathname, breadcrumbs]);
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur-md transition-all duration-300">
      {/* Left section: Sidebar control & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 h-9 w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors" />
        <Separator
          orientation="vertical"
          className="h-4 w-[1px] bg-border/80 mx-1"
        />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            {resolvedBreadcrumbs.length > 0 ? (
              <>
                <BreadcrumbSeparator className="opacity-70" />
                {resolvedBreadcrumbs.map((crumb, idx) => {
                  const isLast = idx === resolvedBreadcrumbs.length - 1;
                  return (
                    <React.Fragment key={idx}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={crumb.href || "#"}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="opacity-70" />}
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <>
                <BreadcrumbSeparator className="opacity-70" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-foreground">
                    Overview
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right section: Search, Actions, Notifications & User Dropdown */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden md:flex w-64 items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground opacity-70" />
          <Input
            type="search"
            placeholder="Search dashboard..."
            className="h-9 w-full bg-muted/40 pl-9 pr-8 text-sm placeholder:text-muted-foreground/70 focus-visible:bg-background transition-colors rounded-lg border-border/60 focus-visible:ring-1 focus-visible:ring-ring"
          />
          <kbd className="pointer-events-none absolute right-2.5 hidden h-5 select-none items-center gap-1 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-90 sm:flex">
            <span className="text-[8px]">⌘</span>K
          </kbd>
        </div>

        {/* Notifications Icon with active badge dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl overflow-hidden shadow-lg border-border/40">
            <DropdownMenuLabel className="px-4 py-3 bg-muted/20 border-b border-border/30 font-medium">
              Notifications
            </DropdownMenuLabel>
            <div className="max-h-[300px] overflow-y-auto divide-y divide-border/30">
              <div className="flex flex-col gap-1 p-4 hover:bg-accent/40 cursor-pointer transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm">System Update Success</span>
                  <span className="text-[10px] text-muted-foreground">2m ago</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Products catalog synchronization completed successfully.
                </p>
              </div>
              <div className="flex flex-col gap-1 p-4 hover:bg-accent/40 cursor-pointer transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm">New Admin Added</span>
                  <span className="text-[10px] text-muted-foreground">1h ago</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A new administrator profile has been configured.
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="m-0" />
            <Button variant="ghost" className="w-full rounded-none h-11 text-xs text-muted-foreground hover:text-foreground">
              Clear all notifications
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-border/40 p-0 hover:bg-transparent">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-semibold">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl p-1.5 shadow-lg border-border/40" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg py-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <span>Upgrade to Pro</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg py-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg py-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Billing & Subscription</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg py-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg py-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
