"use client";

export default function PaymentReminderSkeleton() {
  return (
    <section className="w-full animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="h-11 w-11 shrink-0 rounded-xl bg-zinc-200" />

        {/* Title */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-36 rounded bg-zinc-200" />

          <div className="h-3 w-56 max-w-full rounded bg-zinc-200" />
        </div>
      </div>

      {/* =================================================
          STATUS
      ================================================= */}

      <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full bg-zinc-200" />

          {/* Status Content */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-52 max-w-full rounded bg-zinc-200" />

            <div className="h-3 w-full max-w-lg rounded bg-zinc-200" />

            <div className="h-3 w-4/5 max-w-md rounded bg-zinc-200" />
          </div>
        </div>
      </div>

      {/* =================================================
          INFO
      ================================================= */}

      <div className="mt-4 flex items-start gap-2">
        <div className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full bg-zinc-200" />

        <div className="h-3 w-56 max-w-full rounded bg-zinc-200" />
      </div>
    </section>
  );
}