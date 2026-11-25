"use client";

import { useEffect, useState } from "react";

import DashboardStats from "@/src/components/admin/dashboard/DashboardStats";
import DailyPerformanceCharts from "@/src/components/admin/dashboard/DailyPerformanceCharts";
import ClientOverview from "@/src/components/admin/dashboard/ClientOverview";
import IndividualClientPerformance from "@/src/components/admin/dashboard/IndividualClientPerformance";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import AdminNavbar from "@/src/components/admin/AdminNavbar";

import useDashboard from "@/src/hooks/admin/useDashboard";

import {
  DashboardResponseData,
} from "@/src/types/admin/dashboard.types";

export default function DashboardPage() {
  const {
    getDashboardData,
    isLoading,
  } = useDashboard();

  const [dashboardData, setDashboardData] =
    useState<DashboardResponseData | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const data = await getDashboardData({
        days: 365,
      });

      if (data) {
        setDashboardData(data);
      }
    };

    loadDashboard();
  }, [getDashboardData]);

  return (
    <ProtectedRoute
      allowedRoles={["SUPER_ADMIN", "ADMIN"]}
    >
      <div className="min-h-screen bg-slate-50">

        {/* Admin Navbar */}
        <AdminNavbar />

        {/* Dashboard */}
        <DashboardStats
          stats={dashboardData?.stats ?? null}
          isLoading={isLoading}
        />

        <DailyPerformanceCharts
          dailyPerformance={
            dashboardData?.dailyPerformance ?? null
          }
          isLoading={isLoading}
        />

        <ClientOverview
          clients={dashboardData?.clients ?? []}
          clientPerformance={
            dashboardData?.clientPerformance ?? []
          }
          stats={dashboardData?.stats ?? null}
          isLoading={isLoading}
        />

        <IndividualClientPerformance
          clientPerformance={
            dashboardData?.clientPerformance ?? []
          }
          isLoading={isLoading}
        />

      </div>
    </ProtectedRoute>
  );
}