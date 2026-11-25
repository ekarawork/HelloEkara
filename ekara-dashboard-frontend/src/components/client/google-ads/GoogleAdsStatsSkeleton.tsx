"use client";

const STAT_CARDS = 4;

export default function GoogleAdsStatsSkeleton() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: STAT_CARDS }).map(
          (_, index) => (
            <div
              key={`google-ads-stat-${index}`}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-3 w-24 rounded bg-zinc-200" />

                  <div className="h-7 w-32 rounded-lg bg-zinc-200" />

                  <div className="h-3 w-40 rounded bg-zinc-200" />
                </div>

                {/* Icon */}
                <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}