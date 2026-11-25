"use client";

import {
  CalendarDays,
  User,
  BriefcaseBusiness,
  Wallet,
  Eye,
  MousePointerClick,
  Users,
  Pencil,
} from "lucide-react";

import { ClientPerformance } from "@/src/types/admin/clientPerformance.types";

interface ClientPerformanceDetailsProps {
  performance: ClientPerformance;
}

export default function ClientPerformanceDetails({
  performance,
}: ClientPerformanceDetailsProps) {
  const clientName =
    performance.client?.name?.trim() || "Unknown Client";

  const serviceName =
    performance.clientService?.service_name || "Unknown Service";

  const formatDate = (date: string): string => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatNumber = (value: number | string | null | undefined): string => {
    const number = Number(value || 0);

    if (Number.isNaN(number)) {
      return "0";
    }

    return number.toLocaleString("en-IN");
  };

  const formatCurrency = (
    value: number | string | null | undefined
  ): string => {
    const number = Number(value || 0);

    if (Number.isNaN(number)) {
      return "₹0";
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  const getServiceLabel = (service: string): string => {
    switch (service) {
      case "META_ADS":
        return "Meta Ads";

      case "GOOGLE_ADS":
        return "Google Ads";

      case "WEBSITE_SALES":
        return "Website Sales";

      case "ORGANIC_SOCIAL":
        return "Organic Social";

      default:
        return service;
    }
  };

  const getClientInitials = (): string => {
    const words = clientName.split(/\s+/).filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return clientName.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-5">
      {/* PERFORMANCE HEADER */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F0F0FF] text-sm font-semibold text-[#2E3192]">
          {getClientInitials()}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {clientName}
          </h3>

          <p className="truncate text-xs text-slate-400">
            {getServiceLabel(serviceName)}
          </p>
        </div>

        <div className="ml-auto shrink-0 rounded-full bg-[#F0F0FF] px-2.5 py-1 text-[10px] font-semibold text-[#2E3192]">
          Performance
        </div>
      </div>

      {/* Basic Information */}
      <DetailSection title="Performance Information">
        <DetailItem
          icon={<User size={15} />}
          label="Client"
          value={clientName}
        />

        <DetailItem
          icon={<BriefcaseBusiness size={15} />}
          label="Service"
          value={getServiceLabel(serviceName)}
        />

        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Performance date"
          value={formatDate(performance.performance_date)}
        />

        <DetailItem
          label="Performance ID"
          value={performance.uuid || "Not available"}
        />
      </DetailSection>

      {/* Performance Metrics */}
      <DetailSection title="Performance Metrics">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <MetricCard
            icon={<Wallet size={15} />}
            label="Daily Spend"
            value={formatCurrency(performance.daily_spend)}
          />

          <MetricCard
            icon={<Eye size={15} />}
            label="Impressions"
            value={formatNumber(performance.impressions)}
          />

          <MetricCard
            icon={<MousePointerClick size={15} />}
            label="Clicks"
            value={formatNumber(performance.clicks)}
          />

          <MetricCard
            icon={<Users size={15} />}
            label="Leads"
            value={formatNumber(performance.leads)}
          />

          <MetricCard
            icon={<Pencil size={15} />}
            label="Edit Count"
            value={formatNumber(performance.edit_count)}
          />
        </div>
      </DetailSection>

      {/* Service Information */}
      <DetailSection title="Service Information">
        {performance.clientService ? (
          <>
            <DetailItem
              label="Service"
              value={getServiceLabel(
                performance.clientService.service_name
              )}
            />

            <DetailItem
              label="Monthly budget"
              value={formatCurrency(
                performance.clientService.monthly_budget
              )}
            />

            <DetailItem
              label="Service ID"
              value={performance.clientService.uuid}
            />
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center">
            <p className="text-xs text-slate-400">
              Service information is not available.
            </p>
          </div>
        )}
      </DetailSection>

      {/* Created / Updated Information */}
      <DetailSection title="Record Information">
        {performance.createdBy && (
          <DetailItem
            label="Created by"
            value={`${performance.createdBy.first_name || ""} ${
              performance.createdBy.last_name || ""
            }`.trim() || "Unknown"}
          />
        )}

        {performance.updatedBy && (
          <DetailItem
            label="Updated by"
            value={`${performance.updatedBy.first_name || ""} ${
              performance.updatedBy.last_name || ""
            }`.trim() || "Unknown"}
          />
        )}

        <DetailItem
          label="Created at"
          value={formatDate(performance.createdAt)}
        />

        <DetailItem
          label="Updated at"
          value={formatDate(performance.updatedAt)}
        />
      </DetailSection>
    </div>
  );
}

/* DETAIL SECTION */

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {title}
      </h4>

      <div className="space-y-2 rounded-xl border border-slate-100 bg-white">
        {children}
      </div>
    </section>
  );
}

/* DETAIL ITEM */

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 px-3.5 py-3 last:border-b-0">
      {icon && (
        <div className="shrink-0 text-slate-400">
          {icon}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/* METRIC CARD */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-[#DCDDFB] hover:bg-[#F8F8FF]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-slate-400">
            {icon}

            <p className="truncate text-[10px] font-medium">
              {label}
            </p>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}