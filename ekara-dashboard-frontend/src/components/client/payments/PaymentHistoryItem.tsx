"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  AlertCircle,
} from "lucide-react";

import {
  ClientPaymentHistory,
} from "@/src/types/client/payments.types";

/* =========================================================
   PROPS
========================================================= */

interface PaymentHistoryItemProps {
  payment: ClientPaymentHistory;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentHistoryItem({
  payment,
}: PaymentHistoryItemProps) {
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
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    value: string | null
  ): string => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =======================================================
     STATUS
  ======================================================= */

  const getStatusConfig = () => {
    switch (payment.status) {
      case "paid":
        return {
          label: "Paid",
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
        };

      case "overdue":
        return {
          label: "Overdue",
          className:
            "bg-red-50 text-red-700 border-red-200",
          icon: AlertCircle,
        };

      case "due":
      default:
        return {
          label: "Due",
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock3,
        };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_8px_25px_rgba(15,23,42,0.07)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="flex min-w-0 items-start gap-3">
          {/* Payment Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
            <CreditCard
              size={20}
              strokeWidth={1.8}
            />
          </div>

          {/* Payment Info */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              Payment for{" "}
              {formatDate(payment.paymentMonth)}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays
                  size={13}
                  strokeWidth={1.8}
                />
                Due:{" "}
                {formatDate(
                  payment.dueDate
                )}
              </span>

              {payment.paidAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    size={13}
                    strokeWidth={1.8}
                  />
                  Paid:{" "}
                  {formatDate(
                    payment.paidAt
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT CONTENT
        ================================================= */}

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 lg:min-w-[260px] lg:justify-end lg:border-t-0 lg:pt-0">
          {/* Amount */}
          <div className="text-left lg:text-right">
            <p className="text-xs font-medium text-slate-500">
              Amount
            </p>

            <p className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
              {formatCurrency(
                payment.amount
              )}
            </p>
          </div>

          {/* Status */}
          <div
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
          >
            <StatusIcon
              size={14}
              strokeWidth={2}
            />

            {status.label}
          </div>
        </div>
      </div>
    </div>
  );
}