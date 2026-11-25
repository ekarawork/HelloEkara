"use client";

const TASK_ROWS = 5;

export default function EmployeeDashboardUpcomingTasksSkeleton() {
  return (
    <section className="w-full animate-pulse rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="h-5 w-40 rounded bg-zinc-200" />

        <div className="h-3 w-60 rounded bg-zinc-200" />
      </div>

      {/* Task Rows Skeleton */}
      <div className="divide-y divide-slate-100">
        {Array.from({
          length: TASK_ROWS,
        }).map((_, index) => (
          <div
            key={`upcoming-task-skeleton-${index}`}
            className="px-5 py-5 sm:px-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              {/* Main Content */}
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-3 w-20 rounded bg-zinc-200" />

                  <div className="h-5 w-14 rounded-full bg-zinc-200" />

                  <div className="h-5 w-20 rounded-full bg-zinc-200" />
                </div>

                <div className="h-4 w-3/4 rounded bg-zinc-200" />

                <div className="flex flex-wrap gap-4">
                  <div className="h-3 w-28 rounded bg-zinc-200" />

                  <div className="h-3 w-32 rounded bg-zinc-200" />

                  <div className="h-3 w-24 rounded bg-zinc-200" />
                </div>
              </div>

              {/* Progress Skeleton */}
              <div className="w-full shrink-0 space-y-2 lg:w-44">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-14 rounded bg-zinc-200" />

                  <div className="h-3 w-8 rounded bg-zinc-200" />
                </div>

                <div className="h-2 w-full rounded-full bg-zinc-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}