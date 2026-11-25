"use client";

import ClientNavbar from "@/src/components/client/ClientNavbar";
import ClientPortalGuard from "@/src/components/admin/auth/ClientPortalGuard";

import SettingsLayout from "@/src/components/client/settings/SettingsLayout";

import ClientProfile from "@/src/components/client/settings/profile/ClientProfile";
import SecuritySettings from "@/src/components/client/settings/security/SecuritySettings";

import type {
  ClientSettingsSection,
} from "@/src/types/client/settings.types";

/* =========================================================
   SETTINGS CONTENT
========================================================= */

function SettingsContent({
  activeSection,
}: {
  activeSection: ClientSettingsSection;
}) {
  switch (activeSection) {
    case "profile":
      return <ClientProfile />;

    case "security":
      return <SecuritySettings />;

    default:
      return <ClientProfile />;
  }
}

/* =========================================================
   SETTINGS PAGE
========================================================= */

export default function SettingsPage() {
  return (
    <ClientPortalGuard>
      <div className="min-h-screen bg-slate-50">
        {/* =================================================
            NAVBAR
        ================================================= */}

        <ClientNavbar />

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="w-full bg-slate-50">
          <section className="w-full px-4 py-6 sm:px-5 lg:px-6">
            <div className="mx-auto w-full max-w-[1600px]">
              <SettingsLayout>
                {(activeSection) => (
                  <SettingsContent
                    activeSection={activeSection}
                  />
                )}
              </SettingsLayout>
            </div>
          </section>
        </main>
      </div>
    </ClientPortalGuard>
  );
}