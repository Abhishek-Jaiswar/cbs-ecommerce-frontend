"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";
import { useLogoutMutation } from "@/services/api/auth/auth-api";
import { logout as logoutAction } from "@/store/features/auth/auth.slice";
import dynamic from "next/dynamic";
import { Loader2, LayoutDashboard, ShoppingBag, MapPin, Settings, LogOut } from "lucide-react";

type TabType = "overview" | "orders" | "addresses" | "profile" | "settings";

// Loading component for code-split tabs
const TabLoader = ({ text }: { text: string }) => (
  <div className="py-12 flex flex-col justify-center items-center gap-3 bg-white border border-stone-200 p-8 shadow-sm">
    <Loader2 className="h-6 w-6 animate-spin text-[#c29958]" />
    <p className="text-xs text-stone-500 italic font-light">{text}</p>
  </div>
);

// Dynamic loading of dashboard sections for code splitting and performance optimization
const AccountOverview = dynamic(
  () => import("./_components/account-overview").then((mod) => mod.AccountOverview),
  {
    ssr: false,
    loading: () => <TabLoader text="Accessing account overview..." />,
  }
);

const OrderHistory = dynamic(
  () => import("./_components/order-history"),
  {
    ssr: false,
    loading: () => <TabLoader text="Retrieving your order history..." />,
  }
);

const SavedAddresses = dynamic(
  () => import("./_components/saved-addresses"),
  {
    ssr: false,
    loading: () => <TabLoader text="Loading your addresses..." />,
  }
);

const AccountSettings = dynamic(
  () => import("./_components/account-settings").then((mod) => mod.AccountSettings),
  {
    ssr: false,
    loading: () => <TabLoader text="Loading account settings..." />,
  }
);

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isMounted && !loading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [isMounted, loading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      router.push("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  if (!isMounted || loading || (!isAuthenticated && !loading)) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-16 flex justify-center items-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#c29958] mx-auto" />
          <p className="text-sm text-stone-500 italic">Accessing account profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50/50 py-12 px-4 sm:px-6 lg:px-8 font-[var(--font-sans)]">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-serif text-stone-900 font-medium mb-10 text-center sm:text-left">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Side Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Profile Widget */}
            <div className="bg-white border border-stone-200 p-6 text-center space-y-3 shadow-sm hover:shadow transition-shadow duration-300">
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
                onClick={() => setActiveTab("overview")}
                className={`w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-200 ${
                  activeTab === "overview"
                    ? "bg-stone-50 text-[#c29958] border-l-2 border-[#c29958]"
                    : "text-stone-600 hover:bg-stone-50/50 hover:text-stone-900"
                }`}
              >
                <LayoutDashboard size={15} className="shrink-0" />
                Overview
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-200 ${
                  activeTab === "orders"
                    ? "bg-stone-50 text-[#c29958] border-l-2 border-[#c29958]"
                    : "text-stone-600 hover:bg-stone-50/50 hover:text-stone-900"
                }`}
              >
                <ShoppingBag size={15} className="shrink-0" />
                My Orders
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-200 ${
                  activeTab === "addresses"
                    ? "bg-stone-50 text-[#c29958] border-l-2 border-[#c29958]"
                    : "text-stone-600 hover:bg-stone-50/50 hover:text-stone-900"
                }`}
              >
                <MapPin size={15} className="shrink-0" />
                Saved Addresses
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-200 ${
                  activeTab === "settings"
                    ? "bg-stone-50 text-[#c29958] border-l-2 border-[#c29958]"
                    : "text-stone-600 hover:bg-stone-50/50 hover:text-stone-900"
                }`}
              >
                <Settings size={15} className="shrink-0" />
                Settings & Security
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
          <div className="lg:col-span-3 min-h-[400px]">
            {activeTab === "overview" && <AccountOverview user={user} setActiveTab={setActiveTab} />}
            {activeTab === "orders" && <OrderHistory />}
            {activeTab === "addresses" && <SavedAddresses />}
            {activeTab === "settings" && <AccountSettings user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
