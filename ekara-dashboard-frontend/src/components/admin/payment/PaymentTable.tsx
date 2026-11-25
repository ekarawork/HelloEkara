"use client";

import { Ellipsis } from "lucide-react";
import { useState } from "react";

import type {
  Payment,
  PaymentStatus,
} from "@/src/types/admin/payment.types";

import PaymentActionMenu from "@/src/components/admin/payment/PaymentActionMenu";

interface PaymentTableProps {
  payments: Payment[];

  onView?: (payment: Payment) => void;

  onEdit?: (payment: Payment) => void;

  onStatusChange?: (
    payment: Payment,
    status: PaymentStatus
  ) => void | Promise<void>;

  onReminderToggle?: (
    payment: Payment
  ) => void | Promise<void>;

  onDelete?: (
    payment: Payment
  ) => void | Promise<void>;
}

export default function PaymentTable({
  payments,
  onView,
  onEdit,
  onStatusChange,
  onReminderToggle,
  onDelete,
}: PaymentTableProps) {
  const [openMenu, setOpenMenu] = useState<string | number | null>(
    null
  );

  const [menuAnchor, setMenuAnchor] =
    useState<HTMLButtonElement | null>(null);

  /* =========================================================
     CLIENT NAME
  ========================================================= */

  const getClientName = (payment: Payment): string => {
    return payment.client?.name?.trim() || "Unnamed Client";
  };

  /* =========================================================
     CLIENT INITIALS
  ========================================================= */

  const getInitials = (payment: Payment): string => {
    const name = getClientName(payment);

    const words = name
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  /* =========================================================
     PAYMENT MONTH
  ========================================================= */

  const getPaymentMonth = (payment: Payment): string => {
    if (!payment.payment_month) {
      return "-";
    }

    const date = new Date(payment.payment_month);

    if (Number.isNaN(date.getTime())) {
      return payment.payment_month;
    }

    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     DUE DATE
  ========================================================= */

  const getDueDate = (payment: Payment): string => {
    if (!payment.due_date) {
      return "-";
    }

    const date = new Date(payment.due_date);

    if (Number.isNaN(date.getTime())) {
      return payment.due_date;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     AMOUNT
  ========================================================= */

  const getAmount = (payment: Payment): string => {
    const amount = Number(payment.amount || 0);

    if (Number.isNaN(amount)) {
      return "₹0.00";
    }

    return `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /* =========================================================
     STATUS LABEL
  ========================================================= */

  const getStatusLabel = (
    status: PaymentStatus
  ): string => {
    switch (status) {
      case "due":
        return "Due";

      case "paid":
        return "Paid";

      case "overdue":
        return "Overdue";

      default:
        return "Unknown";
    }
  };

  /* =========================================================
     STATUS COLOR
  ========================================================= */

const getStatusDotClass = (
  status: PaymentStatus
): string => {
  switch (status) {
    case "due":
      return "bg-amber-500";

    case "paid":
      return "bg-green-500";

    case "overdue":
      return "bg-red-500";

    default:
      return "bg-slate-400";
  }
};

const getStatusTextClass = (
  status: PaymentStatus
): string => {
  switch (status) {
    case "due":
      return "text-amber-600";

    case "paid":
      return "text-green-600";

    case "overdue":
      return "text-red-600";

    default:
      return "text-slate-500";
  }
};

  /* =========================================================
     REMINDER COUNT
  ========================================================= */

  const getActiveReminderCount = (
    payment: Payment
  ): number => {
    if (!payment.enable_reminders) {
      return 0;
    }

    return (
      payment.reminders?.filter(
        (reminder) => reminder.enabled
      ).length || 0
    );
  };

  /* =========================================================
     REMINDER LABEL
  ========================================================= */

  const getReminderLabel = (
    payment: Payment
  ): string => {
    if (!payment.enable_reminders) {
      return "Disabled";
    }

    const activeCount =
      getActiveReminderCount(payment);

    if (activeCount === 0) {
      return "No Active";
    }

    return `${activeCount} ${
      activeCount === 1
        ? "Reminder"
        : "Reminders"
    }`;
  };

  /* =========================================================
     REMINDER COLOR
  ========================================================= */

const getReminderDotClass = (
  payment: Payment
): string => {
  if (!payment.enable_reminders) {
    return "bg-slate-400";
  }

  const activeCount =
    getActiveReminderCount(payment);

  if (activeCount === 0) {
    return "bg-amber-500";
  }

  return "bg-blue-500";
};

const getReminderTextClass = (
  payment: Payment
): string => {
  if (!payment.enable_reminders) {
    return "text-slate-500";
  }

  const activeCount =
    getActiveReminderCount(payment);

  if (activeCount === 0) {
    return "text-amber-600";
  }

  return "text-blue-600";
};

  /* =========================================================
     REMINDER ACTION LABEL
  ========================================================= */

  const getReminderActionLabel = (
    payment: Payment
  ): string => {
    if (!payment.enable_reminders) {
      return "Remind";
    }

    return "Mute";
  };

  /* =========================================================
     MENU TOGGLE
  ========================================================= */

  const handleMenuToggle = (
    paymentId: string | number,
    button: HTMLButtonElement
  ) => {
    if (openMenu === paymentId) {
      setOpenMenu(null);
      setMenuAnchor(null);
      return;
    }

    setOpenMenu(paymentId);
    setMenuAnchor(button);
  };

  /* =========================================================
     CLOSE MENU
  ========================================================= */

  const closeMenu = () => {
    setOpenMenu(null);
    setMenuAnchor(null);
  };

  /* =========================================================
     VIEW
  ========================================================= */

  const handleView = (payment: Payment) => {
    closeMenu();
    onView?.(payment);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (payment: Payment) => {
    closeMenu();
    onEdit?.(payment);
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const handleStatusChange = (
    payment: Payment,
    status: PaymentStatus
  ) => {
    closeMenu();
    onStatusChange?.(payment, status);
  };

  /* =========================================================
     REMINDER
  ========================================================= */

  const handleReminderToggle = (
    payment: Payment
  ) => {
    closeMenu();
    onReminderToggle?.(payment);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (payment: Payment) => {
    closeMenu();
    onDelete?.(payment);
  };

  return (
    <section className="mt-4 w-full">
      <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">

        {/* =====================================================
            DESKTOP TABLE
        ===================================================== */}

        <div className="hidden w-full overflow-x-auto lg:block">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-slate-100">

                {/* CLIENT */}
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Client
                </th>

                {/* PAYMENT MONTH */}
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Payment Month
                </th>

                {/* AMOUNT */}
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Amount
                </th>

                {/* DUE DATE */}
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Due Date
                </th>

                {/* STATUS */}
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Status
                </th>

                {/* REMINDERS */}
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Reminders
                </th>

                {/* ACTION */}
                <th className="w-16 px-5 py-4" />
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => {
                const paymentId =
                  payment.uuid || payment.id;

                const clientName =
                  getClientName(payment);

                return (
                  <tr
                    key={paymentId}
                    className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/50"
                  >
                    {/* =================================================
                        CLIENT
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                          {getInitials(payment)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {clientName}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {payment.client?.email ||
                              "No email information"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PAYMENT MONTH */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {getPaymentMonth(payment)}
                      </span>
                    </td>

                    {/* AMOUNT */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-800">
                        {getAmount(payment)}
                      </span>
                    </td>

                    {/* DUE DATE */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {getDueDate(payment)}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${getStatusDotClass(
                            payment.status
                          )}`}
                        />

                        <span
                          className={`text-xs font-medium ${getStatusTextClass(
                            payment.status
                          )}`}
                        >
                          {getStatusLabel(payment.status)}
                        </span>
                      </div>
                    </td>

                    {/* REMINDERS */}

                   <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${getReminderDotClass(
                            payment
                          )}`}
                        />

                        <span
                          className={`text-xs font-medium ${getReminderTextClass(
                            payment
                          )}`}
                        >
                          {getReminderLabel(payment)}
                        </span>
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td className="relative px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(event) =>
                            handleMenuToggle(
                              paymentId,
                              event.currentTarget
                            )
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 ${
                            openMenu === paymentId
                              ? "bg-[#F0F0FF] text-[#2E3192]"
                              : "hover:bg-slate-100 hover:text-slate-700"
                          }`}
                          aria-label={`Actions for ${clientName}`}
                        >
                          <Ellipsis
                            size={18}
                            strokeWidth={1.8}
                          />
                        </button>

                        {openMenu === paymentId && (
                          <PaymentActionMenu
                            payment={payment}
                            onView={handleView}
                            onEdit={handleEdit}
                            onStatusChange={
                              handleStatusChange
                            }
                            onReminderToggle={
                              handleReminderToggle
                            }
                            onDelete={handleDelete}
                            reminderActionLabel={getReminderActionLabel(
                              payment
                            )}
                            onClose={closeMenu}
                            anchorElement={menuAnchor}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            TABLET / MOBILE CARDS
        ========================================================= */}

        <div className="divide-y divide-slate-100 lg:hidden">
          {payments.map((payment) => {
            const paymentId =
              payment.uuid || payment.id;

            const clientName =
              getClientName(payment);

            return (
              <div
                key={paymentId}
                className="relative p-4 sm:p-5"
              >
                {/* TOP */}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {getInitials(payment)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {clientName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {payment.client?.email ||
                          "No email information"}
                      </p>
                    </div>
                  </div>

                  {/* MOBILE ACTIONS */}

                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={(event) =>
                        handleMenuToggle(
                          paymentId,
                          event.currentTarget
                        )
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 ${
                        openMenu === paymentId
                          ? "bg-[#F0F0FF] text-[#2E3192]"
                          : ""
                      }`}
                      aria-label={`Actions for ${clientName}`}
                    >
                      <Ellipsis
                        size={18}
                        strokeWidth={1.8}
                      />
                    </button>

                    {openMenu === paymentId && (
                      <PaymentActionMenu
                        payment={payment}
                        onView={handleView}
                        onEdit={handleEdit}
                        onStatusChange={
                          handleStatusChange
                        }
                        onReminderToggle={
                          handleReminderToggle
                        }
                        onDelete={handleDelete}
                        reminderActionLabel={getReminderActionLabel(
                          payment
                        )}
                        onClose={closeMenu}
                        anchorElement={menuAnchor}
                      />
                    )}
                  </div>
                </div>

                {/* STATUS + REMINDER */}

               <div className="mt-4 flex flex-wrap items-center gap-4">

                  {/* STATUS */}

                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${getStatusDotClass(
                        payment.status
                      )}`}
                    />

                    <span
                      className={`text-xs font-medium ${getStatusTextClass(
                        payment.status
                      )}`}
                    >
                      {getStatusLabel(payment.status)}
                    </span>
                  </div>

                  {/* REMINDER */}

                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${getReminderDotClass(
                        payment
                      )}`}
                    />

                    <span
                      className={`text-xs font-medium ${getReminderTextClass(
                        payment
                      )}`}
                    >
                      {getReminderLabel(payment)}
                    </span>
                  </div>

                </div>

                {/* PAYMENT DETAILS */}

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">

                  {/* PAYMENT MONTH */}

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Payment Month
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {getPaymentMonth(payment)}
                    </p>
                  </div>

                  {/* AMOUNT */}

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Amount
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {getAmount(payment)}
                    </p>
                  </div>

                  {/* DUE DATE */}

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Due Date
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {getDueDate(payment)}
                    </p>
                  </div>

                  {/* REMINDERS */}

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Reminders
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {payment.enable_reminders
                        ? `${
                            getActiveReminderCount(
                              payment
                            )
                          } Active`
                        : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            EMPTY STATE
        ========================================================= */}

        {payments.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-slate-600">
              No payment data found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}