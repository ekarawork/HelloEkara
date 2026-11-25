"use client";

export default function MetaAdsSpendChartSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-zinc-200" />

          <div className="h-3 w-48 rounded bg-zinc-200" />
        </div>

        {/* 7 Days */}
        <div className="h-9 w-20 shrink-0 rounded-lg bg-zinc-200" />
      </div>

      {/* Chart */}
      <div className="mt-6 h-[260px]">
        <div className="flex h-full items-end gap-3">
          {[52, 68, 44, 78, 60, 88, 70].map(
            (height, index) => (
              <div
                key={`meta-spend-${index}`}
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
  );
}