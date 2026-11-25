"use client";

const CLIENTS = 3;

export default function ClientOverviewSkeleton() {
  return (
    <section className="w-full px-4 pt-5 sm:px-5 lg:px-6">
      <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        {/* Header */}
        <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:pt-6">
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-zinc-200" />
            <div className="h-3 w-64 rounded bg-zinc-200" />
          </div>

          <div className="h-9 w-28 rounded-lg bg-zinc-200" />
        </div>

        {/* Clients */}
        <div className="mt-5 px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {Array.from({ length: CLIENTS }).map(
              (_, index) => (
                <div
                  key={`overview-client-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  {/* Client */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-200" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-24 rounded bg-zinc-200" />
                      <div className="h-3 w-36 rounded bg-zinc-200" />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mt-4 flex gap-2">
                    <div className="h-6 w-16 rounded-md bg-zinc-200" />
                    <div className="h-6 w-20 rounded-md bg-zinc-200" />
                  </div>

                  {/* Performance */}
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map(
                      (_, metricIndex) => (
                        <div
                          key={`overview-metric-${index}-${metricIndex}`}
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