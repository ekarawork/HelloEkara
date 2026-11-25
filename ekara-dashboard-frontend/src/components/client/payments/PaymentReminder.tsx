"use client";

import {
  Bell,
  BellOff,
  CheckCircle2,
  Info,
} from "lucide-react";

import PaymentReminderSkeleton from "./PaymentReminderSkeleton";

import {
  ClientPaymentHistory,
} from "@/src/types/client/payments.types";

/* =========================================================
   PROPS
========================================================= */

interface PaymentReminderProps {
  payments: ClientPaymentHistory[];
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentReminder({
  payments,
  isLoading,
}: PaymentReminderProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <PaymentReminderSkeleton />;
  }

  /* =======================================================
     REMINDER STATUS
  ======================================================= */

  const remindersEnabled =
    payments.some(
      (payment) =>
        payment.remindersEnabled
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            remindersEnabled
              ? "bg-blue-50 text-[#1E3A8A]"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {remindersEnabled ? (
            <Bell
              size={21}
              strokeWidth={1.8}
            />
          ) : (
            <BellOff
              size={21}
              strokeWidth={1.8}
            />
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Payment Reminders
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Stay updated about your payment
            due dates.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
        <div className="flex items-start gap-3">
          {remindersEnabled ? (
            <CheckCircle2
              className="mt-0.5 shrink-0 text-emerald-600"
              size={18}
              strokeWidth={1.9}
            />
          ) : (
            <Info
              className="mt-0.5 shrink-0 text-slate-500"
              size={18}
              strokeWidth={1.9}
            />
          )}

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {remindersEnabled
                ? "Payment reminders are enabled"
                : "Payment reminders are not enabled"}
            </p>

            <p className="mt-1 text-xs leading-5 font-medium text-slate-500">
              {remindersEnabled
                ? "You may receive payment reminders according to the reminder schedule configured for your payments."
                : "No payment reminder is currently enabled for your available payment records."}
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 flex items-start gap-2 text-xs font-medium text-slate-500">
        <Info
          className="mt-0.5 shrink-0"
          size={14}
          strokeWidth={1.8}
        />

        <p>
          Reminder settings are managed by the
          administrator.
        </p>
      </div>
    </section>
  );
}