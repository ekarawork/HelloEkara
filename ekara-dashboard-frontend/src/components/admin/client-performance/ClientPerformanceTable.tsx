"use client";

import { Ellipsis } from "lucide-react";
import { useState } from "react";

import { ClientPerformance } from "@/src/types/admin/clientPerformance.types";
import ClientPerformanceActionMenu from "@/src/components/admin/client-performance/ClientPerformanceActionMenu";

interface ClientPerformanceTableProps {
  performances: ClientPerformance[];
  onView?: (performance: ClientPerformance) => void;
  onEdit?: (performance: ClientPerformance) => void;
  onDelete?: (performance: ClientPerformance) => void;
}

export default function ClientPerformanceTable({
  performances,
  onView,
  onEdit,
  onDelete,
}: ClientPerformanceTableProps) {
  const [openMenu, setOpenMenu] = useState<string | number | null>(null);
  /* CLIENT NAME */
  const getClientName = (performance: ClientPerformance): string => {
    return performance.client?.name?.trim() || "Unnamed Client";
  };

  /* CLIENT INITIALS */
  const getInitials = (performance: ClientPerformance): string => {
    const name = getClientName(performance);
    const words = name.split(/\s+/).filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  /* SERVICE LABEL */
  const getServiceLabel = (
    performance: ClientPerformance
  ): string => {
    switch (performance.clientService?.service_name) {
      case "META_ADS":
        return "Meta Ads";

      case "GOOGLE_ADS":
        return "Google Ads";

      case "WEBSITE_SALES":
        return "Website Sales";

      case "ORGANIC_SOCIAL":
        return "Organic Social";

      default:
        return "Unknown Service";
    }
  };

  /* SERVICE COLOR */
  const getServiceClass = (
    performance: ClientPerformance
  ): string => {
    switch (performance.clientService?.service_name) {
      case "META_ADS":
        return "bg-[#F0F0FF] text-[#2E3192]";

      case "GOOGLE_ADS":
        return "bg-blue-50 text-blue-600";

      case "WEBSITE_SALES":
        return "bg-emerald-50 text-emerald-600";

      case "ORGANIC_SOCIAL":
        return "bg-orange-50 text-orange-600";

      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  /* DATE */
  const getPerformanceDate = (
    performance: ClientPerformance
  ): string => {
    if (!performance.performance_date) {
      return "-";
    }

    const date = new Date(performance.performance_date);

    if (Number.isNaN(date.getTime())) {
      return performance.performance_date;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* DAILY SPEND */
  const getDailySpend = (
    performance: ClientPerformance
  ): string => {
    const spend = Number(performance.daily_spend || 0);

    return `₹${spend.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  /* NUMBER FORMAT */
  const formatNumber = (value: number | string | null | undefined): string => {
    const number = Number(value || 0);

    if (Number.isNaN(number)) {
      return "0";
    }

    return number.toLocaleString("en-IN");
  };

  /* TOGGLE ACTION MENU */
const [menuAnchor, setMenuAnchor] =
  useState<HTMLButtonElement | null>(null);

const handleMenuToggle = (
  performanceId: string | number,
  button: HTMLButtonElement
) => {
  if (openMenu === performanceId) {
    setOpenMenu(null);
    setMenuAnchor(null);
    return;
  }

  setOpenMenu(performanceId);
  setMenuAnchor(button);
};

  /* ACTION HANDLER */
const handleAction = (
  callback: ((performance: ClientPerformance) => void) | undefined,
  performance: ClientPerformance
) => {
  setOpenMenu(null);
  setMenuAnchor(null);
  callback?.(performance);
};

  return (
    <section className="mt-4 w-full">
      <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        {/* DESKTOP TABLE */}
        <div className="hidden w-full overflow-x-auto lg:block">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Client
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Daily Spend
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Impressions
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Clicks
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Leads
                </th>

                <th className="w-16 px-5 py-4" />
              </tr>
            </thead>

            <tbody>
              {performances.map((performance) => {
                const performanceId =
                  performance.uuid || performance.id;

                const clientName = getClientName(performance);
                const serviceName = getServiceLabel(performance);

                return (
                  <tr
                    key={performanceId}
                    className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/50"
                  >
                    {/* CLIENT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                          {getInitials(performance)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {clientName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SERVICE */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${getServiceClass(
                          performance
                        )}`}
                      >
                        {serviceName}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {getPerformanceDate(performance)}
                      </span>
                    </td>

                    {/* DAILY SPEND */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-700">
                        {getDailySpend(performance)}
                      </span>
                    </td>

                    {/* IMPRESSIONS */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {formatNumber(performance.impressions)}
                      </span>
                    </td>

                    {/* CLICKS */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {formatNumber(performance.clicks)}
                      </span>
                    </td>

                    {/* LEADS */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-[#2E3192]">
                        {formatNumber(performance.leads)}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="relative px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(event) =>
                              handleMenuToggle(
                                performanceId,
                                event.currentTarget
                              )
                            }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 ${
                            openMenu === performanceId
                              ? "bg-[#F0F0FF] text-[#2E3192]"
                              : "hover:bg-slate-100 hover:text-slate-700"
                          }`}
                          aria-label={`Actions for ${clientName}`}
                        >
                          <Ellipsis
                            size={18}
                            strokeWidth={1.8}
                          />
                        </button>

                        {openMenu === performanceId && (
  <ClientPerformanceActionMenu
    performance={performance}
    onView={onView}
    onEdit={onEdit}
    onDelete={onDelete}
    onClose={() => {
      setOpenMenu(null);
      setMenuAnchor(null);
    }}
    anchorElement={menuAnchor}
  />
)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TABLET / MOBILE CARDS */}
        <div className="divide-y divide-slate-100 lg:hidden">
          {performances.map((performance) => {
            const performanceId =
              performance.uuid || performance.id;

            const clientName = getClientName(performance);
            const serviceName = getServiceLabel(performance);

            return (
              <div
                key={performanceId}
                className="relative p-4 sm:p-5"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {getInitials(performance)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {clientName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {getPerformanceDate(performance)}
                      </p>
                    </div>
                  </div>

                  {/* MOBILE ACTIONS */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={(event) =>
                        handleMenuToggle(
                          performanceId,
                          event.currentTarget
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`Actions for ${clientName}`}
                    >
                      <Ellipsis size={18} />
                    </button>

                   {openMenu === performanceId && (
  <ClientPerformanceActionMenu
    performance={performance}
    onView={onView}
    onEdit={onEdit}
    onDelete={onDelete}
    onClose={() => {
      setOpenMenu(null);
      setMenuAnchor(null);
    }}
    anchorElement={menuAnchor}
  />
)}
                  </div>
                </div>

                {/* SERVICE */}
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Service
                  </p>

                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium ${getServiceClass(
                        performance
                      )}`}
                    >
                      {serviceName}
                    </span>
                  </div>
                </div>

                {/* PERFORMANCE DETAILS */}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {/* DAILY SPEND */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Daily Spend
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {getDailySpend(performance)}
                    </p>
                  </div>

                  {/* IMPRESSIONS */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Impressions
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {formatNumber(performance.impressions)}
                    </p>
                  </div>

                  {/* CLICKS */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Clicks
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {formatNumber(performance.clicks)}
                    </p>
                  </div>

                  {/* LEADS */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Leads
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#2E3192]">
                      {formatNumber(performance.leads)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {performances.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-slate-600">
              No performance data found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}