"use client";

import MetaAdsStatCard from "../meta-ads/MetaAdsStatCard";
import MetaAdsStatsSkeleton from "../meta-ads/MetaAdsStatsSkeleton";

import {
  ClientMetaAdsDashboardStats,
} from "@/src/types/client/metaadsPerformance.types";

/* =========================================================
   PROPS
========================================================= */

interface MetaAdsStatsProps {
  stats: ClientMetaAdsDashboardStats | null;
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function MetaAdsStats({
  stats,
  isLoading,
}: MetaAdsStatsProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <MetaAdsStatsSkeleton />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      <MetaAdsStatCard stats={stats} />
    </section>
  );
}