"use client";

const TABLE_ROWS = 8;

export default function PaymentSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* ========================= HEADER SKELETON ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-lg bg-zinc-200" />

          <div className="h-4 w-80 rounded-lg bg-zinc-200" />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          {/* Trash */}
          <div className="h-10 w-10 rounded-lg bg-zinc-200" />

          {/* Add Payment */}
          <div className="h-10 w-36 rounded-lg bg-zinc-200" />
        </div>
      </div>

      {/* ========================= PAYMENT STATS ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Payments */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-zinc-200" />
              <div className="h-7 w-20 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5 h-3 w-32 rounded bg-zinc-200" />
        </div>

        {/* Total Amount */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-zinc-200" />
              <div className="h-7 w-28 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5 h-3 w-32 rounded bg-zinc-200" />
        </div>

        {/* Due */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-zinc-200" />
              <div className="h-7 w-20 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5 h-3 w-32 rounded bg-zinc-200" />
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-zinc-200" />
              <div className="h-7 w-20 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5 h-3 w-32 rounded bg-zinc-200" />
        </div>
      </div>

      {/* ========================= SEARCH + FILTER ========================= */}

      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[295px]" />

        {/* Status Filter */}
        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[220px]" />
      </div>

      {/* ========================= TABLE SKELETON ========================= */}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {/* ========================= TABLE HEADER ========================= */}

        <div className="hidden border-b border-zinc-200 px-5 py-4 lg:grid lg:grid-cols-[2fr_1.2fr_1fr_1fr_1fr_64px] lg:items-center lg:gap-4">
          {/* Client */}
          <div className="h-3 w-16 rounded bg-zinc-200" />

          {/* Payment Month */}
          <div className="h-3 w-24 rounded bg-zinc-200" />

          {/* Amount */}
          <div className="h-3 w-16 rounded bg-zinc-200" />

          {/* Due Date */}
          <div className="h-3 w-20 rounded bg-zinc-200" />

          {/* Status */}
          <div className="h-3 w-14 rounded bg-zinc-200" />

          {/* Actions */}
          <div className="h-3 w-8 rounded bg-zinc-200" />
        </div>

        {/* ========================= TABLE ROWS ========================= */}

        {Array.from({ length: TABLE_ROWS }).map((_, row) => (
          <div
            key={`payment-row-${row}`}
            className="border-b border-zinc-200 last:border-b-0"
          >
            {/* ========================= DESKTOP ROW ========================= */}

            <div className="hidden px-5 py-4 lg:grid lg:grid-cols-[2fr_1.2fr_1fr_1fr_1fr_64px] lg:items-center lg:gap-4">
              {/* CLIENT */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-200" />

                <div className="min-w-0 space-y-2">
                  <div className="h-4 w-28 rounded bg-zinc-200" />

                  <div className="h-3 w-36 rounded bg-zinc-200" />
                </div>
              </div>

              {/* PAYMENT MONTH */}
              <div className="h-4 w-24 rounded bg-zinc-200" />

              {/* AMOUNT */}
              <div className="h-4 w-20 rounded bg-zinc-200" />

              {/* DUE DATE */}
              <div className="h-4 w-20 rounded bg-zinc-200" />

              {/* STATUS */}
              <div className="h-6 w-20 rounded-md bg-zinc-200" />

              {/* ACTIONS */}
              <div className="flex justify-end">
                <div className="h-9 w-9 rounded-lg bg-zinc-200" />
              </div>
            </div>

            {/* ========================= MOBILE / TABLET CARD ========================= */}

            <div className="p-4 sm:p-5 lg:hidden">
              {/* TOP */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-200" />

                  <div className="min-w-0 space-y-2">
                    <div className="h-4 w-28 rounded bg-zinc-200" />

                    <div className="h-3 w-36 rounded bg-zinc-200" />
                  </div>
                </div>

                {/* ACTION */}
                <div className="h-9 w-9 shrink-0 rounded-lg bg-zinc-200" />
              </div>

              {/* PAYMENT MONTH */}
              <div className="mt-4 space-y-2">
                <div className="h-3 w-24 rounded bg-zinc-200" />

                <div className="h-4 w-24 rounded bg-zinc-200" />
              </div>

              {/* PAYMENT DETAILS */}
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* AMOUNT */}
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-zinc-200" />

                  <div className="h-4 w-20 rounded bg-zinc-200" />
                </div>

                {/* DUE DATE */}
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-zinc-200" />

                  <div className="h-4 w-20 rounded bg-zinc-200" />
                </div>

                {/* STATUS */}
                <div className="space-y-2">
                  <div className="h-3 w-14 rounded bg-zinc-200" />

                  <div className="h-6 w-20 rounded-md bg-zinc-200" />
                </div>

                {/* REMINDERS */}
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-zinc-200" />

                  <div className="h-4 w-16 rounded bg-zinc-200" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ========================= FOOTER / PAGINATION ========================= */}

        <div className="flex items-center justify-center gap-1.5 px-5 py-4">
          <div className="h-8 w-8 rounded-lg bg-zinc-200" />

          <div className="h-8 w-8 rounded-lg bg-zinc-200" />

          <div className="h-8 w-8 rounded-lg bg-zinc-200" />

          <div className="h-8 w-8 rounded-lg bg-zinc-200" />

          <div className="h-8 w-8 rounded-lg bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}