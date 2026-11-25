"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import LeadsPlatformChartSkeleton from "./LeadsPlatformChartSkeleton";

/* =========================================================
   TYPES
========================================================= */

export interface LeadsPlatformChartData {
  date: string;
  meta: number;
  google: number;
}

/* =========================================================
   PROPS
========================================================= */

interface LeadsPlatformChartProps {
  data: LeadsPlatformChartData[];
  isLoading: boolean;
}

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (
  date: string
): string => {
  const parsedDate = new Date(
    `${date}T00:00:00`
  );

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
};

/* =========================================================
   TOOLTIP
========================================================= */

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
  }>;
  label?: string;
}) => {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  const meta =
    Number(
      payload.find(
        (item) =>
          item.dataKey === "meta"
      )?.value || 0
    );

  const google =
    Number(
      payload.find(
        (item) =>
          item.dataKey === "google"
      )?.value || 0
    );

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
      <p className="text-xs font-medium text-slate-500">
        {label
          ? formatDate(label)
          : ""}
      </p>

      <p className="mt-1 text-sm font-medium text-[#30369A]">
        Meta: {meta}
      </p>

      <p className="mt-1 text-sm font-medium text-[#6366F1]">
        Google: {google}
      </p>
    </div>
  );
};

/* =========================================================
   LEGEND
========================================================= */

const CustomLegend = () => {
  return (
    <div className="flex items-center justify-center gap-5 pt-2">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#30369A]" />

        <span className="text-xs font-medium text-[#30369A]">
          Meta
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#6366F1]" />

        <span className="text-xs font-medium text-[#6366F1]">
          Google
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function LeadsPlatformChart({
  data,
  isLoading,
}: LeadsPlatformChartProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <LeadsPlatformChartSkeleton />
    );
  }

  /* =======================================================
     TOTAL LEADS
  ======================================================= */

  const totalMeta = data.reduce(
    (total, item) =>
      total + Number(item.meta || 0),
    0
  );

  const totalGoogle = data.reduce(
    (total, item) =>
      total + Number(item.google || 0),
    0
  );

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!data.length) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Leads by Platform
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Meta vs Google lead contribution
            </p>
          </div>

          {/* 30 Days */}
          <button
            type="button"
            disabled
            className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-400"
          >
            30 Days
          </button>
        </div>

        {/* Empty */}
        <div className="flex h-[260px] items-center justify-center">
          <p className="text-sm text-slate-400">
            No platform leads data available.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     CHART
  ======================================================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900">
            Leads by Platform
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Meta vs Google lead contribution
          </p>
        </div>

        {/* 30 Days */}
        <button
          type="button"
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          30 Days
        </button>
      </div>

      {/* ===================================================
          CHART
      =================================================== */}

      <div className="mt-6 h-[260px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
  data={data}
  margin={{
    top: 8,
    right: 8,
    left: 0,
    bottom: 0,
  }}
>
            {/* =================================================
                META GRADIENT
            ================================================= */}

            <defs>
              <linearGradient
                id="leadsMetaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#30369A"
                  stopOpacity={0.16}
                />

                <stop
                  offset="100%"
                  stopColor="#30369A"
                  stopOpacity={0.01}
                />
              </linearGradient>

              {/* =================================================
                  GOOGLE GRADIENT
              ================================================= */}

              <linearGradient
                id="leadsGoogleGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#6366F1"
                  stopOpacity={0.12}
                />

                <stop
                  offset="100%"
                  stopColor="#6366F1"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

            {/* =================================================
                GRID
            ================================================= */}

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />

            {/* =================================================
                X AXIS
            ================================================= */}

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "#64748B",
              }}
              minTickGap={24}
            />

            {/* =================================================
                Y AXIS
            ================================================= */}

           <YAxis
  allowDecimals={false}
  axisLine={false}
  tickLine={false}
  tick={{
    fontSize: 11,
    fill: "#64748B",
  }}
  width={42}
/>

            {/* =================================================
                TOOLTIP
            ================================================= */}

            <Tooltip
              content={
                <CustomTooltip />
              }
              cursor={{
                stroke: "#CBD5E1",
                strokeDasharray: "4 4",
              }}
            />

            {/* =================================================
                META
            ================================================= */}

            <Area
              type="monotone"
              dataKey="meta"
              name="Meta"
              stroke="#30369A"
              strokeWidth={2.5}
              fill="url(#leadsMetaGradient)"
              dot={false}
              activeDot={{
                r: 4.5,
                fill: "#30369A",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />

            {/* =================================================
                GOOGLE
            ================================================= */}

            <Area
              type="monotone"
              dataKey="google"
              name="Google"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#leadsGoogleGradient)"
              dot={false}
              activeDot={{
                r: 4.5,
                fill: "#6366F1",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />

            {/* =================================================
                LEGEND
            ================================================= */}

            <Legend
              content={
                <CustomLegend />
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}