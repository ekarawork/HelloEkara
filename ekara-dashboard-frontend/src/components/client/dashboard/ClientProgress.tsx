"use client";

import ClientProgressCard from "./ClientProgressCard";
import ClientProgressSkeleton from "./ClientProgressSkeleton";

import {
  ClientDashboardProgress,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   PROPS
========================================================= */

interface ClientProgressProps {
  progress: ClientDashboardProgress | null;
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ClientProgress({
  progress,
  isLoading,
}: ClientProgressProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <ClientProgressSkeleton />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          Client Progress
        </h2>

        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
          Advertising budget usage across your active services
        </p>
      </div>

      <ClientProgressCard
        progress={progress}
      />
    </section>
  );
}