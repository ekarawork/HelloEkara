"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Bell,
  AlertCircle,
} from "lucide-react";
import DashboardPaymentSkeleton from "./DashboardPaymentSkeleton";
import {
  ClientDashboardPayment,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   PROPS
========================================================= */

interface DashboardPaymentProps {
  payment: ClientDashboardPayment | null;
  isLoading: boolean;
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
   FORMAT DATE
========================================================= */

const formatDate = (
  dateString: string | null
): string => {
  if (!dateString) {
    return "—";
  }

  const date = new Date(
    `${dateString.substring(0, 10)}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   FORMAT PAYMENT MONTH
========================================================= */

const formatPaymentMonth = (
  dateString: string
): string => {
  if (!dateString) {
    return "—";
  }

  const date = new Date(
    `${dateString.substring(0, 10)}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

/* =========================================================
   STATUS CONFIG
========================================================= */

const getStatusConfig = (
  status: ClientDashboardPayment["status"]
) => {
  switch (status) {
    case "paid":
      return {
        label: "Paid",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: CheckCircle2,
      };

    case "overdue":
      return {
        label: "Overdue",
        className:
          "bg-red-50 text-red-700 border-red-100",
        icon: AlertCircle,
      };

    case "due":
    default:
      return {
        label: "Due",
        className:
          "bg-amber-50 text-amber-700 border-amber-100",
        icon: Clock3,
      };
  }
};

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardPayment({
  payment,
  isLoading,
}: DashboardPaymentProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <DashboardPaymentSkeleton />;
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!payment) {
    return (
      <section className="w-full">
        <div className="relative flex min-h-[280px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:px-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <CreditCard
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            Payment
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-400">
            No payment information is available yet.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     STATUS
  ======================================================= */

  const statusConfig =
    getStatusConfig(payment.status);

  const StatusIcon = statusConfig.icon;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          Payment
        </h2>

        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
          Current payment and billing information
        </p>
      </div>

      {/* Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6">
        {/* Subtle Background */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-slate-100/60 blur-3xl" />

        <div className="relative">
          {/* Top */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                <CreditCard
                  size={21}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  Payment for
                </p>

                <h3 className="mt-0.5 truncate text-base font-bold text-slate-900">
                  {formatPaymentMonth(
                    payment.paymentMonth
                  )}
                </h3>
              </div>
            </div>

            {/* Status */}
            <div
              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
            >
              <StatusIcon
                size={14}
                strokeWidth={2}
              />

              <span>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-medium text-slate-400">
              Payment Amount
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {formatCurrency(payment.amount)}
            </p>
          </div>

          {/* Details */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Due Date */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <CalendarDays
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Due Date
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {formatDate(
                    payment.dueDate
                  )}
                </p>
              </div>
            </div>

            {/* Paid Date */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <CheckCircle2
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Paid Date
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {formatDate(
                    payment.paidAt
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Bell
                size={15}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">
                Payment reminders
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-800">
                {payment.remindersEnabled
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}