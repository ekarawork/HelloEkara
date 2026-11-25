"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CircleDollarSign,
  Eye,
  Users,
  WalletCards,
  UserRoundCheck,
} from "lucide-react";

import DashboardStatsSkeleton from "./DashboardStatsSkeleton";
import {
  DashboardStats as DashboardStatsType,
} from "@/src/types/admin/dashboard.types";

/* =========================================================
   STAT ITEM
========================================================= */

interface StatItem {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

/* =========================================================
   PROPS
========================================================= */

interface DashboardStatsProps {
  stats: DashboardStatsType | null;
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardStats({
  stats: dashboardStats,
  isLoading,
}: DashboardStatsProps) {
  const [userName, setUserName] = useState("Admin");

  /* =======================================================
     USER NAME
  ======================================================= */

  useEffect(() => {
    // Keep this for future logged-in admin name handling.
    // Currently defaulting to "Admin".
    setUserName("Admin");
  }, []);

  /* =======================================================
     FORMAT CURRENCY
  ======================================================= */

  const formatCurrency = (value: number): string => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  /* =======================================================
     STATS
  ======================================================= */

  const statItems: StatItem[] = [
    {
      title: "Total Service Fees",
      value: formatCurrency(
        dashboardStats?.totalServiceFees || 0
      ),
      description: "Total fees collected",
      icon: CircleDollarSign,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
    {
      title: "Active Clients",
      value: Number(
        dashboardStats?.activeClients || 0
      ).toLocaleString("en-IN"),
      description: "Currently active clients",
      icon: UserRoundCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
    {
      title: "Impressions",
      value: Number(
        dashboardStats?.totalImpressions || 0
      ).toLocaleString("en-IN"),
      description: "Total ad impressions",
      icon: Eye,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
    {
      title: "Total Ad Spend",
      value: formatCurrency(
        dashboardStats?.totalAdSpend || 0
      ),
      description: "Total advertising spend",
      icon: WalletCards,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
    {
      title: "Total Due Payment",
      value: formatCurrency(
        dashboardStats?.totalDuePayment || 0
      ),
      description: "Outstanding payments",
      icon: BriefcaseBusiness,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
    {
      title: "Total Employee",
      value: Number(
        dashboardStats?.totalEmployees || 0
      ).toLocaleString("en-IN"),
      description: "Total employees",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
  ];

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
    <section className="w-full px-4 pt-5 sm:px-5 lg:px-6 lg:pt-6">
      {/* Dashboard Intro */}
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Welcome back, {userName}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Agency performance overview from saved client data.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statItems.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
            >
              {/* Subtle shine */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-slate-100/50 blur-3xl transition-all duration-500 group-hover:bg-slate-200/50" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {stat.value}
                  </h3>

                  <p className="mt-1.5 text-xs font-medium text-emerald-600">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={21} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}