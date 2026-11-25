"use client";

import {
  CircleDollarSign,
  WalletCards,
  Clock3,
  BadgeCheck,
} from "lucide-react";

import {
  ClientPaymentDashboardSummary,
} from "@/src/types/client/payments.types";

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

interface PaymentStatCardProps {
  summary: ClientPaymentDashboardSummary | null;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentStatCard({
  summary,
}: PaymentStatCardProps) {
  /* =======================================================
     FORMAT CURRENCY
  ======================================================= */

  const formatCurrency = (
    value: number
  ): string => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;
  };

  /* =======================================================
     STATS
  ======================================================= */

  const statItems: StatItem[] = [
    {
      title: "Total Due",
      value: formatCurrency(
        summary?.totalDue || 0
      ),
      description: "Total outstanding amount",
      icon: CircleDollarSign,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
    {
      title: "Paid Amount",
      value: formatCurrency(
        summary?.paidAmount || 0
      ),
      description: "Total amount paid",
      icon: BadgeCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
    {
      title: "Due Payments",
      value: Number(
        summary?.totalDuePayments || 0
      ).toLocaleString("en-IN"),
      description: "Payments awaiting settlement",
      icon: Clock3,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
    {
      title: "Paid Payments",
      value: Number(
        summary?.totalPaidPayments || 0
      ).toLocaleString("en-IN"),
      description: "Successfully completed payments",
      icon: WalletCards,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1E3A8A]",
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      {/* Stats */}
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

                  <p className="mt-1.5 text-xs font-medium text-emerald-600">
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