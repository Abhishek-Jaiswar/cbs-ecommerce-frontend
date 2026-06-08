"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import ProfileOverview from "./_components/profile-overview";
import OrderHistory from "./_components/order-history";
import SavedAddresses from "./_components/saved-addresses";
import { Loader2, User, ShoppingBag, MapPin, LogOut } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useLogoutMutation } from "@/services/api/auth/auth-api";
import { logout as logoutAction } from "@/store/features/auth/auth.slice";

type TabType = "profile" | "orders" | "addresses";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      router.push("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  if (loading || (!isAuthenticated && !loading)) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-16 flex justify-center items-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
          <p className="text-sm text-stone-500 italic">Accessing account profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-serif text-stone-900 font-medium mb-10 text-center sm:text-left">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Side Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Profile Widget */}
            <div className="bg-white border border-stone-200 p-6 text-center space-y-3 shadow-sm">
              <div className="h-12 w-12 bg-stone-950 text-white rounded-full flex items-center justify-center font-bold text-base mx-auto border border-stone-800">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-serif text-stone-900 font-bold">{user.name}</h3>
                <p className="text-[10px] text-stone-400 font-light truncate">{user.email}</p>
              </div>
            </div>

            {/* Navigation Tabs List */}
            <nav className="bg-white border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100 flex flex-col">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === "profile"
                    ? "bg-stone-50 text-amber-600 border-l-2 border-stone-950"
                    : "text-stone-600 hover:bg-stone-50/50 hover:text-stone-900"
                }`}
              >
                <User size={15} className="shrink-0" />
                Profile Info
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === "orders"
                    ? "bg-stone-50 text-amber-600 border-l-2 border-stone-950"
                    : "text-stone-600 hover:bg-stone-50/50 hover:text-stone-900"
                }`}
              >
                <ShoppingBag size={15} className="shrink-0" />
                My Orders
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === "addresses"
                    ? "bg-stone-50 text-amber-600 border-l-2 border-stone-950"
                    : "text-stone-600 hover:bg-stone-50/50 hover:text-stone-900"
                }`}
              >
                <MapPin size={15} className="shrink-0" />
                Saved Addresses
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors text-rose-600 hover:bg-rose-50/40"
              >
                <LogOut size={15} className="shrink-0" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Right Main Tab Contents */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && <ProfileOverview user={user} />}
            {activeTab === "orders" && <OrderHistory />}
            {activeTab === "addresses" && <SavedAddresses />}
          </div>
        </div>
      </div>
    </div>
  );
}
