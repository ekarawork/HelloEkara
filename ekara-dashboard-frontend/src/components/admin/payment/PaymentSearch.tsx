"use client";

import { Plus, Search } from "lucide-react";
import type { PaymentStatus } from "@/src/types/admin/payment.types";

interface PaymentSearchProps {
  search: string;
  status: PaymentStatus | "";

  onAddPayment?: () => void;
  onSearch?: (value: string) => void;
  onStatusChange?: (
    value: PaymentStatus | ""
  ) => void;
  onRefresh?: () => void;
}

const statusOptions = [
  {
    value: "due",
    label: "Due",
  },
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "overdue",
    label: "Overdue",
  },
];

export default function PaymentSearch({
  search,
  status,
  onAddPayment,
  onSearch,
  onStatusChange,
}: PaymentSearchProps) {
  return (
    <section className="w-full">
      {/* =========================================================
         HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* HEADING */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Payments
          </h1>

          <p className="mt-1.5 text-sm text-slate-500 sm:text-[15px]">
            Track invoices, paid/due status and reminders.
          </p>
        </div>

        {/* ADD PAYMENT */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddPayment}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2E3192] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98]"
          >
            <Plus
              size={17}
              strokeWidth={2}
            />

            <span>Add payment</span>
          </button>
        </div>
      </div>

      {/* =========================================================
         SEARCH + FILTERS
      ========================================================= */}

      <div className="mt-7 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* SEARCH CLIENT */}
          <div className="relative w-full sm:max-w-[295px]">
            <Search
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                onSearch?.(event.target.value);
              }}
              placeholder="Search clients..."
              autoComplete="off"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="relative min-w-0 flex-1">
            <select
              value={status}
              onChange={(event) => {
                  onStatusChange?.(
                    event.target.value as PaymentStatus | ""
                  );
                }}
              className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition-all focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
            >
              <option value="">
                All Statuses
              </option>

              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* DROPDOWN ICON */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}