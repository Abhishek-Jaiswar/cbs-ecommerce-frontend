"use client";

import React from "react";
import { User, Mail, Shield, CheckCircle, XCircle } from "lucide-react";

interface ProfileOverviewProps {
  user: {
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user }) => {
  const initials = user.name.substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-serif text-stone-900 font-medium">Profile Overview</h2>
        <p className="text-xs text-stone-400 font-light mt-0.5">
          View your basic account credentials and security settings.
        </p>
      </div>

      <div className="bg-white border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-100">
          <div className="h-16 w-16 bg-stone-950 text-white rounded-full flex items-center justify-center font-bold text-lg select-none shrink-0 border border-stone-800 shadow-inner">
            {initials}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-serif text-stone-900 font-bold">{user.name}</h3>
            <p className="text-xs text-stone-400 capitalize">{user.role.toLowerCase()} account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Email Address */}
          <div className="flex items-start gap-4 p-4 bg-stone-50/50 border border-stone-150 rounded-none">
            <Mail size={18} className="text-stone-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Email Address
              </span>
              <span className="text-xs font-semibold text-stone-800">{user.email}</span>
            </div>
          </div>

          {/* Account Role */}
          <div className="flex items-start gap-4 p-4 bg-stone-50/50 border border-stone-150 rounded-none">
            <Shield size={18} className="text-stone-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Account Type
              </span>
              <span className="text-xs font-semibold text-stone-800 capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Email Verification */}
          <div className="flex items-start gap-4 p-4 bg-stone-50/50 border border-stone-150 rounded-none md:col-span-2">
            {user.emailVerified ? (
              <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Verification Status
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-800">
                  {user.emailVerified ? "Verified Email Address" : "Unverified Email Address"}
                </span>
                {user.emailVerified && (
                  <span className="bg-emerald-50 text-emerald-800 font-bold uppercase text-[9px] tracking-wider px-2 py-0.5 border border-emerald-150">
                    Active Secure
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
