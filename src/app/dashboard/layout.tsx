import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNavbar user={user} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
