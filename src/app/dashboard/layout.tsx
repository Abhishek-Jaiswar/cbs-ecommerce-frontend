"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Lock } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user || user.role !== "ADMIN") {
        router.push("/login");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-stone-50">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">Securing session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "ADMIN") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-stone-50">
        <div className="text-center flex flex-col items-center gap-3 max-w-xs px-4">
          <Lock className="h-10 w-10 text-amber-500 mb-2" />
          <h2 className="text-lg font-bold text-stone-800">Access Restricted</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            This dashboard is only accessible to authorized administrator accounts. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  const userProfile = {
    name: user.name,
    email: user.email,
    avatar: "",
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNavbar user={userProfile} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
