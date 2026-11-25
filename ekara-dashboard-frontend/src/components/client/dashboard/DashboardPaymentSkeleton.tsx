"use client";

export default function DashboardPaymentSkeleton() {
  return (
    <section className="w-full animate-pulse">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-4 space-y-2">
        <div className="h-5 w-24 rounded bg-zinc-200" />

        <div className="h-3 w-56 rounded bg-zinc-200" />
      </div>

      {/* ===================================================
          CARD
      =================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
        {/* Top */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="h-11 w-11 shrink-0 rounded-xl bg-zinc-200" />

            {/* Payment Month */}
            <div className="space-y-2">
              <div className="h-2.5 w-16 rounded bg-zinc-200" />

              <div className="h-4 w-32 rounded bg-zinc-200" />
            </div>
          </div>

          {/* Status */}
          <div className="h-7 w-16 rounded-full bg-zinc-200" />
        </div>

        {/* Amount */}
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="space-y-2">
            <div className="h-2.5 w-24 rounded bg-zinc-200" />

            <div className="h-8 w-36 rounded-lg bg-zinc-200" />
          </div>
        </div>

        {/* Details */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Due Date */}
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-2.5 w-16 rounded bg-zinc-200" />

              <div className="h-4 w-24 rounded bg-zinc-200" />
            </div>
          </div>

          {/* Paid Date */}
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-2.5 w-16 rounded bg-zinc-200" />

              <div className="h-4 w-24 rounded bg-zinc-200" />
            </div>
          </div>
        </div>

        {/* Reminder */}
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-zinc-200" />

          <div className="space-y-2">
            <div className="h-2.5 w-28 rounded bg-zinc-200" />

            <div className="h-3 w-16 rounded bg-zinc-200" />
          </div>
        </div>
      </div>
    </section>
  );
}