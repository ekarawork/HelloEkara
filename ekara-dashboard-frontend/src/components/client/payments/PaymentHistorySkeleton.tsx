"use client";

const HISTORY_ITEMS = 5;

export default function PaymentHistorySkeleton() {
  return (
    <section className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-zinc-200" />

          <div className="h-3 w-48 rounded bg-zinc-200" />
        </div>

        <div className="h-7 w-24 rounded-full bg-zinc-200" />
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {Array.from({
          length: HISTORY_ITEMS,
        }).map((_, index) => (
          <div
            key={`payment-history-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-zinc-200" />

                <div className="space-y-2.5">
                  <div className="h-4 w-44 rounded bg-zinc-200" />

                  <div className="h-3 w-56 rounded bg-zinc-200" />
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 lg:min-w-[260px] lg:justify-end lg:border-t-0 lg:pt-0">
                <div className="space-y-2">
                  <div className="h-3 w-12 rounded bg-zinc-200" />

                  <div className="h-5 w-24 rounded bg-zinc-200" />
                </div>

                <div className="h-7 w-20 rounded-full bg-zinc-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}