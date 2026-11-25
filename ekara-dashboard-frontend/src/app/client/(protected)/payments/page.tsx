"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  RefreshCw,
} from "lucide-react";

import ClientNavbar from "@/src/components/client/ClientNavbar";
import ClientPortalGuard from "@/src/components/admin/auth/ClientPortalGuard";

import PaymentStats from "@/src/components/client/payments/PaymentStats";
import PaymentHistory from "@/src/components/client/payments/PaymentHistory";
import PaymentReminder from "@/src/components/client/payments/PaymentReminder";

import usePayments from "@/src/hooks/client/usePayments";

import {
  ClientPaymentDashboardData,
} from "@/src/types/client/payments.types";

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentsPage() {
  const {
    getPaymentDashboard,
    isLoading,
    error,
    clearError,
  } = usePayments();

  const [
    dashboardData,
    setDashboardData,
  ] = useState<ClientPaymentDashboardData | null>(
    null
  );

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const loadDashboard = useCallback(
    async () => {
      const data =
        await getPaymentDashboard();

      if (data) {
        setDashboardData(data);
      }
    },
    [getPaymentDashboard]
  );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <ClientPortalGuard>
      <div className="min-h-screen bg-slate-50">
        <ClientNavbar />

        <main className="w-full bg-slate-50">
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="w-full px-4 pt-5 sm:px-5 lg:px-6 lg:pt-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Payments Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Track your payments, payment history, and reminders.
                </p>
              </div>

              {/* =================================================
                  REFRESH
              ================================================= */}

              <button
                type="button"
                onClick={() => {
                  clearError();
                  loadDashboard();
                }}
                disabled={isLoading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  strokeWidth={1.8}
                  className={
                    isLoading
                      ? "animate-spin"
                      : ""
                  }
                />

                <span>
                  Refresh
                </span>
              </button>
            </div>
          </section>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && !isLoading && (
            <section className="w-full px-4 sm:px-5 lg:px-6">
              <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Failed to load Payment dashboard
                  </p>

                  <p className="mt-1 text-xs text-red-600">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    loadDashboard();
                  }}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-medium text-red-700 transition hover:bg-red-50"
                >
                  <RefreshCw
                    size={14}
                    strokeWidth={1.8}
                  />

                  Retry
                </button>
              </div>
            </section>
          )}

          {/* =================================================
              PAYMENT CONTENT
          ================================================= */}

          <section className="w-full px-4 pb-6 pt-5 sm:px-5 lg:px-6 lg:pt-6">
            <div className="space-y-5">
              {/* =================================================
                  PAYMENT STATS
              ================================================= */}

              <PaymentStats
                summary={
                  dashboardData?.summary ||
                  null
                }
                isLoading={isLoading}
              />

              {/* =================================================
                  PAYMENT HISTORY + REMINDER
              ================================================= */}

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {/* =================================================
                    PAYMENT HISTORY
                ================================================= */}

                <PaymentHistory
                  payments={
                    dashboardData?.payments ||
                    []
                  }
                  isLoading={isLoading}
                />

                {/* =================================================
                    PAYMENT REMINDER
                ================================================= */}

                <PaymentReminder
                  payments={
                    dashboardData?.payments ||
                    []
                  }
                  isLoading={isLoading}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </ClientPortalGuard>
  );
}