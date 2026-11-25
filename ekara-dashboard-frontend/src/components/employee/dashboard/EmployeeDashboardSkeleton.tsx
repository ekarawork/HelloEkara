"use client";

import EmployeeDashboardStatsSkeleton from "./EmployeeDashboardStatsSkeleton";
import EmployeeDashboardRecentTasksSkeleton from "./EmployeeDashboardRecentTasksSkeleton";
import EmployeeDashboardUpcomingTasksSkeleton from "./EmployeeDashboardUpcomingTasksSkeleton";
import EmployeeDashboardOverdueTasksSkeleton from "./EmployeeDashboardOverdueTasksSkeleton";

/* =========================================================
   COMPONENT
========================================================= */

export default function EmployeeDashboardSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* =====================================================
          DASHBOARD HEADER SKELETON
      ===================================================== */}

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-52 rounded-lg bg-zinc-200" />
          <div className="h-4 w-72 max-w-full rounded bg-zinc-200" />
        </div>

        <div className="h-10 w-32 rounded-xl bg-zinc-200" />
      </section>

      {/* =====================================================
          STATS SKELETON
      ===================================================== */}

      <EmployeeDashboardStatsSkeleton />

      {/* =====================================================
          TASK SECTIONS SKELETON
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* RECENT TASKS */}
        <EmployeeDashboardRecentTasksSkeleton />

        {/* UPCOMING TASKS */}
        <EmployeeDashboardUpcomingTasksSkeleton />
      </div>

      {/* =====================================================
          OVERDUE TASKS SKELETON
      ===================================================== */}

      <EmployeeDashboardOverdueTasksSkeleton />
    </div>
  );
}