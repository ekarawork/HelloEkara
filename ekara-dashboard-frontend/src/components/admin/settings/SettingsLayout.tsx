"use client";

import { ReactNode, useState } from "react";

import SettingsSidebar from "./SettingsSidebar";

import type { AdminSettingsSection } from "@/src/types/admin/settings.types";

/* =========================================================
   TYPES
========================================================= */

interface SettingsLayoutProps {
  children: (
    activeSection: AdminSettingsSection
  ) => ReactNode;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const [activeSection, setActiveSection] =
    useState<AdminSettingsSection>("profile");

  return (
    <div className="w-full">
      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account, payment reminders, security,
          and contract settings.
        </p>
      </div>

      {/* ===================================================
          SETTINGS CONTENT
      =================================================== */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="min-w-0 flex-1">
          {children(activeSection)}
        </main>
      </div>
    </div>
  );
}