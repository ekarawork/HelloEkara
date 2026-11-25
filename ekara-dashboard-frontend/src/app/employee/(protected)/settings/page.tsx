"use client";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import EmployeeNavbar from "@/src/components/employee/EmployeeNavbar";

import SettingsLayout from "@/src/components/employee/settings/SettingsLayout";

import EmployeeProfile from "@/src/components/employee/settings/profile/EmployeeProfile";
import SecuritySettings from "@/src/components/employee/settings/security/SecuritySettings";

import type {
  EmployeeSettingsSection,
} from "@/src/types/employee/settings.types";

/* =========================================================
   SETTINGS CONTENT
========================================================= */

function SettingsContent({
  activeSection,
}: {
  activeSection: EmployeeSettingsSection;
}) {
  switch (activeSection) {
    case "profile":
      return <EmployeeProfile />;

    case "security":
      return <SecuritySettings />;

    default:
      return <EmployeeProfile />;
  }
}

/* =========================================================
   SETTINGS PAGE
========================================================= */

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <div className="min-h-screen bg-gray-50">
        {/* =================================================
            NAVBAR
        ================================================= */}

        <EmployeeNavbar />

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