"use client";

import {
  Bell,
  FileText,
  Lock,
  User,
} from "lucide-react";

import type { AdminSettingsSection } from "@/src/types/admin/settings.types";

/* =========================================================
   TYPES
========================================================= */

interface SettingsSidebarProps {
  activeSection: AdminSettingsSection;
  onSectionChange: (section: AdminSettingsSection) => void;
}

/* =========================================================
   SETTINGS ITEMS
========================================================= */

const SETTINGS_ITEMS: {
  id: AdminSettingsSection;
  label: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    id: "profile",
    label: "Admin Profile",
    description: "Manage your profile information",
    icon: User,
  },
  {
    id: "payment-reminders",
    label: "Payment Reminders",
    description: "Configure payment reminder settings",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    description: "Manage password and account security",
    icon: Lock,
  },
  {
    id: "contracts",
    label: "Contracts",
    description: "Manage contract settings",
    icon: FileText,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}

        <div className="border-b border-gray-200 px-5 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account and preferences
          </p>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="p-3">
          <div className="space-y-1">
            {SETTINGS_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSectionChange(item.id)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-[0_2px_8px_rgba(46,49,146,0.16)]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {/* Icon */}

                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-indigo-100 text-[#2E3192] shadow-sm"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>

                  {/* Content */}

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-sm font-medium text-[#2E3192]"
                          : "text-gray-800"
                      }`}
                    >
                      {item.label}
                    </p>

                    <p
                      className={`mt-0.5 text-xs leading-5 ${
                        isActive
                          ? "text-sm font-medium text-[#2E3192]"
                          : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}