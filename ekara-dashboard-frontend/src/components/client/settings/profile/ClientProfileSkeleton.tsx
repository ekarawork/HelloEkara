"use client";

/* =========================================================
   COMPONENT
========================================================= */

export default function ClientProfileSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* ===================================================
          PROFILE HEADER CARD
      =================================================== */}

      <section className="rounded-xl border border-gray-200 bg-white">
        {/* Header */}

        <div className="border-b border-gray-200 px-6 py-5">
          <div className="h-5 w-32 rounded bg-gray-200" />

          <div className="mt-2 h-4 w-72 max-w-full rounded bg-gray-100" />
        </div>

        {/* Profile */}

        <div className="px-6 py-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}

            <div className="h-20 w-20 shrink-0 rounded-full bg-gray-200" />

            {/* Profile Information */}

            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-6 w-48 max-w-full rounded bg-gray-200" />

              <div className="h-4 w-64 max-w-full rounded bg-gray-100" />
            </div>

            {/* Status */}

            <div className="h-7 w-20 rounded-full bg-gray-100" />
          </div>
        </div>
      </section>

      {/* ===================================================
          PERSONAL INFORMATION CARD
      =================================================== */}

      <section className="rounded-xl border border-gray-200 bg-white">
        {/* Header */}

        <div className="border-b border-gray-200 px-6 py-5">
          <div className="h-5 w-40 rounded bg-gray-200" />

          <div className="mt-2 h-4 w-60 max-w-full rounded bg-gray-100" />
        </div>

        {/* Form */}

        <div className="space-y-5 px-6 py-6">
          {/* First Name */}

          <div>
            <div className="mb-2 h-4 w-20 rounded bg-gray-200" />

            <div className="h-11 w-full rounded-lg bg-gray-100" />
          </div>

          {/* Last Name */}

          <div>
            <div className="mb-2 h-4 w-20 rounded bg-gray-200" />

            <div className="h-11 w-full rounded-lg bg-gray-100" />
          </div>

          {/* Email */}

          <div>
            <div className="mb-2 h-4 w-28 rounded bg-gray-200" />

            <div className="h-11 w-full rounded-lg bg-gray-100" />
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <div className="h-10 w-20 rounded-lg bg-gray-100" />

          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>
      </section>
    </div>
  );
}