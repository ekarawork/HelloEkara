"use client";

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentReminderSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <section className="rounded-xl border border-gray-200 bg-white">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 rounded bg-gray-200" />

              <div className="h-4 w-80 max-w-full rounded bg-gray-100" />
            </div>
          </div>
        </div>

        {/* =================================================
            SETTINGS
        ================================================= */}

        <div className="divide-y divide-gray-100">
          {/* Before Due */}

          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-1 gap-3">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-gray-100" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />

                  <div className="h-4 w-72 max-w-full rounded bg-gray-100" />
                </div>
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-gray-200" />
            </div>

            <div className="mt-5 ml-12 space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="h-10 w-24 rounded-lg bg-gray-100" />

                <div className="h-4 w-40 rounded bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Due Day */}

          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-1 gap-3">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-gray-100" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200" />

                  <div className="h-4 w-72 max-w-full rounded bg-gray-100" />
                </div>
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* After Due */}

          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-1 gap-3">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-gray-100" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />

                  <div className="h-4 w-72 max-w-full rounded bg-gray-100" />
                </div>
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-gray-200" />
            </div>

            <div className="mt-5 ml-12 space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="h-10 w-24 rounded-lg bg-gray-100" />

                <div className="h-4 w-40 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>
      </section>
    </div>
  );
}