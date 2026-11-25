"use client";

import { useEffect } from "react";
import { Mail, Shield, User } from "lucide-react";

import { useSettings } from "@/src/hooks/client/useSettings";

import ClientProfileForm from "./ClientProfileForm";
import ClientProfileSkeleton from "./ClientProfileSkeleton";

/* =========================================================
   COMPONENT
========================================================= */

export default function ClientProfile() {
  const {
    profile,
    isLoading,
    isUpdating,
    error,
    fetchClientProfile,
    updateProfile,
  } = useSettings();

  /* =======================================================
     FETCH PROFILE
  ======================================================= */

  useEffect(() => {
    fetchClientProfile();
  }, [fetchClientProfile]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading && !profile) {
    return <ClientProfileSkeleton />;
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <div className="rounded-lg bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchClientProfile}
            className="mt-3 text-sm font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!profile) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          Client profile not found.
        </p>
      </div>
    );
  }

  /* =======================================================
     UPDATE HANDLER
  ======================================================= */

  const handleUpdateProfile = async (
    payload: Parameters<typeof updateProfile>[0]
  ) => {
    await updateProfile(payload);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          PROFILE HEADER CARD
      =================================================== */}

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Client Profile
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* =================================================
                PROFILE AVATAR
            ================================================= */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[#2E3192] shadow-[0_4px_12px_rgba(46,49,146,0.18)]">
              <User size={32} strokeWidth={1.8} />
            </div>

            {/* =================================================
                PROFILE INFO
            ================================================= */}

            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {profile.first_name}
                {profile.last_name ? ` ${profile.last_name}` : ""}
              </h3>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={15} strokeWidth={1.8} />

                  <span className="break-all">
                    {profile.email}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield size={15} strokeWidth={1.8} />

                  <span>{profile.role}</span>
                </div>
              </div>
            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="shrink-0">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  profile.status === "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : profile.status === "BLOCKED"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {profile.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          PROFILE FORM
      =================================================== */}

      <ClientProfileForm
        profile={profile}
        isUpdating={isUpdating}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
}