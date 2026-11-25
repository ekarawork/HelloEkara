"use client";

import DashboardStatCard from "./DashboardStatCard";
import DashboardStatsSkeleton from "./DashboardStatsSkeleton";

import {
  ClientDashboardStats,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   PROPS
========================================================= */

interface DashboardStatsProps {
  stats: ClientDashboardStats | null;
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardStats({
  stats,
  isLoading,
}: DashboardStatsProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      <DashboardStatCard stats={stats} />
    </section>
  );
}