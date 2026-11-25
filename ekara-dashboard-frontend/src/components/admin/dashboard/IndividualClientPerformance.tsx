"use client";

import { useEffect, useState } from "react";

import {
  DashboardClientPerformance,
} from "@/src/types/admin/dashboard.types";

import IndividualClientPerformanceSkeleton from "./IndividualClientPerformanceSkeleton";

/* =========================================================
   CLIENT PERFORMANCE TYPE
========================================================= */

interface ClientPerformance {
  id: number;
  name: string;
  email: string;
  initials: string;
  adSpend: string;
  leads: string;
  clicks: string;
  impressions: string;
  conversion: string;
  duePayment: string;
}

/* =========================================================
   COMPONENT PROPS
========================================================= */

interface IndividualClientPerformanceProps {
  clientPerformance: DashboardClientPerformance[];
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function IndividualClientPerformance({
  clientPerformance: dashboardClientPerformance,
  isLoading,
}: IndividualClientPerformanceProps) {
  const [clients, setClients] =
    useState<ClientPerformance[]>([]);

  /* =======================================================
     FORMAT CLIENT PERFORMANCE DATA
  ======================================================= */

  useEffect(() => {
    const formattedClients: ClientPerformance[] =
      dashboardClientPerformance.map(
        (item: DashboardClientPerformance) => {
          const client = item.client;

          /* ===============================================
             UNKNOWN CLIENT
          =============================================== */

          if (!client) {
            return {
              id: item.clientId,
              name: "Unknown Client",
              email: "",
              initials: "C",

              adSpend: `₹${Number(
                item.totalAdSpend || 0
              ).toLocaleString("en-IN")}`,

              leads: Number(
                item.totalLeads || 0
              ).toLocaleString("en-IN"),

              clicks: Number(
                item.totalClicks || 0
              ).toLocaleString("en-IN"),

              impressions: Number(
                item.totalImpressions || 0
              ).toLocaleString("en-IN"),

              conversion: `${Number(
                item.conversionRate || 0
              ).toFixed(2)}%`,

              duePayment: `₹${Number(
                item.totalDuePayment || 0
              ).toLocaleString("en-IN")}`,
            };
          }

          /* ===============================================
             CLIENT INITIALS
          =============================================== */

          const initials = client.name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map(
              (word) =>
                word.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();

          /* ===============================================
             RETURN FORMATTED CLIENT
          =============================================== */

          return {
            id: client.id,
            name: client.name,
            email: client.email,
            initials: initials || "C",

            adSpend: `₹${Number(
              item.totalAdSpend || 0
            ).toLocaleString("en-IN")}`,

            leads: Number(
              item.totalLeads || 0
            ).toLocaleString("en-IN"),

            clicks: Number(
              item.totalClicks || 0
            ).toLocaleString("en-IN"),

            impressions: Number(
              item.totalImpressions || 0
            ).toLocaleString("en-IN"),

            conversion: `${Number(
              item.conversionRate || 0
            ).toFixed(2)}%`,

            duePayment: `₹${Number(
              item.totalDuePayment || 0
            ).toLocaleString("en-IN")}`,
          };
        }
      );

    setClients(formattedClients);
  }, [dashboardClientPerformance]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <IndividualClientPerformanceSkeleton />
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full px-4 pb-6 pt-1 sm:px-5 lg:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            Individual Client Performance
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Performance totals and outstanding payment balance for each client.
          </p>
        </div>

        {/* =================================================
            DESKTOP / TABLET
        ================================================= */}

        <div className="mt-3 hidden px-5 pb-4 sm:block sm:px-6 sm:pb-5">

          <div
            className="
              max-h-[420px]
              overflow-x-auto
              overflow-y-auto
              scrollbar-thin
              scrollbar-track-transparent
              scrollbar-thumb-slate-300
              hover:scrollbar-thumb-slate-400
            "
          >
            <div className="min-w-[1000px]">

              {clients.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  No client performance data found.
                </div>
              ) : (
                clients.map(
                  (client, index) => (
                    <div
                      key={client.id}
                      className={`grid grid-cols-[2.2fr_repeat(6,1fr)] items-center gap-6 py-4 ${
                        index !==
                        clients.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >

                      {/* Client */}

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                          {client.initials}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                            {client.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-400 sm:text-sm">
                            {client.email}
                          </p>
                        </div>
                      </div>

                      {/* Ad Spend */}

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Ad spend
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                          {client.adSpend}
                        </p>
                      </div>

                      {/* Leads */}

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Leads
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                          {client.leads}
                        </p>
                      </div>

                      {/* Clicks */}

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Clicks
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                          {client.clicks}
                        </p>
                      </div>

                      {/* Impressions */}

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Impressions
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                          {client.impressions}
                        </p>
                      </div>

                      {/* Conversion */}

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Conversion
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                          {client.conversion}
                        </p>
                      </div>

                      {/* Due Payment */}

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Due payment
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                          {client.duePayment}
                        </p>
                      </div>
                    </div>
                  )
                )
              )}

            </div>
          </div>
        </div>

        {/* =================================================
            MOBILE
        ================================================= */}

        <div className="mt-3 px-5 pb-5 sm:hidden">

          <div className="max-h-[500px] space-y-3 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300">

            {clients.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No client performance data found.
              </div>
            ) : (
              clients.map(
                (client) => (
                  <div
                    key={client.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
                  >

                    {/* Client Header */}

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                        {client.initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {client.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {client.email}
                        </p>
                      </div>
                    </div>

                    {/* Metrics */}

                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">

                      <Metric
                        label="Ad spend"
                        value={client.adSpend}
                      />

                      <Metric
                        label="Leads"
                        value={client.leads}
                      />

                      <Metric
                        label="Clicks"
                        value={client.clicks}
                      />

                      <Metric
                        label="Impressions"
                        value={client.impressions}
                      />

                      <Metric
                        label="Conversion"
                        value={client.conversion}
                      />

                      <Metric
                        label="Due payment"
                        value={client.duePayment}
                      />

                    </div>
                  </div>
                )
              )
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

/* =========================================================
   MOBILE METRIC
========================================================= */

interface MetricProps {
  label: string;
  value: string;
}

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}