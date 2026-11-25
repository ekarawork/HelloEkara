"use client";

import {
  CalendarDays,
  User,
  Wallet,
  CreditCard,
  Bell,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

import type {
  Payment,
  PaymentReminderType,
} from "@/src/types/admin/payment.types";

interface PaymentDetailsProps {
  payment: Payment;
}

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (
  date: string | null | undefined
): string => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (
  date: string | null | undefined
): string => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (
  value: number | string | null | undefined
): string => {
  const amount = Number(value || 0);

  if (Number.isNaN(amount)) {
    return "₹0";
  }

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getClientInitials = (
  name: string
): string => {
  const words = name
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
};

const getReminderLabel = (
  reminderType: PaymentReminderType
): string => {
  switch (reminderType) {
    case "before":
      return "Before due date";

    case "due_day":
      return "Due day";

    case "after":
      return "After due date";

    default:
      return "Reminder";
  }
};

const getStatusLabel = (
  status: Payment["status"]
): string => {
  switch (status) {
    case "paid":
      return "Paid";

    case "overdue":
      return "Overdue";

    case "due":
      return "Due";

    default:
      return status;
  }
};

/* =========================================================
   STATUS
========================================================= */

function PaymentStatusBadge({
  status,
}: {
  status: Payment["status"];
}) {
  const config = {
    paid: {
      label: "Paid",
      className:
        "bg-emerald-50 text-emerald-600",
      icon: CheckCircle2,
    },

    due: {
      label: "Due",
      className:
        "bg-amber-50 text-amber-600",
      icon: Clock3,
    },

    overdue: {
      label: "Overdue",
      className:
        "bg-red-50 text-red-600",
      icon: AlertCircle,
    },
  } as const;

  const current = config[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${current.className}`}
    >
      <Icon
        size={12}
        strokeWidth={1.9}
      />

      {current.label}
    </span>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentDetails({
  payment,
}: PaymentDetailsProps) {
  const clientName =
    payment.client?.name?.trim() ||
    "Unknown Client";

  return (
    <div className="space-y-5">

      {/* =====================================================
          PAYMENT HEADER
      ===================================================== */}

      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">

        {/* CLIENT AVATAR */}

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0F0FF] text-sm font-semibold text-[#2E3192]">
          {getClientInitials(clientName)}
        </div>

        {/* CLIENT INFO */}

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {clientName}
          </h3>

          <p className="truncate text-xs text-slate-400">
            Payment for{" "}
            {formatDate(
              payment.payment_month
            )}
          </p>
        </div>

        {/* STATUS */}

        <div className="ml-auto shrink-0">
          <PaymentStatusBadge
            status={payment.status}
          />
        </div>
      </div>

      {/* =====================================================
          PAYMENT INFORMATION
      ===================================================== */}

      <DetailSection title="Payment Information">

        <DetailItem
          icon={<User size={15} />}
          label="Client"
          value={clientName}
        />

        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Payment month"
          value={formatDate(
            payment.payment_month
          )}
        />

        <DetailItem
          icon={<Wallet size={15} />}
          label="Amount"
          value={formatCurrency(
            payment.amount
          )}
        />

        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Due date"
          value={formatDate(
            payment.due_date
          )}
        />

        <DetailItem
          label="Payment ID"
          value={
            payment.uuid ||
            "Not available"
          }
        />

        <DetailItem
          label="Status"
          value={getStatusLabel(
            payment.status
          )}
        />

        <DetailItem
          label="Paid at"
          value={
            payment.paid_at
              ? formatDateTime(
                  payment.paid_at
                )
              : "Not paid"
          }
        />

      </DetailSection>

      {/* =====================================================
          PAYMENT SUMMARY
      ===================================================== */}

      <DetailSection title="Payment Summary">

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">

          <MetricCard
            icon={<Wallet size={15} />}
            label="Payment Amount"
            value={formatCurrency(
              payment.amount
            )}
          />

          <MetricCard
            icon={<CalendarDays size={15} />}
            label="Due Date"
            value={formatDate(
              payment.due_date
            )}
          />

          <MetricCard
            icon={<CreditCard size={15} />}
            label="Payment Status"
            value={getStatusLabel(
              payment.status
            )}
          />

          <MetricCard
            icon={<Bell size={15} />}
            label="Reminders"
            value={
              payment.enable_reminders
                ? "Enabled"
                : "Disabled"
            }
          />

        </div>
      </DetailSection>

      {/* =====================================================
          REMINDER INFORMATION
      ===================================================== */}

      <DetailSection title="Reminder Information">

        {payment.enable_reminders &&
        payment.reminders &&
        payment.reminders.length > 0 ? (
          <div className="divide-y divide-slate-50">

            {payment.reminders.map(
              (reminder) => (
                <div
                  key={
                    reminder.uuid ||
                    reminder.id
                  }
                  className="flex items-start gap-3 px-3.5 py-3"
                >

                  {/* ICON */}

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F0FF] text-[#2E3192]">
                    <Bell
                      size={15}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <p className="text-xs font-semibold text-slate-700">
                        {getReminderLabel(
                          reminder.reminder_type
                        )}
                      </p>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                          reminder.enabled
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {reminder.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </span>

                    </div>

                    {/* OFFSET */}

                    {reminder.days_offset !==
                      null &&
                      reminder.days_offset !==
                        undefined && (
                        <p className="mt-1 text-[10px] text-slate-400">
                          {reminder.reminder_type ===
                          "before"
                            ? `${reminder.days_offset} day${
                                reminder.days_offset ===
                                1
                                  ? ""
                                  : "s"
                              } before due date`
                            : reminder.reminder_type ===
                                "after"
                              ? `${reminder.days_offset} day${
                                  reminder.days_offset ===
                                  1
                                    ? ""
                                    : "s"
                                } after due date`
                              : "On the due date"}
                        </p>
                      )}

                    {/* MESSAGE */}

                    <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                      <p className="text-[10px] leading-relaxed text-slate-500">
                        {reminder.message ||
                          "No reminder message configured."}
                      </p>
                    </div>

                  </div>
                </div>
              )
            )}

          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center">
            <Bell
              size={18}
              className="mx-auto text-slate-300"
              strokeWidth={1.7}
            />

            <p className="mt-2 text-xs text-slate-400">
              No payment reminders configured.
            </p>
          </div>
        )}

      </DetailSection>

      {/* =====================================================
          REMINDER STATUS
      ===================================================== */}

      <DetailSection title="Reminder Settings">

        <DetailItem
          icon={<Bell size={15} />}
          label="Reminder system"
          value={
            payment.enable_reminders
              ? "Enabled"
              : "Disabled"
          }
        />

        <DetailItem
          label="Configured reminders"
          value={`${payment.reminders?.length || 0}`}
        />

      </DetailSection>

      {/* =====================================================
          RECORD INFORMATION
      ===================================================== */}

      <DetailSection title="Record Information">

        {payment.creator && (
          <DetailItem
            label="Created by"
            value={`${payment.creator.first_name || ""} ${
              payment.creator.last_name || ""
            }`.trim() || "Unknown"}
          />
        )}

        {payment.updater && (
          <DetailItem
            label="Updated by"
            value={`${payment.updater.first_name || ""} ${
              payment.updater.last_name || ""
            }`.trim() || "Unknown"}
          />
        )}

        <DetailItem
          label="Created at"
          value={formatDateTime(
            payment.createdAt
          )}
        />

        <DetailItem
          label="Updated at"
          value={formatDateTime(
            payment.updatedAt
          )}
        />

      </DetailSection>
    </div>
  );
}

/* =========================================================
   DETAIL SECTION
========================================================= */

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {title}
      </h4>

      <div className="space-y-0 rounded-xl border border-slate-100 bg-white">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 px-3.5 py-3 last:border-b-0">

      {icon && (
        <div className="shrink-0 text-slate-400">
          {icon}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 break-all text-xs font-medium text-slate-700">
          {value}
        </p>
      </div>

    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-[#DCDDFB] hover:bg-[#F8F8FF]">

      <div className="flex items-start gap-3">

        <div className="shrink-0 text-slate-400">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="truncate text-[10px] font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}