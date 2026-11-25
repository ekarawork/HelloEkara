"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ClientLeadsDailyLead,
} from "@/src/types/client/leads.types";

import LeadsDailyChartSkeleton from "./LeadsDailyChartSkeleton";

/* =========================================================
   PROPS
========================================================= */

interface LeadsDailyChartProps {
  data: ClientLeadsDailyLead[];
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

  if (Number.isNaN(parsedDate.getTime())) {
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

  const leads = Number(
    payload[0]?.value || 0
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-medium text-slate-500">
        {label
          ? formatDate(label)
          : ""}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {leads}{" "}
        {leads === 1
          ? "Lead"
          : "Leads"}
      </p>
    </div>
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function LeadsDailyChart({
  data,
  isLoading,
}: LeadsDailyChartProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <LeadsDailyChartSkeleton />;
  }

  /* =======================================================
     TOTAL LEADS
  ======================================================= */

  const totalLeads = data.reduce(
    (total, item) =>
      total + Number(item.leads || 0),
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
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Daily Leads
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Leads generated over time
            </p>
          </div>

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
            No leads data available.
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
            Daily Leads
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {totalLeads}{" "}
            {totalLeads === 1
              ? "lead"
              : "leads"}{" "}
            generated
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
            <defs>
              <linearGradient
                id="leadsDailyGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#30369A"
                  stopOpacity={0.28}
                />

                <stop
                  offset="100%"
                  stopColor="#30369A"
                  stopOpacity={0.03}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />

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

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#CBD5E1",
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="leads"
              stroke="#30369A"
              strokeWidth={2.5}
              fill="url(#leadsDailyGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#30369A",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}