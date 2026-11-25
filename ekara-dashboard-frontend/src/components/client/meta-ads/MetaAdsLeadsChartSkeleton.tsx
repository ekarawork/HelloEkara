"use client";

export default function MetaAdsLeadsChartSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {/* Title */}
          <div className="h-4 w-28 rounded bg-zinc-200" />

          {/* Subtitle */}
          <div className="h-3 w-44 rounded bg-zinc-200" />
        </div>

        {/* 30 Days */}
        <div className="h-9 w-20 shrink-0 rounded-lg bg-zinc-200" />
      </div>

      {/* ===================================================
          CHART
      =================================================== */}

      <div className="mt-6 h-[260px]">
        <div className="relative h-full w-full">
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-x-0 top-[12%] border-t border-dashed border-zinc-200" />

          <div className="absolute inset-x-0 top-[37%] border-t border-dashed border-zinc-200" />

          <div className="absolute inset-x-0 top-[62%] border-t border-dashed border-zinc-200" />

          <div className="absolute inset-x-0 top-[87%] border-t border-dashed border-zinc-200" />

          {/* Chart Line */}
          <div className="absolute inset-x-0 bottom-[13%] top-[12%] overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <polyline
                points="0,90 12,78 24,84 36,58 48,70 60,42 72,55 84,30 100,45"
                fill="none"
                stroke="#E4E4E7"
                strokeWidth="2"
              />

              {/* Soft Area */}
              <polygon
                points="0,90 12,78 24,84 36,58 48,70 60,42 72,55 84,30 100,45 100,100 0,100"
                fill="#F4F4F5"
              />
            </svg>
          </div>

          {/* X Axis Skeleton */}
          <div className="absolute bottom-[3%] left-0 h-2 w-5 rounded bg-zinc-200" />

          <div className="absolute bottom-[3%] right-0 h-2 w-5 rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}