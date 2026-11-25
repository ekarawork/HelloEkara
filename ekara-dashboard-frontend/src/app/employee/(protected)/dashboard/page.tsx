"use client";

import { useCallback, useEffect, useState } from "react";

import EmployeeNavbar from "@/src/components/employee/EmployeeNavbar";
import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";

import EmployeeDashboardStats from "@/src/components/employee/dashboard/EmployeeDashboardStats";
import EmployeeDashboardRecentTasks from "@/src/components/employee/dashboard/EmployeeDashboardRecentTasks";
import EmployeeDashboardUpcomingTasks from "@/src/components/employee/dashboard/EmployeeDashboardUpcomingTasks";
import EmployeeDashboardOverdueTasks from "@/src/components/employee/dashboard/EmployeeDashboardOverdueTasks";
import EmployeeDashboardSkeleton from "@/src/components/employee/dashboard/EmployeeDashboardSkeleton";

import useDashboard from "@/src/hooks/employee/useDashboard";

import {
  EmployeeDashboardData,
} from "@/src/types/employee/dashboard.types";

/* =========================================================
   PAGE
========================================================= */

export default function EmployeeDashboardPage() {
  const {
    getDashboard,
    isLoading,
  } = useDashboard();

  const [dashboardData, setDashboardData] =
    useState<EmployeeDashboardData | null>(null);

  /* =======================================================
     FETCH DASHBOARD
  ======================================================= */

  const fetchDashboard = useCallback(async () => {
    const data = await getDashboard({
      recent_limit: 5,
      upcoming_limit: 5,
      overdue_limit: 5,
    });

    if (data) {
      setDashboardData(data);
    }
  }, [getDashboard]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <div className="min-h-screen bg-slate-50">
        {/* =================================================
            NAVBAR
        ================================================= */}

        <EmployeeNavbar />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          {isLoading && !dashboardData ? (
            <EmployeeDashboardSkeleton />
          ) : (
            <div className="w-full space-y-6">
              {/* ===========================================
                  DASHBOARD HEADER
              =========================================== */}

              <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Employee Dashboard
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Track your assigned tasks, deadlines, and progress.
                  </p>
                </div>

                {dashboardData?.meta?.today && (
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                    {new Date(
                      dashboardData.meta.today
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                )}
              </section>

              {/* ===========================================
                  STATS
              =========================================== */}

              <EmployeeDashboardStats
                summary={dashboardData?.summary || null}
                isLoading={isLoading}
              />

              {/* ===========================================
                  RECENT AND UPCOMING TASKS
              =========================================== */}

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <EmployeeDashboardRecentTasks
                  tasks={dashboardData?.recentTasks || []}
                  isLoading={isLoading}
                />

                <EmployeeDashboardUpcomingTasks
                  tasks={dashboardData?.upcomingDeadlines || []}
                  isLoading={isLoading}
                />
              </div>

              {/* ===========================================
                  OVERDUE TASKS
              =========================================== */}

              <EmployeeDashboardOverdueTasks
                tasks={dashboardData?.overdueTasks || []}
                isLoading={isLoading}
              />
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}