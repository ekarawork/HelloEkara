"use client";

import {
  MousePointerClick,
  UserRoundPlus,
  WalletCards,
  Eye,
} from "lucide-react";

import type {
  ClientPerformanceDashboardStats as ClientPerformanceDashboardStatsType,
} from "@/src/types/admin/clientPerformance.types";

interface ClientPerformanceDashboardStatsProps {
  stats: ClientPerformanceDashboardStatsType;
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-IN").format(value);
};

const formatSpend = (value: number): string => {
  return `₹${formatNumber(value)}`;
};

export default function ClientPerformanceDashboardStats({
  stats,
}: ClientPerformanceDashboardStatsProps) {
  const statCards = [
    {
      title: "Leads",
      value: formatNumber(stats.leads),
      icon: UserRoundPlus,
    },
    {
      title: "Spend",
      value: formatSpend(stats.spend),
      icon: WalletCards,
    },
    {
      title: "Impressions",
      value: formatNumber(stats.impressions),
      icon: Eye,
    },
    {
      title: "Clicks",
      value: formatNumber(stats.clicks),
      icon: MousePointerClick,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className="text-slate-600"
                />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                  {stat.value}
                </p>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-5 text-xs font-medium text-emerald-600">
              From saved daily data
            </p>
          </div>
        );
      })}
    </div>
  );
}