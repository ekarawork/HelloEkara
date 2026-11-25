"use client";

import {
  CircleCheck,
  Clock3,
} from "lucide-react";

import type {
  Payment,
} from "@/src/types/admin/payment.types";

interface PaymentDashboardStatsProps {
  payments: Payment[];
  isLoading?: boolean;
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-IN").format(value);
};

const formatAmount = (value: number): string => {
  return `₹${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
};

export default function PaymentDashboardStats({
  payments,
  isLoading = false,
}: PaymentDashboardStatsProps) {
  /* =========================================================
     CALCULATE STATS
  ========================================================= */

  const totalDue = payments
    .filter(
      (payment) =>
        payment.status === "due" ||
        payment.status === "overdue"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount ?? 0),
      0
    );

  const paidAmount = payments
    .filter(
      (payment) =>
        payment.status === "paid"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount ?? 0),
      0
    );

  const totalDuePayments = payments.filter(
    (payment) =>
      payment.status === "due" ||
      payment.status === "overdue"
  ).length;

  const totalPaidPayments = payments.filter(
    (payment) =>
      payment.status === "paid"
  ).length;

  /* =========================================================
     STAT CARDS
  ========================================================= */

  const statCards = [
    {
      title: "Total Due",
      value: formatAmount(totalDue),
      count: totalDuePayments,
      icon: Clock3,
      iconClass:
        "bg-amber-50 text-amber-600",
    },
    {
      title: "Paid",
      value: formatAmount(paidAmount),
      count: totalPaidPayments,
      icon: CircleCheck,
      iconClass:
        "bg-emerald-50 text-emerald-600",
    },
  ];

  /* =========================================================
     LOADING SKELETON
  ========================================================= */

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              sm:p-5
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  h-10
                  w-10
                  shrink-0
                  animate-pulse
                  rounded-xl
                  bg-slate-100
                "
              />

              <div className="min-w-0 flex-1">
                <div
                  className="
                    h-4
                    w-24
                    animate-pulse
                    rounded
                    bg-slate-100
                  "
                />

                <div
                  className="
                    mt-2
                    h-8
                    w-32
                    animate-pulse
                    rounded
                    bg-slate-100
                  "
                />

                <div
                  className="
                    mt-2
                    h-4
                    w-20
                    animate-pulse
                    rounded
                    bg-slate-100
                  "
                />
              </div>
            </div>

            <div
              className="
                mt-5
                h-3
                w-40
                animate-pulse
                rounded
                bg-slate-100
              "
            />
          </div>
        ))}
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-[0_4px_20px_rgba(15,23,42,0.03)]
              sm:p-5
            "
          >
            <div className="flex items-start gap-3">
              {/* =================================================
                  ICON
              ================================================= */}

              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${stat.iconClass}
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {formatNumber(stat.count)}{" "}
                  {stat.count === 1
                    ? "payment"
                    : "payments"}
                </p>
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <p className="mt-5 text-xs font-medium text-slate-400">
              Based on current payment records
            </p>
          </div>
        );
      })}
    </div>
  );
}