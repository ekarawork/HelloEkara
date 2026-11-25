"use client";

import { ShieldCheck } from "lucide-react";

import ChangePasswordForm from "./ChangePasswordForm";

/* =========================================================
   COMPONENT
========================================================= */

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      {/* ===================================================
          SECURITY HEADER
      =================================================== */}

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start gap-3">
            {/* Icon */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#2E3192] shadow-sm">
              <ShieldCheck size={20} strokeWidth={1.8} />
            </div>

            {/* Content */}

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Security
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your employee account password and
                security settings.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            SECURITY INFORMATION
        ================================================= */}

        <div className="px-6 py-5">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4">
            <p className="text-sm font-medium text-gray-800">
              Keep your account secure
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Use a strong password that you do not use on
              other websites or services. Update your password
              regularly to protect your employee account.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          CHANGE PASSWORD
      =================================================== */}

      <ChangePasswordForm />
    </div>
  );
}