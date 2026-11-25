"use client";

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const CALENDAR_CELLS = Array.from(
  { length: 35 },
  (_, index) => index
);

export default function SocialCalendarSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* ========================= CALENDAR HEADER ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Month / Year */}

        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-zinc-200" />

          <div className="h-4 w-32 rounded-lg bg-zinc-200" />
        </div>

        {/* Navigation */}

        <div className="flex items-center gap-3">
          <div className="h-10 w-24 rounded-lg bg-zinc-200" />

          <div className="h-10 w-10 rounded-lg bg-zinc-200" />

          <div className="h-10 w-10 rounded-lg bg-zinc-200" />

          <div className="h-10 w-24 rounded-lg bg-zinc-200" />
        </div>
      </div>

      {/* ========================= FILTER SKELETON ========================= */}

      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Client Filter */}

        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[295px]" />

        {/* Platform Filter */}

        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[220px]" />

        {/* Status Filter */}

        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[220px]" />

        {/* Content Type Filter */}

        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[220px]" />
      </div>

      {/* ========================= CALENDAR ========================= */}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {/* WEEK HEADER */}

        <div className="grid grid-cols-7 border-b border-zinc-200">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="flex h-11 items-center justify-center border-r border-zinc-200 last:border-r-0"
            >
              <div className="h-3 w-10 rounded bg-zinc-200" />
            </div>
          ))}
        </div>

        {/* CALENDAR CELLS */}

        <div className="grid grid-cols-7">
          {CALENDAR_CELLS.map((cell) => (
            <div
              key={cell}
              className="
                min-h-[130px]
                border-b
                border-r
                border-zinc-200
                p-3
                last:border-r-0
                sm:min-h-[150px]
              "
            >
              {/* DATE NUMBER */}

              <div className="mb-3 flex justify-end">
                <div className="h-7 w-7 rounded-full bg-zinc-200" />
              </div>

              {/* POST CARD */}

              <div className="space-y-2">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  {/* Platform + Action */}

                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="h-3 w-20 rounded bg-zinc-200" />

                    <div className="h-4 w-4 rounded bg-zinc-200" />
                  </div>

                  {/* Content */}

                  <div className="h-3 w-full rounded bg-zinc-200" />

                  <div className="mt-2 h-3 w-4/5 rounded bg-zinc-200" />

                  <div className="mt-2 h-3 w-3/5 rounded bg-zinc-200" />

                  {/* Status */}

                  <div className="mt-3 h-5 w-16 rounded-full bg-zinc-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================= LEGEND SKELETON ========================= */}

      <div className="flex flex-wrap items-center gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2"
          >
            <div className="h-3 w-3 rounded-full bg-zinc-200" />

            <div className="h-3 w-20 rounded bg-zinc-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
