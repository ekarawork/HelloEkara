"use client";

import PaymentHistoryItem from "./PaymentHistoryItem";
import PaymentHistorySkeleton from "./PaymentHistorySkeleton";

import {
  ClientPaymentHistory,
} from "@/src/types/client/payments.types";

/* =========================================================
   PROPS
========================================================= */

interface PaymentHistoryProps {
  payments: ClientPaymentHistory[];
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentHistory({
  payments,
  isLoading,
}: PaymentHistoryProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <PaymentHistorySkeleton />;
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!payments.length) {
    return (
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                width="18"
                height="18"
                x="3"
                y="3"
                rx="2"
              />
              <path d="M8 12h8" />
              <path d="M8 8h8" />
              <path d="M8 16h5" />
            </svg>
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No payment history
          </h3>

          <p className="mt-1 max-w-sm text-xs font-medium text-slate-500">
            Your payment records will appear
            here once payments are added.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Payment History
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-500">
            View your recent payment records
          </p>
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
          {payments.length}{" "}
          {payments.length === 1
            ? "Payment"
            : "Payments"}
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {payments.map((payment) => (
          <PaymentHistoryItem
            key={payment.uuid}
            payment={payment}
          />
        ))}
      </div>
    </section>
  );
}