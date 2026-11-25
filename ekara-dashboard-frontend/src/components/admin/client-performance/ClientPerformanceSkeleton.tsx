"use client";

const TABLE_ROWS = 8;

export default function ClientPerformanceSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* ========================= HEADER SKELETON ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-zinc-200" />
          <div className="h-4 w-80 rounded-lg bg-zinc-200" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <div className="h-10 w-28 rounded-lg bg-zinc-200" />
          <div className="h-10 w-40 rounded-lg bg-zinc-200" />
        </div>
      </div>

      {/* ========================= DASHBOARD STATS ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Leads */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-zinc-200" />
              <div className="h-7 w-20 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5 h-3 w-32 rounded bg-zinc-200" />
        </div>

        {/* Spend */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-zinc-200" />
              <div className="h-7 w-24 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5 h-3 w-32 rounded bg-zinc-200" />
        </div>

        {/* Impressions */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-zinc-200" />
              <div className="h-7 w-24 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5 h-3 w-32 rounded bg-zinc-200" />
        </div>

        {/* Clicks */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />

            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-zinc-200" />
              <div className="h-7 w-20 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5 h-3 w-32 rounded bg-zinc-200" />
        </div>
      </div>

      {/* ========================= DAILY LEADS CHART ========================= */}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        {/* Chart Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="h-5 w-28 rounded bg-zinc-200" />
            <div className="h-3 w-44 rounded bg-zinc-200" />
          </div>

          {/* 30 Days Filter */}
          <div className="h-10 w-24 rounded-lg bg-zinc-200" />
        </div>

        {/* Chart */}
        <div className="mt-6 h-[280px] w-full">
          {/* Y Axis */}
          <div className="flex h-full">
            <div className="flex w-10 flex-col justify-between py-1">
              <div className="h-3 w-7 rounded bg-zinc-200" />
              <div className="h-3 w-7 rounded bg-zinc-200" />
              <div className="h-3 w-7 rounded bg-zinc-200" />
              <div className="h-3 w-7 rounded bg-zinc-200" />
              <div className="h-3 w-7 rounded bg-zinc-200" />
            </div>

            {/* Chart Area */}
            <div className="relative flex-1">
              {/* Horizontal Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-1">
                <div className="border-t border-dashed border-zinc-200" />
                <div className="border-t border-dashed border-zinc-200" />
                <div className="border-t border-dashed border-zinc-200" />
                <div className="border-t border-dashed border-zinc-200" />
                <div className="border-t border-dashed border-zinc-200" />
              </div>

              {/* Fake Chart Area */}
              <div className="absolute inset-x-0 bottom-0 top-4 overflow-hidden">
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[65%]
                    w-full
                    rounded-t-[50%]
                    bg-zinc-200/70
                  "
                />

                {/* Fake Line */}
                <div className="absolute bottom-[65%] left-0 right-0 h-1 rounded-full bg-zinc-200" />
              </div>
            </div>
          </div>

          {/* X Axis */}
          <div className="ml-10 mt-3 flex justify-between">
            <div className="h-3 w-6 rounded bg-zinc-200" />
            <div className="h-3 w-6 rounded bg-zinc-200" />
            <div className="h-3 w-6 rounded bg-zinc-200" />
            <div className="h-3 w-6 rounded bg-zinc-200" />
            <div className="h-3 w-6 rounded bg-zinc-200" />
          </div>
        </div>
      </div>

      {/* ========================= SEARCH + FILTER ========================= */}

      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search / Client Filter */}
        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[295px]" />

        {/* Service Filter */}
        <div className="h-11 w-full rounded-lg bg-zinc-200 sm:max-w-[220px]" />

        {/* Date Filter */}
        <div className="h-11 w-full flex-1 rounded-lg bg-zinc-200" />
      </div>

      {/* ========================= TABLE SKELETON ========================= */}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {/* TABLE HEADER */}
        <div className="hidden border-b border-zinc-200 px-5 py-4 lg:grid lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_64px] lg:items-center lg:gap-4">
          {/* Client */}
          <div className="h-3 w-16 rounded bg-zinc-200" />

          {/* Service */}
          <div className="h-3 w-20 rounded bg-zinc-200" />

          {/* Date */}
          <div className="h-3 w-16 rounded bg-zinc-200" />

          {/* Spend */}
          <div className="h-3 w-16 rounded bg-zinc-200" />

          {/* Impressions */}
          <div className="h-3 w-20 rounded bg-zinc-200" />

          {/* Leads */}
          <div className="h-3 w-14 rounded bg-zinc-200" />

          {/* Actions */}
          <div className="h-3 w-8 rounded bg-zinc-200" />
        </div>

        {/* TABLE ROWS */}
        {Array.from({ length: TABLE_ROWS }).map((_, row) => (
          <div
            key={`performance-row-${row}`}
            className="border-b border-zinc-200 last:border-b-0"
          >
            {/* DESKTOP ROW */}
            <div className="hidden px-5 py-4 lg:grid lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_64px] lg:items-center lg:gap-4">
              {/* Client */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-200" />

                <div className="min-w-0 space-y-2">
                  <div className="h-4 w-28 rounded bg-zinc-200" />
                  <div className="h-3 w-36 rounded bg-zinc-200" />
                </div>
              </div>

              {/* Service */}
              <div>
                <div className="h-6 w-24 rounded-md bg-zinc-200" />
              </div>

              {/* Date */}
              <div className="h-4 w-20 rounded bg-zinc-200" />

              {/* Daily Spend */}
              <div className="h-4 w-20 rounded bg-zinc-200" />

              {/* Impressions */}
              <div className="h-4 w-24 rounded bg-zinc-200" />

              {/* Leads */}
              <div className="h-4 w-14 rounded bg-zinc-200" />

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

              {/* Service */}
              <div className="mt-4 space-y-2">
                <div className="h-3 w-16 rounded bg-zinc-200" />
                <div className="h-6 w-24 rounded-md bg-zinc-200" />
              </div>

              {/* Performance Details */}
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {/* Date */}
                <div className="space-y-2">
                  <div className="h-3 w-12 rounded bg-zinc-200" />
                  <div className="h-4 w-20 rounded bg-zinc-200" />
                </div>

                {/* Daily Spend */}
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-zinc-200" />
                  <div className="h-4 w-20 rounded bg-zinc-200" />
                </div>

                {/* Impressions */}
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-zinc-200" />
                  <div className="h-4 w-24 rounded bg-zinc-200" />
                </div>

                {/* Clicks */}
                <div className="space-y-2">
                  <div className="h-3 w-14 rounded bg-zinc-200" />
                  <div className="h-4 w-16 rounded bg-zinc-200" />
                </div>

                {/* Leads */}
                <div className="space-y-2">
                  <div className="h-3 w-14 rounded bg-zinc-200" />
                  <div className="h-4 w-14 rounded bg-zinc-200" />
                </div>

                {/* Edit Count */}
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-zinc-200" />
                  <div className="h-4 w-14 rounded bg-zinc-200" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* OPTIONAL EMPTY / FOOTER AREA */}
        <div className="hidden px-5 py-4 lg:block">
          <div className="h-3 w-32 rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}