"use client";

export default function DailyPerformanceChartsSkeleton() {
  return (
    <section className="w-full px-4 pt-5 sm:px-5 lg:px-6">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Leads Chart */}
        <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-zinc-200" />
              <div className="h-3 w-44 rounded bg-zinc-200" />
            </div>

            <div className="h-9 w-20 rounded-lg bg-zinc-200" />
          </div>

          {/* Chart */}
          <div className="mt-6 h-[260px]">
            <div className="flex h-full items-end gap-3">
              {[42, 65, 50, 78, 58, 88, 68].map(
                (height, index) => (
                  <div
                    key={`lead-bar-${index}`}
                    className="flex h-full flex-1 items-end"
                  >
                    <div
                      className="w-full rounded-t-md bg-zinc-200"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Ad Spend Chart */}
        <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-zinc-200" />
              <div className="h-3 w-48 rounded bg-zinc-200" />
            </div>

            <div className="h-9 w-20 rounded-lg bg-zinc-200" />
          </div>

          {/* Chart */}
          <div className="mt-6 h-[260px]">
            <div className="flex h-full items-end gap-3">
              {[55, 72, 45, 82, 62, 90, 70].map(
                (height, index) => (
                  <div
                    key={`spend-bar-${index}`}
                    className="flex h-full flex-1 items-end"
                  >
                    <div
                      className="w-full rounded-t-md bg-zinc-200"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}