"use client";

const PROGRESS_CARDS = 2;

export default function ClientProgressSkeleton() {
  return (
    <section className="w-full animate-pulse">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-4 space-y-2">
        <div className="h-5 w-32 rounded bg-zinc-200" />

        <div className="h-3 w-64 rounded bg-zinc-200" />
      </div>

      {/* ===================================================
          CARDS
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({
          length: PROGRESS_CARDS,
        }).map((_, index) => (
          <div
            key={`client-progress-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {/* Icon */}
                <div className="h-11 w-11 shrink-0 rounded-xl bg-zinc-200" />

                {/* Title */}
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-zinc-200" />

                  <div className="h-3 w-40 rounded bg-zinc-200" />
                </div>
              </div>

              {/* Percentage */}
              <div className="space-y-1 text-right">
                <div className="ml-auto h-5 w-10 rounded bg-zinc-200" />

                <div className="ml-auto h-2.5 w-8 rounded bg-zinc-200" />
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 h-2.5 w-full rounded-full bg-zinc-200" />

            {/* Amounts */}
            <div className="mt-3 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-2.5 w-12 rounded bg-zinc-200" />

                <div className="h-4 w-24 rounded bg-zinc-200" />
              </div>

              <div className="space-y-2 text-right">
                <div className="ml-auto h-2.5 w-12 rounded bg-zinc-200" />

                <div className="ml-auto h-4 w-24 rounded bg-zinc-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}