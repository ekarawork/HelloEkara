"use client";

import {
  Megaphone,
  Search,
} from "lucide-react";

import {
  ClientDashboardProgress,
  ClientDashboardServiceProgress,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   SERVICE ITEM
========================================================= */

interface ServiceItem {
  title: string;
  description: string;
  progress: ClientDashboardServiceProgress;
  icon: React.ElementType;
}

/* =========================================================
   PROPS
========================================================= */

interface ClientProgressCardProps {
  progress: ClientDashboardProgress | null;
}

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (
  value: number
): string => {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN"
  )}`;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ClientProgressCard({
  progress,
}: ClientProgressCardProps) {
  /* =======================================================
     SERVICE DATA
  ======================================================= */

  const serviceItems: ServiceItem[] = [
    {
      title: "Meta Ads",
      description:
        "Meta advertising budget usage",
      progress:
        progress?.metaAds || {
          spent: 0,
          budget: 0,
          percentage: 0,
        },
      icon: Megaphone,
    },

    {
      title: "Google Ads",
      description:
        "Google advertising budget usage",
      progress:
        progress?.googleAds || {
          spent: 0,
          budget: 0,
          percentage: 0,
        },
      icon: Search,
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {serviceItems.map((service) => {
        const Icon = service.icon;

        const spent = Number(
          service.progress.spent || 0
        );

        const budget = Number(
          service.progress.budget || 0
        );

        const percentage = Math.min(
          Math.max(
            Number(
              service.progress.percentage || 0
            ),
            0
          ),
          100
        );

        return (
          <div
            key={service.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6"
          >
            {/* Subtle Background */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-slate-100/60 blur-3xl transition-all duration-500 group-hover:bg-slate-200/60" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {/* Icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <Icon
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                      {service.title}
                    </h3>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Percentage */}
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold text-[#30369A]">
                    {percentage.toFixed(0)}%
                  </p>

                  <p className="text-[10px] font-medium text-slate-400">
                    used
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#30369A] transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Amounts */}
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Spent
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {formatCurrency(spent)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Budget
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {formatCurrency(budget)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}