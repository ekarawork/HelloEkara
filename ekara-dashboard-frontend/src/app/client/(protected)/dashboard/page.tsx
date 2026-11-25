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

import DashboardSkeleton from "@/src/components/client/dashboard/DashboardSkeleton";
import DashboardStats from "@/src/components/client/dashboard/DashboardStats";
import DashboardCharts from "@/src/components/client/dashboard/DashboardCharts";
import ClientProgress from "@/src/components/client/dashboard/ClientProgress";
import DashboardPayment from "@/src/components/client/dashboard/DashboardPayment";
import UpcomingContent from "@/src/components/client/dashboard/UpcomingContent";

import useDashboard from "@/src/hooks/client/useDashboard";

import {
  ClientDashboardData,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   COMPONENT
========================================================= */

export default function ClientDashboardPage() {
  /* =======================================================
     HOOK
  ======================================================= */

  const {
    getDashboard,
    isLoading,
    error,
    clearError,
  } = useDashboard();

  /* =======================================================
     STATE
  ======================================================= */

  const [dashboard, setDashboard] =
    useState<ClientDashboardData | null>(
      null
    );

  /* =======================================================
     FETCH DASHBOARD
  ======================================================= */

  const fetchDashboard =
    useCallback(async () => {
      const data =
        await getDashboard();

      if (data) {
        setDashboard(data);
      }
    }, [getDashboard]);

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh =
    useCallback(async () => {
      clearError();

      await fetchDashboard();
    }, [
      clearError,
      fetchDashboard,
    ]);

  /* =======================================================
     ERROR STATE
  ======================================================= */

  const showInitialSkeleton =
    isLoading && !dashboard;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <ClientPortalGuard>
      <div className="min-h-screen bg-slate-50">
        {/* =================================================
            NAVBAR
        ================================================= */}

        <ClientNavbar />

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="w-full px-4 pt-5 sm:px-5 lg:px-6 lg:pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Title */}
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track your advertising performance,
                payments and upcoming content.
              </p>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => {
                void handleRefresh();
              }}
              disabled={isLoading}
              className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                {isLoading
                  ? "Refreshing..."
                  : "Refresh"}
              </span>
            </button>
          </div>
        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <section className="w-full px-4 pt-5 sm:px-5 lg:px-6">
            <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-700">
                  Failed to load dashboard
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void handleRefresh();
                }}
                disabled={isLoading}
                className="inline-flex h-9 w-fit shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={14}
                  strokeWidth={1.8}
                  className={
                    isLoading
                      ? "animate-spin"
                      : ""
                  }
                />

                Try Again
              </button>
            </div>
          </section>
        )}

        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <main className="w-full px-4 pb-6 pt-5 sm:px-5 lg:px-6 lg:pt-6">
          {/* Initial Loading */}
          {showInitialSkeleton ? (
            <DashboardSkeleton />
          ) : (
            <div className="w-full space-y-5">
              {/* =========================================
                  STATS
              ========================================= */}

              <DashboardStats
                stats={
                  dashboard?.stats || null
                }
                isLoading={isLoading}
              />

              {/* =========================================
                  CHARTS
              ========================================= */}

              <DashboardCharts
                dailyLeads={
                  dashboard?.charts?.dailyLeads || []
                }
                dailyAdSpend={
                  dashboard?.charts?.dailyAdSpend || []
                }
                isLoading={isLoading}
              />

              {/* =========================================
                  CLIENT PROGRESS
              ========================================= */}

              <ClientProgress
                progress={
                  dashboard?.clientProgress || null
                }
                isLoading={isLoading}
              />

              {/* =========================================
                  PAYMENT + UPCOMING CONTENT
              ========================================= */}

              <section className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
                <DashboardPayment
                  payment={
                    dashboard?.payments
                      ?.current || null
                  }
                  isLoading={isLoading}
                />

                <UpcomingContent
                  content={
                    dashboard?.upcomingContent ||
                    null
                  }
                  isLoading={isLoading}
                />
              </section>
            </div>
          )}
        </main>
      </div>
    </ClientPortalGuard>
  );
}