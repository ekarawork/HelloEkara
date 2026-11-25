"use client";

import DashboardStatsSkeleton from "./DashboardStatsSkeleton";
import DashboardLeadsChartSkeleton from "./DashboardLeadsChartSkeleton";
import DashboardSpendChartSkeleton from "./DashboardSpendChartSkeleton";
import ClientProgressSkeleton from "./ClientProgressSkeleton";
import DashboardPaymentSkeleton from "./DashboardPaymentSkeleton";
import UpcomingContentSkeleton from "./UpcomingContentSkeleton";

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-5">
      {/* ===================================================
          STATS
      =================================================== */}

      <DashboardStatsSkeleton />

      {/* ===================================================
          CHARTS
      =================================================== */}

      <section className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardLeadsChartSkeleton />

        <DashboardSpendChartSkeleton />
      </section>

      {/* ===================================================
          CLIENT PROGRESS
      =================================================== */}

      <ClientProgressSkeleton />

      {/* ===================================================
          PAYMENT + UPCOMING CONTENT
      =================================================== */}

      <section className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardPaymentSkeleton />

        <UpcomingContentSkeleton />
      </section>
    </div>
  );
}