"use client";

const TABLE_ROWS = 8;

export default function ClientSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-lg bg-zinc-200" />
          <div className="h-4 w-72 rounded-lg bg-zinc-200" />
        </div>

        {/* Add Client Button */}
        <div className="h-10 w-32 rounded-lg bg-zinc-200" />
      </div>

      {/* SEARCH + FILTER SKELETON */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[295px]" />

        {/* Filter */}
        <div className="h-11 w-full flex-1 rounded-lg bg-zinc-200" />
      </div>

      {/* TABLE SKELETON */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {/* TABLE HEADER */}
        <div className="hidden border-b border-zinc-200 px-5 py-4 lg:grid lg:grid-cols-[2fr_2fr_1fr_1fr_64px] lg:items-center lg:gap-4">
          {/* Client */}
          <div className="h-3 w-16 rounded bg-zinc-200" />

          {/* Services */}
          <div className="h-3 w-20 rounded bg-zinc-200" />

          {/* Status */}
          <div className="h-3 w-16 rounded bg-zinc-200" />

          {/* Monthly Fee */}
          <div className="h-3 w-24 rounded bg-zinc-200" />

          {/* Actions */}
          <div className="h-3 w-8 rounded bg-zinc-200" />
        </div>

        {/* TABLE ROWS */}
        {Array.from({ length: TABLE_ROWS }).map((_, row) => (
          <div
            key={`client-row-${row}`}
            className="border-b border-zinc-200 last:border-b-0"
          >
            {/* DESKTOP ROW */}
            <div className="hidden px-5 py-4 lg:grid lg:grid-cols-[2fr_2fr_1fr_1fr_64px] lg:items-center lg:gap-4">
              {/* Client */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-200" />

                <div className="min-w-0 space-y-2">
                  <div className="h-4 w-28 rounded bg-zinc-200" />
                  <div className="h-3 w-36 rounded bg-zinc-200" />
                </div>
              </div>

              {/* Services */}
              <div className="flex gap-1.5">
                <div className="h-6 w-16 rounded-md bg-zinc-200" />
                <div className="h-6 w-20 rounded-md bg-zinc-200" />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                <div className="h-3 w-12 rounded bg-zinc-200" />
              </div>

              {/* Monthly Fee */}
              <div className="h-4 w-20 rounded bg-zinc-200" />

              {/* Actions */}
              <div className="flex justify-end">
                <div className="h-9 w-9 rounded-lg bg-zinc-200" />
              </div>
            </div>

            {/* MOBILE / TABLET CARD */}
            <div className="p-4 sm:p-5 lg:hidden">
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-200" />

                  <div className="min-w-0 space-y-2">
                    <div className="h-4 w-28 rounded bg-zinc-200" />
                    <div className="h-3 w-36 rounded bg-zinc-200" />
                  </div>
                </div>

                {/* Action */}
                <div className="h-9 w-9 shrink-0 rounded-lg bg-zinc-200" />
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {/* Services */}
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-zinc-200" />

                  <div className="flex gap-1.5">
                    <div className="h-6 w-16 rounded-md bg-zinc-200" />
                    <div className="h-6 w-20 rounded-md bg-zinc-200" />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <div className="h-3 w-14 rounded bg-zinc-200" />

                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                    <div className="h-3 w-12 rounded bg-zinc-200" />
                  </div>
                </div>

                {/* Monthly Fee */}
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-zinc-200" />
                  <div className="h-4 w-20 rounded bg-zinc-200" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}