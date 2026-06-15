"use client";

import React, { useState } from "react";
import { User, Lock, Mail, Phone, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AccountSettingsProps {
  user: {
    name: string;
    email: string;
  };
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  // Profile state
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Toggle visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(false);

    // Simulate API delay
    setTimeout(() => {
      setProfileLoading(false);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    }, 1200);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess(false);
    setPasswordError(null);

    // Validation
    if (newPassword.length < 6) {
      setPasswordLoading(false);
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordLoading(false);
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      setPasswordLoading(false);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-[var(--font-sans)]">
      {/* Title */}
      <div>
        <h2 className="text-lg font-serif text-stone-900 font-medium">Settings & Security</h2>
        <p className="text-xs text-stone-400 font-light mt-0.5">
          Update your personal profile information and change your account password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <Card className="border-stone-200 bg-white rounded-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <User size={16} className="text-[#c29958]" />
              Personal Profile
            </CardTitle>
            <CardDescription className="text-[10px]">
              Manage your displayed name and contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              {profileSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-2 font-medium">
                  <CheckCircle size={14} className="shrink-0" />
                  Profile details updated successfully!
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                  <Input
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="pl-9 h-9 rounded-none border-stone-200 focus-visible:ring-1 focus-visible:ring-stone-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                  <Input
                    required
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="pl-9 h-9 rounded-none border-stone-200 focus-visible:ring-1 focus-visible:ring-stone-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                  <Input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="pl-9 h-9 rounded-none border-stone-200 focus-visible:ring-1 focus-visible:ring-stone-950"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={profileLoading}
                className="w-full bg-stone-950 hover:bg-[#c29958] text-white rounded-none py-2 text-[10px] uppercase tracking-widest font-bold transition-colors duration-200 h-9 flex items-center justify-center gap-1.5"
              >
                {profileLoading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Form */}
        <Card className="border-stone-200 bg-white rounded-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Lock size={16} className="text-[#c29958]" />
              Update Password
            </CardTitle>
            <CardDescription className="text-[10px]">
              Secure your account credentials using a unique password.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-2 font-medium">
                  <CheckCircle size={14} className="shrink-0" />
                  Password updated successfully!
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-805 flex items-center gap-2 font-medium">
                  <AlertCircle size={14} className="shrink-0" />
                  {passwordError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                  <Input
                    required
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-9 pr-9 h-9 rounded-none border-stone-200 focus-visible:ring-1 focus-visible:ring-stone-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-450 hover:text-stone-900"
                  >
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                  <Input
                    required
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-9 pr-9 h-9 rounded-none border-stone-200 focus-visible:ring-1 focus-visible:ring-stone-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-450 hover:text-stone-900"
                  >
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                  <Input
                    required
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 pr-9 h-9 rounded-none border-stone-200 focus-visible:ring-1 focus-visible:ring-stone-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-450 hover:text-stone-900"
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-stone-950 hover:bg-[#c29958] text-white rounded-none py-2 text-[10px] uppercase tracking-widest font-bold transition-colors duration-200 h-9 flex items-center justify-center gap-1.5"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
