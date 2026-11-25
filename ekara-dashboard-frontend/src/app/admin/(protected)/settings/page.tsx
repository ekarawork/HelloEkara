"use client";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import AdminNavbar from "@/src/components/admin/AdminNavbar";

import SettingsLayout from "@/src/components/admin/settings/SettingsLayout";

import AdminProfile from "@/src/components/admin/settings/profile/AdminProfile";
import PaymentReminderSettings from "@/src/components/admin/settings/payment-reminders/PaymentReminderSettings";
import SecuritySettings from "@/src/components/admin/settings/security/SecuritySettings";
import ContractSettings from "@/src/components/admin/settings/contracts/ContractSettings";

import type {
  AdminSettingsSection,
} from "@/src/types/admin/settings.types";

/* =========================================================
   SETTINGS CONTENT
========================================================= */

function SettingsContent({
  activeSection,
}: {
  activeSection: AdminSettingsSection;
}) {
  switch (activeSection) {
    case "profile":
      return <AdminProfile />;

    case "payment-reminders":
      return <PaymentReminderSettings />;

    case "security":
      return <SecuritySettings />;

    case "contracts":
      return <ContractSettings />;

    default:
      return <AdminProfile />;
  }
}

/* =========================================================
   SETTINGS PAGE
========================================================= */

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* =================================================
            NAVBAR
        ================================================= */}

        <AdminNavbar />

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <SettingsLayout>
              {(activeSection) => (
                <SettingsContent
                  activeSection={activeSection}
                />
              )}
            </SettingsLayout>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}