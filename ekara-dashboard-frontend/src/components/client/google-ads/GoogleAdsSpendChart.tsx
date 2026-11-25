"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ClientGoogleAdsDailySpend,
} from "@/src/types/client/googleadsPerformance.types";

import GoogleAdsSpendChartSkeleton from "./GoogleAdsSpendChartSkeleton";

/* =========================================================
   CHART DATA TYPE
========================================================= */

interface SpendChartItem {
  day: string;
  spend: number;
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

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
            ₹
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

interface GoogleAdsSpendChartProps {
  dailySpend: ClientGoogleAdsDailySpend[];
  isLoading: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function GoogleAdsSpendChart({
  dailySpend,
  isLoading,
}: GoogleAdsSpendChartProps) {
  /* =======================================================
     CHART DATA
  ======================================================= */

  const [spendData, setSpendData] =
    useState<SpendChartItem[]>([]);

  const [totalSpend, setTotalSpend] =
    useState<number>(0);

  /* =======================================================
     FORMAT DATA
  ======================================================= */

  useEffect(() => {
    if (!dailySpend?.length) {
      setSpendData([]);
      setTotalSpend(0);

      return;
    }

    const formattedSpend: SpendChartItem[] =
      dailySpend.map(
        (
          item: ClientGoogleAdsDailySpend
        ) => ({
          day: formatChartDate(item.date),

          spend: Number(
            item.spend || 0
          ),
        })
      );

    setSpendData(formattedSpend);

    /* =====================================================
       TOTAL SPEND
    ===================================================== */

    const total =
      formattedSpend.reduce(
        (sum, item) =>
          sum + Number(item.spend || 0),
        0
      );

    setTotalSpend(total);
  }, [dailySpend]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <GoogleAdsSpendChartSkeleton />;
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!spendData.length) {
    return (
      <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:px-6">
        <div className="text-center">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            Daily Ad Spend
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            No Google Ads spend data available.
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
            Daily Ad Spend
          </h3>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Total recorded spend ₹
            {totalSpend.toLocaleString("en-IN")}
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
          <BarChart
            data={spendData}
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
              width={48}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString(
                  "en-IN"
                )}`
              }
            />

            <Tooltip
              content={<SpendTooltip />}
              cursor={{
                fill: "rgba(148,163,184,0.08)",
              }}
            />

            <Bar
              dataKey="spend"
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
  );
}