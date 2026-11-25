"use client";

import GoogleAdsStatCard from "./GoogleAdsStatCard";
import GoogleAdsStatsSkeleton from "./GoogleAdsStatsSkeleton";

import {
  ClientGoogleAdsDashboardStats,
} from "@/src/types/client/googleadsPerformance.types";

/* =========================================================
   PROPS
========================================================= */

interface GoogleAdsStatsProps {
  stats: ClientGoogleAdsDashboardStats | null;
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function GoogleAdsStats({
  stats,
  isLoading,
}: GoogleAdsStatsProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <GoogleAdsStatsSkeleton />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      <GoogleAdsStatCard stats={stats} />
    </section>
  );
}