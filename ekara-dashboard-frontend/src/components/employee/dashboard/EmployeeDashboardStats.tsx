"use client";

import {
  ClipboardList,
  ListTodo,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import {
  EmployeeDashboardSummary,
} from "@/src/types/employee/dashboard.types";

import EmployeeDashboardStatsSkeleton from "./EmployeeDashboardStatsSkeleton";

/* =========================================================
   PROPS
========================================================= */

interface EmployeeDashboardStatsProps {
  summary: EmployeeDashboardSummary | null;
  isLoading: boolean;
}

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
   COMPONENT
========================================================= */

export default function EmployeeDashboardStats({
  summary,
  isLoading,
}: EmployeeDashboardStatsProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <EmployeeDashboardStatsSkeleton />;
  }

  /* =======================================================
     STATS
  ======================================================= */

  const statItems: StatItem[] = [
    {
      title: "Total Tasks",
      value: Number(
        summary?.totalTasks || 0
      ).toLocaleString("en-IN"),
      description: "All assigned tasks",
      icon: ClipboardList,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },

    {
      title: "To Do",
      value: Number(
        summary?.todoTasks || 0
      ).toLocaleString("en-IN"),
      description: "Tasks waiting to start",
      icon: ListTodo,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
    },

    {
      title: "In Progress",
      value: Number(
        summary?.inProgressTasks || 0
      ).toLocaleString("en-IN"),
      description: "Currently active tasks",
      icon: Clock3,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-700",
    },

    {
      title: "Completed",
      value: Number(
        summary?.completedTasks || 0
      ).toLocaleString("en-IN"),
      description: "Successfully completed tasks",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-700",
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                {/* Content */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {stat.value}
                  </h3>

                  <p className="mt-1.5 text-xs font-medium text-slate-500">
                    {stat.description}
                  </p>
                </div>

                {/* Icon */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}