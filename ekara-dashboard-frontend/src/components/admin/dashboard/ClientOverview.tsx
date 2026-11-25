"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DashboardClient,
  DashboardClientPerformance,
  DashboardStats,
} from "@/src/types/admin/dashboard.types";

import ClientOverviewSkeleton from "./ClientOverviewSkeleton";

/* =========================================================
   TYPES
========================================================= */

interface ClientItem {
  id: number;
  name: string;
  email: string;
  initials: string;
  services: string[];
}

interface PerformanceItem {
  label: string;
  value: string;
}

/* =========================================================
   PROPS
========================================================= */

interface ClientOverviewProps {
  clients: DashboardClient[];
  clientPerformance: DashboardClientPerformance[];
  stats: DashboardStats | null;
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ClientOverview({
  clients: dashboardClients,
  clientPerformance: _clientPerformance,
  stats,
  isLoading,
}: ClientOverviewProps) {
  const router = useRouter();

  const [clients, setClients] =
    useState<ClientItem[]>([]);

  /* =======================================================
     FORMAT CLIENT DATA
  ======================================================= */

  useEffect(() => {
    const formattedClients: ClientItem[] =
      dashboardClients.map(
        (client: DashboardClient) => {
          const initials = client.name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((word) =>
              word.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();

          const services =
            client.clientServices.map(
              (service) => {
                switch (
                  service.service_name
                ) {
                  case "META_ADS":
                    return "Meta Ads";

                  case "GOOGLE_ADS":
                    return "Google Ads";

                  case "WEBSITE_SALES":
                    return "Website Sales";

                  case "ORGANIC_SOCIAL":
                    return "Organic Social";

                  default:
                    return service.service_name;
                }
              }
            );

          return {
            id: client.id,
            name: client.name,
            email: client.email,
            initials: initials || "C",
            services,
          };
        }
      );

    setClients(formattedClients);
  }, [dashboardClients]);

  /* =======================================================
     PERFORMANCE DETAILS
  ======================================================= */

  const totalLeads =
    Number(stats?.totalLeads || 0);

  const totalClicks =
    Number(stats?.totalClicks || 0);

  /* =======================================================
     CONVERSION RATE
  ======================================================= */

  const conversionRate =
    totalClicks > 0
      ? (
          (totalLeads /
            totalClicks) *
          100
        ).toFixed(2)
      : "0.00";

  /* =======================================================
     PERFORMANCE DATA
  ======================================================= */

  const performanceDetails: PerformanceItem[] = [
    {
      label: "Total ad spend",
      value: `₹${Number(
        stats?.totalAdSpend || 0
      ).toLocaleString("en-IN")}`,
    },

    {
      label: "Leads",
      value:
        totalLeads.toLocaleString(
          "en-IN"
        ),
    },

    {
      label: "Clicks",
      value:
        totalClicks.toLocaleString(
          "en-IN"
        ),
    },

    {
      label: "Impressions",
      value: Number(
        stats?.totalImpressions || 0
      ).toLocaleString("en-IN"),
    },

    {
      label: "Conversion rate",
      value: `${conversionRate}%`,
    },

    {
      label: "Total due payment",
      value: `₹${Number(
        stats?.totalDuePayment || 0
      ).toLocaleString("en-IN")}`,
    },
  ];

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <ClientOverviewSkeleton />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full px-4 pb-6 pt-5 sm:px-5 lg:px-6 lg:pt-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

        {/* =================================================
            CLIENT OVERVIEW
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

          {/* Header */}

          <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Client Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Current accounts and enabled services.
              </p>
            </div>

            {/* View Clients */}

            <button
              type="button"
              onClick={() =>
                router.push("/admin/client")
              }
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#2E3192] transition hover:text-[#242676] sm:text-sm"
            >
              <span>
                View clients
              </span>

              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* Client List */}

          <div
            className="
              max-h-[300px]
              overflow-y-auto
              px-5
              pb-3
              pt-3
              sm:px-6
              scrollbar-thin
              scrollbar-track-transparent
              scrollbar-thumb-slate-300
              hover:scrollbar-thumb-slate-400
            "
          >
            {clients.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No active clients found.
              </div>
            ) : (
             clients.map((client, index) => (
                <div
                  key={client.id}
                  className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                    index !== clients.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  {/* CLIENT INFO */}
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {client.initials}
                    </div>

                    {/* Name + Email */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {client.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {client.email}
                      </p>
                    </div>
                  </div>

                  {/* SERVICES */}
                  <div className="flex flex-wrap items-center gap-1.5 pl-12 sm:shrink-0 sm:justify-end sm:pl-0">
                    {client.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-md bg-[#F0F0FF] px-2 py-1 text-[10px] font-medium text-[#2E3192] sm:text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =================================================
            PERFORMANCE DETAILS
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

          {/* Header */}

          <div className="px-5 pt-5 sm:px-6 sm:pt-6">
            <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              Performance details
            </h2>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Agency-wide performance from saved daily records.
            </p>
          </div>

          {/* Performance Grid */}

          <div className="grid grid-cols-1 gap-3 px-5 pb-5 pt-3 sm:grid-cols-2 sm:px-6 sm:pb-6">
            {performanceDetails.map(
              (item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
                >
                  <p className="text-xs font-medium text-slate-400">
                    {item.label}
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-slate-900 sm:text-base">
                    {item.value}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}