"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Mail,
  User,
  ShieldCheck,
  Calendar,
  Lock,
  Smartphone,
} from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex-1 p-6 md:p-10 space-y-6 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c29958] border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50">
          Administrator Profile
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Manage your personal administration credentials and permission profiles.
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Card Summary */}
        <div className="space-y-6">
          <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-stone-900 to-[#c29958] dark:from-stone-950 dark:to-[#b0884b] relative" />
            <CardContent className="pt-0 pb-6 text-center relative px-6">
              <div className="flex justify-center -mt-12 mb-4">
                <Avatar className="h-24 w-24 rounded-full border-4 border-white dark:border-stone-950 shadow-md">
                  <AvatarFallback className="rounded-full bg-stone-100 dark:bg-stone-900 text-stone-850 dark:text-stone-200 text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-stone-950 dark:text-stone-50 flex items-center justify-center gap-1.5">
                  {user.name}
                </h2>
                <p className="text-xs text-stone-400 font-medium">{user.email}</p>
                <div className="flex justify-center pt-2">
                  <Badge className="bg-[#c29958] hover:bg-[#b0884b] text-white rounded-md flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-none">
                    <Shield size={12} />
                    {user.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Security Status Card */}
          <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={16} />
                Security Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-4">
              <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-900">
                <span className="text-stone-400">Account Type</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">System Admin</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-900">
                <span className="text-stone-400">Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-500">Active / Verified</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-400">MFA Status</span>
                <span className="font-semibold text-stone-500 dark:text-stone-400">Standard Email OTP</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Profile Forms / Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg font-bold text-stone-950 dark:text-stone-50 flex items-center gap-2">
                <User className="text-[#c29958]" size={18} />
                Account Credentials
              </CardTitle>
              <CardDescription className="text-xs">
                Your primary account identifiers and system values.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-450">
                    Administrator Name
                  </label>
                  <div className="p-3 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/10 rounded-md text-sm font-semibold text-stone-900 dark:text-stone-50">
                    {user.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-450">
                    Email Address
                  </label>
                  <div className="p-3 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/10 rounded-md text-sm font-semibold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                    <Mail size={14} className="text-stone-450" />
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-450">
                    Security ID (User ID)
                  </label>
                  <div className="p-3 border border-stone-200 dark:border-stone-800 bg-stone-50/55 dark:bg-stone-900/10 rounded-md text-xs font-mono text-stone-500 dark:text-stone-400 truncate">
                    {user.id}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-450">
                    Security Authorization
                  </label>
                  <div className="p-3 border border-stone-200 dark:border-stone-800 bg-stone-50/55 dark:bg-stone-900/10 rounded-md text-sm font-semibold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Full Admin Operations
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Operations Privileges Card */}
          <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg font-bold text-stone-950 dark:text-stone-50 flex items-center gap-2">
                <ShieldCheck className="text-[#c29958]" size={18} />
                Access Privileges Summary
              </CardTitle>
              <CardDescription className="text-xs">
                Review your current role permissions and administrative capacities.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border rounded-md bg-stone-50/20 dark:bg-stone-900/5 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-50 border-b pb-1">
                    Catalog & Products
                  </h4>
                  <ul className="space-y-1 list-disc pl-4 text-stone-500 dark:text-stone-400">
                    <li>Create, modify and delete products</li>
                    <li>Update inventory counts & pricing</li>
                    <li>Manage category & brand libraries</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md bg-stone-50/20 dark:bg-stone-900/5 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-50 border-b pb-1">
                    Orders & Fulfillment
                  </h4>
                  <ul className="space-y-1 list-disc pl-4 text-stone-500 dark:text-stone-400">
                    <li>Track sales and checkout operations</li>
                    <li>Update fulfillment status codes</li>
                    <li>Input carrier tracking details</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md bg-stone-50/20 dark:bg-stone-900/5 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-50 border-b pb-1">
                    Coupons & Marketing
                  </h4>
                  <ul className="space-y-1 list-disc pl-4 text-stone-500 dark:text-stone-400">
                    <li>Configure coupons and promo codes</li>
                    <li>Deploy store announcements</li>
                    <li>Configure global campaign offers</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md bg-stone-50/20 dark:bg-stone-900/5 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-50 border-b pb-1">
                    Customer Moderation
                  </h4>
                  <ul className="space-y-1 list-disc pl-4 text-stone-500 dark:text-stone-400">
                    <li>Inspect customer addresses & logs</li>
                    <li>Promote users to Administrator role</li>
                    <li>Inspect and moderate product reviews</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
