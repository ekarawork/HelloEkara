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
  { length: 42 },
  (_, index) => index
);

export default function SocialCalendarSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-5">
      {/* ========================= TOOLBAR SKELETON ========================= */}

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Month / Year */}

        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg bg-slate-200 sm:h-8 sm:w-48" />

          <div className="h-3 w-64 rounded-lg bg-slate-200 sm:h-3.5 sm:w-72" />
        </div>

        {/* Navigation */}

        <div className="flex flex-wrap items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-slate-200" />

          <div className="h-9 w-14 rounded-lg bg-slate-200" />

          <div className="h-9 w-9 rounded-lg bg-slate-200" />

          <div className="h-9 w-20 rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* ========================= FILTER SKELETON ========================= */}

      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {/* Filter Fields */}

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Platform */}

            <div className="space-y-1.5">
              <div className="h-3 w-14 rounded bg-slate-200" />

              <div className="h-9 w-full rounded-lg bg-slate-200" />
            </div>

            {/* Status */}

            <div className="space-y-1.5">
              <div className="h-3 w-12 rounded bg-slate-200" />

              <div className="h-9 w-full rounded-lg bg-slate-200" />
            </div>

            {/* Content Type */}

            <div className="space-y-1.5">
              <div className="h-3 w-20 rounded bg-slate-200" />

              <div className="h-9 w-full rounded-lg bg-slate-200" />
            </div>
          </div>

          {/* Reset */}

          <div className="h-9 w-16 shrink-0 rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* ========================= CALENDAR ========================= */}

      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="min-w-[900px]">
          {/* ========================= WEEK HEADER ========================= */}

          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="flex h-11 items-center justify-center border-r border-slate-100 last:border-r-0"
              >
                <div className="h-3 w-10 rounded bg-slate-200" />
              </div>
            ))}
          </div>

          {/* ========================= CALENDAR CELLS ========================= */}

          <div className="grid grid-cols-7">
            {CALENDAR_CELLS.map(
              (cell) => (
                <div
                  key={cell}
                  className="min-h-[130px] border-b border-r border-slate-100 p-1.5 sm:min-h-[140px] sm:p-2"
                >
                  {/* ========================= DATE ========================= */}

                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-6 w-6 rounded-full bg-slate-200 sm:h-7 sm:w-7" />
                  </div>

                  {/* ========================= POST COUNT ========================= */}

                  <div className="mb-1.5 h-2.5 w-12 rounded bg-slate-200" />

                  {/* ========================= POST PREVIEW ========================= */}

                  <div className="space-y-1.5">
                    <div className="relative w-full overflow-hidden rounded-md border border-slate-200 bg-white px-1.5 py-1.5 pl-2">
                      {/* Content Type Bar */}

                      <div className="absolute inset-y-0 left-0 w-[3px] bg-slate-200" />

                      {/* Platform + Type */}

                      <div className="flex items-center justify-between gap-1">
                        <div className="h-2.5 w-16 rounded bg-slate-200" />

                        <div className="h-3 w-10 rounded bg-slate-200" />
                      </div>

                      {/* Note */}

                      <div className="mt-1.5 h-2.5 w-full rounded bg-slate-200" />

                      <div className="mt-1 h-2.5 w-4/5 rounded bg-slate-200" />

                      {/* Status + View */}

                      <div className="mt-1.5 flex items-center justify-between gap-1">
                        <div className="h-2.5 w-12 rounded bg-slate-200" />

                        <div className="h-5 w-5 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}