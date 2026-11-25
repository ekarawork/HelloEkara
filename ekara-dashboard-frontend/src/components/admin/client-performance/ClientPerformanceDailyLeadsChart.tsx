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
import { useState } from "react";
import {
  ClientPerformanceDailyLeads,
} from "@/src/types/admin/clientPerformance.types";

interface ClientPerformanceDailyLeadsChartProps {
  dailyLeads: ClientPerformanceDailyLeads[];
}

type Period = 7 | 30;

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatTooltipDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function ClientPerformanceDailyLeadsChart({
  dailyLeads,
}: ClientPerformanceDailyLeadsChartProps) {
  const [period, setPeriod] = useState<Period>(7);

  const chartData = dailyLeads
    .slice(-period)
    .map((item) => ({
      ...item,
      displayDate: formatDate(item.date),
    }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Daily leads
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Agency-wide lead trend
          </p>
        </div>

        {/* Period */}
        <div className="shrink-0">
          <select
            value={period}
            onChange={(e) =>
              setPeriod(Number(e.target.value) as Period)
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 outline-none focus:border-indigo-500"
          >
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center">
          <p className="text-sm text-slate-500">
            No daily lead data available.
          </p>
        </div>
      ) : (
        <div className="h-[280px] w-full sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 8,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="dailyLeadsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#3730a3"
                    stopOpacity={0.16}
                  />
                  <stop
                    offset="100%"
                    stopColor="#3730a3"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#dbe3f0"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#64748b",
                }}
                tickMargin={10}
                minTickGap={30}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={42}
                tick={{
                  fontSize: 12,
                  fill: "#64748b",
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "#cbd5e1",
                  strokeDasharray: "4 4",
                }}
                content={({ active, payload }) => {
                  if (
                    !active ||
                    !payload ||
                    payload.length === 0
                  ) {
                    return null;
                  }

                  const data = payload[0]?.payload;

                  if (!data) {
                    return null;
                  }

                  return (
                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
                      <p className="text-xs font-medium text-slate-500">
                        {formatTooltipDate(data.date)}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {data.leads}{" "}
                        {data.leads === 1 ? "lead" : "leads"}
                      </p>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey="leads"
                stroke="#3730a3"
                strokeWidth={2.5}
                fill="url(#dailyLeadsGradient)"
                dot={{
                  r: 2.5,
                  fill: "#3730a3",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                  fill: "#3730a3",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}