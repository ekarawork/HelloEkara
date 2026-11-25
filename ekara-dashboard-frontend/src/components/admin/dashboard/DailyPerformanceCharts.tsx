"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DailyPerformanceChartsSkeleton from "./DailyPerformanceChartsSkeleton";

import {
  DashboardDailyPerformance,
  DashboardDailyAdSpend,
  DashboardDailyLead,
} from "@/src/types/admin/dashboard.types";

/* =========================================================
   CHART DATA TYPES
========================================================= */

interface LeadsChartItem {
  day: string;
  leads: number;
}

interface AdSpendChartItem {
  day: string;
  adSpend: number;
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
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const SpendTooltip = ({
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
            ₹{Number(item.value || 0).toLocaleString("en-IN")}
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

interface DailyPerformanceChartsProps {
  dailyPerformance: DashboardDailyPerformance | null;
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DailyPerformanceCharts({
  dailyPerformance,
  isLoading,
}: DailyPerformanceChartsProps) {
  /* =======================================================
     CHART STATES
  ======================================================= */

  const [leadsData, setLeadsData] =
    useState<LeadsChartItem[]>([]);

  const [adSpendData, setAdSpendData] =
    useState<AdSpendChartItem[]>([]);

  const [totalAdSpend, setTotalAdSpend] =
    useState<number>(0);

  /* =======================================================
     FORMAT DASHBOARD DATA
  ======================================================= */

  useEffect(() => {
    if (!dailyPerformance) {
      setLeadsData([]);
      setAdSpendData([]);
      setTotalAdSpend(0);

      return;
    }

    /* =====================================================
       DAILY LEADS
    ===================================================== */

    const formattedLeads: LeadsChartItem[] =
      dailyPerformance.dailyLeads.map(
        (item: DashboardDailyLead) => ({
          day: formatChartDate(
            item.performance_date
          ),

          leads: Number(
            item.leads || 0
          ),
        })
      );

    /* =====================================================
       DAILY AD SPEND
    ===================================================== */

    const formattedAdSpend: AdSpendChartItem[] =
      dailyPerformance.dailyAdSpend.map(
        (item: DashboardDailyAdSpend) => ({
          day: formatChartDate(
            item.performance_date
          ),

          adSpend: Number(
            item.adSpend || 0
          ),
        })
      );

    /* =====================================================
       SET CHART DATA
    ===================================================== */

    setLeadsData(formattedLeads);
    setAdSpendData(formattedAdSpend);

    /* =====================================================
       TOTAL AD SPEND
    ===================================================== */

    const totalSpend =
      formattedAdSpend.reduce(
        (total, item) =>
          total +
          Number(item.adSpend || 0),
        0
      );

    setTotalAdSpend(totalSpend);
  }, [dailyPerformance]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <DailyPerformanceChartsSkeleton />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full px-4 pb-6 pt-5 sm:px-5 lg:px-6 lg:pt-6">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* =================================================
            DAILY LEADS
        ================================================= */}

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 pb-5 pt-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:px-6 sm:pb-6 sm:pt-6">

          {/* Header */}

          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                Daily Leads
              </h3>

              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                Live agency-wide saved daily records
              </p>
            </div>

            {/* 7 Days */}

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
                    id="leadsBlueGradient"
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
                  fill="url(#leadsBlueGradient)"
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

        {/* =================================================
            DAILY AD SPEND
        ================================================= */}

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 pb-5 pt-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:px-6 sm:pb-6 sm:pt-6">

          {/* Header */}

          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                Daily Ad Spend
              </h3>

              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                Total recorded spend ₹
                {totalAdSpend.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            {/* 7 Days */}

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
              <BarChart
                data={adSpendData}
                barCategoryGap="55%"
                margin={{
                  top: 8,
                  right: 8,
                  left: 0,
                  bottom: 10,
                }}
              >
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
                  width={42}
                />

                <Tooltip
                  content={<SpendTooltip />}
                  cursor={{
                    fill: "rgba(148,163,184,0.08)",
                  }}
                />

                <Bar
                  dataKey="adSpend"
                  name="Total Ad Spend"
                  fill="#30369A"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={24}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="square"
                  iconSize={16}
                  wrapperStyle={{
                    fontSize: "13px",
                    color: "#334155",
                    paddingTop: "12px",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}