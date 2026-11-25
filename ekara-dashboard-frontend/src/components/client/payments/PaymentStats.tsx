"use client";

import PaymentStatCard from "./PaymentStatCard";
import PaymentStatsSkeleton from "./PaymentStatsSkeleton";

import {
  ClientPaymentDashboardSummary,
} from "@/src/types/client/payments.types";

/* =========================================================
   PROPS
========================================================= */

interface PaymentStatsProps {
  summary: ClientPaymentDashboardSummary | null;
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentStats({
  summary,
  isLoading,
}: PaymentStatsProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <PaymentStatsSkeleton />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      <PaymentStatCard summary={summary} />
    </section>
  );
}