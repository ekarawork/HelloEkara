"use client";

import DashboardLeadsChart from "./DashboardLeadsChart";
import DashboardSpendChart from "./DashboardSpendChart";

import {
  ClientDashboardDailyLead,
  ClientDashboardDailyAdSpend,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   PROPS
========================================================= */

interface DashboardChartsProps {
  dailyLeads: ClientDashboardDailyLead[];
  dailyAdSpend: ClientDashboardDailyAdSpend[];
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardCharts({
  dailyLeads,
  dailyAdSpend,
  isLoading,
}: DashboardChartsProps) {
  return (
    <section className="w-full space-y-5">
      {/* Daily Leads */}
      <DashboardLeadsChart
        dailyLeads={dailyLeads}
        isLoading={isLoading}
      />

      {/* Daily Ad Spend */}
      <DashboardSpendChart
        dailySpend={dailyAdSpend}
        isLoading={isLoading}
      />
    </section>
  );
}