"use client";

const TABLE_ROWS = 3;

export default function IndividualClientPerformanceSkeleton() {
  return (
    <section className="w-full px-4 pb-6 pt-5 sm:px-5 lg:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        {/* Header */}
        <div className="animate-pulse px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="h-5 w-48 rounded bg-zinc-200" />

          <div className="mt-2 h-3 w-80 max-w-full rounded bg-zinc-200" />
        </div>

        {/* Desktop / Tablet */}
        <div className="mt-3 hidden overflow-x-auto px-5 pb-4 sm:block sm:px-6 sm:pb-5">
          <div className="min-w-[1000px]">
            {Array.from({ length: TABLE_ROWS }).map(
              (_, row) => (
                <div
                  key={`performance-row-${row}`}
                  className={`animate-pulse grid grid-cols-[2.2fr_repeat(6,1fr)] items-center gap-6 py-4 ${
                    row !== TABLE_ROWS - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  {/* Client */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-200" />

                    <div className="min-w-0 space-y-2">
                      <div className="h-4 w-28 rounded bg-zinc-200" />
                      <div className="h-3 w-36 rounded bg-zinc-200" />
                    </div>
                  </div>

                  {/* Metrics */}
                  {Array.from({ length: 6 }).map(
                    (_, metric) => (
                      <div
                        key={`performance-metric-${row}-${metric}`}
                        className="space-y-2"
                      >
                        <div className="h-3 w-16 rounded bg-zinc-200" />
                        <div className="h-4 w-20 rounded bg-zinc-200" />
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="mt-3 px-5 pb-5 sm:hidden">
          <div className="space-y-3">
            {Array.from({ length: TABLE_ROWS }).map(
              (_, row) => (
                <div
                  key={`performance-mobile-${row}`}
                  className="animate-pulse rounded-xl border border-slate-200 bg-white p-4"
                >
                  {/* Client Header */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-200" />

                    <div className="min-w-0 space-y-2">
                      <div className="h-4 w-28 rounded bg-zinc-200" />
                      <div className="h-3 w-36 rounded bg-zinc-200" />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                    {Array.from({ length: 6 }).map(
                      (_, metric) => (
                        <div
                          key={`mobile-metric-${row}-${metric}`}
                          className="space-y-2"
                        >
                          <div className="h-3 w-16 rounded bg-zinc-200" />
                          <div className="h-4 w-20 rounded bg-zinc-200" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}