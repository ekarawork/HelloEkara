"use client";

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentReminderSettingsSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white">
        {/* =================================================
            HEADER SKELETON
        ================================================= */}

        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-44 rounded bg-gray-200" />
              <div className="h-4 w-80 max-w-full rounded bg-gray-100" />
            </div>
          </div>
        </div>

        {/* =================================================
            SETTINGS ROWS SKELETON
        ================================================= */}

        <div className="divide-y divide-gray-100">
          {/* =================================================
              BEFORE DUE DATE
          ================================================= */}

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-lg bg-gray-200" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-36 rounded bg-gray-200" />
                  <div className="h-4 w-full max-w-xl rounded bg-gray-100" />
                  <div className="h-4 w-72 max-w-full rounded bg-gray-100" />
                </div>
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-gray-200" />
            </div>

            <div className="mt-5 ml-0 space-y-2 sm:ml-12">
              <div className="h-4 w-28 rounded bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="h-11 w-24 rounded-lg bg-gray-100" />
                <div className="h-4 w-44 rounded bg-gray-100" />
              </div>
            </div>
          </div>

          {/* =================================================
              DUE DATE
          ================================================= */}

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-lg bg-gray-200" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-4 w-full max-w-xl rounded bg-gray-100" />
                  <div className="h-4 w-80 max-w-full rounded bg-gray-100" />
                </div>
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* =================================================
              AFTER DUE DATE
          ================================================= */}

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-lg bg-gray-200" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-4 w-full max-w-xl rounded bg-gray-100" />
                  <div className="h-4 w-72 max-w-full rounded bg-gray-100" />
                </div>
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-gray-200" />
            </div>

            <div className="mt-5 ml-0 space-y-2 sm:ml-12">
              <div className="h-4 w-28 rounded bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="h-11 w-24 rounded-lg bg-gray-100" />
                <div className="h-4 w-44 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER SKELETON
        ================================================= */}

        <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>
      </section>
    </div>
  );
}