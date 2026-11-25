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

import { ChevronDown } from "lucide-react";

import DashboardLeadsChartSkeleton from "./DashboardLeadsChartSkeleton";

import {
  ClientDashboardDailyLead,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   CHART DATA TYPE
========================================================= */

interface LeadsChartItem {
  day: string;
  leads: number;
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

const LeadsTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-slate-700">
        {label}
      </p>

      {payload.map((item: any) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-4 text-xs"
        >
          <span className="text-slate-500">
            {item.name}
          </span>

          <span className="font-semibold text-slate-900">
            {Number(
              item.value || 0
            ).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatChartDate = (
  dateString: string
): string => {
  if (!dateString) {
    return "";
  }

  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

/* =========================================================
   PROPS
========================================================= */

interface DashboardLeadsChartProps {
  dailyLeads: ClientDashboardDailyLead[];
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardLeadsChart({
  dailyLeads,
  isLoading,
}: DashboardLeadsChartProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <DashboardLeadsChartSkeleton />;
  }

  /* =======================================================
     CHART DATA
  ======================================================= */

  const leadsData: LeadsChartItem[] =
    Array.isArray(dailyLeads)
      ? dailyLeads.map(
          (
            item: ClientDashboardDailyLead
          ) => ({
            day: formatChartDate(
              item.date
            ),
            leads: Number(
              item.leads || 0
            ),
          })
        )
      : [];

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!leadsData.length) {
    return (
      <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:px-6">
        <div className="text-center">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            Daily Leads
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            No lead data available.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 pb-5 pt-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:px-6 sm:pb-6 sm:pt-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            Daily Leads
          </h3>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Leads generated from your advertising campaigns
          </p>
        </div>

        {/* Period */}
        <button
          type="button"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:px-4"
        >
          <span>7 days</span>

          <ChevronDown
            size={15}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* Chart */}
      <div className="mt-5 h-[300px] w-full sm:h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={leadsData}
            margin={{
              top: 8,
              right: 8,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient
                id="dashboardLeadsBlueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2563EB"
                  stopOpacity={0.16}
                />

                <stop
                  offset="100%"
                  stopColor="#2563EB"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#DCE3F0"
              strokeDasharray="3 4"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              domain={[0, "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              width={38}
            />

            <Tooltip
              content={<LeadsTooltip />}
              cursor={{
                stroke: "#CBD5E1",
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="leads"
              name="Total Leads"
              stroke="#30369A"
              strokeWidth={3}
              fill="url(#dashboardLeadsBlueGradient)"
              fillOpacity={1}
              dot={{
                r: 3,
                fill: "#30369A",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 5,
                fill: "#30369A",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="plainline"
              iconSize={18}
              wrapperStyle={{
                fontSize: "13px",
                color: "#334155",
                paddingTop: "12px",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}