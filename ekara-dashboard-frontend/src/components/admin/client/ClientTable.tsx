"use client";

import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { Client } from "@/src/types/admin/client.types";
import ClientActionMenu from "@/src/components/admin/client/ClientActionMenu";

interface ClientTableProps {
  clients: Client[];
  onView?: (client: Client) => void;
  onViewPortal?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDisable?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onRemindPayment?: (client: Client) => void;
}

export default function ClientTable({
  clients,
  onView,
  onViewPortal,
  onEdit,
  onDisable,
  onDelete,
  onRemindPayment,
}: ClientTableProps) {
  const [openMenu, setOpenMenu] = useState<string | number | null>(null);

  // Client Name
  const getClientName = (client: Client): string => {
    return client.name?.trim() || "Unnamed Client";
  };

  // Client Initials
  const getInitials = (client: Client): string => {
    const name = getClientName(client);
    const words = name.split(/\s+/).filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  // Status Label
const getStatusLabel = (client: Client): string => {
  switch (client.status) {
    case "ACTIVE":
      return "Enabled";
    case "INACTIVE":
      return "Disabled";
    default:
      return "Unknown";
  }
};

  // Monthly Service Fee
  const getMonthlyFee = (client: Client): string => {
    const fee = Number(client.monthly_service_fee || 0);
    return `₹${fee.toLocaleString("en-IN")}`;
  };

  // Services
  const getServices = (client: Client): string[] => {
    if (!client.clientServices || client.clientServices.length === 0) {
      return [];
    }

    return client.clientServices.map((service) => service.service_name);
  };

  // Toggle Action Menu
  const handleMenuToggle = (clientId: string | number) => {
    setOpenMenu((current) => (current === clientId ? null : clientId));
  };

  // Action Handler
  const handleAction = (
    callback: ((client: Client) => void) | undefined,
    client: Client
  ) => {
    setOpenMenu(null);
    callback?.(client);
  };

  return (
    <section className="mt-4 w-full">
      <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        {/* DESKTOP TABLE */}
        <div className="hidden overflow-visible lg:block">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Client
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Services
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Monthly Fee
                </th>
                <th className="w-16 px-5 py-4" />
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => {
                const clientId = client.uuid || client.id;
                const clientName = getClientName(client);
                const services = getServices(client);
                const status = getStatusLabel(client);

                return (
                  <tr
                    key={clientId}
                    className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/50"
                  >
                    {/* Client */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                          {client.profile_photo ? (
                            <img
                              src={client.profile_photo}
                              alt={clientName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(client)
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {clientName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Services */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {services.length > 0 ? (
                          services.map((service, index) => (
                            <span
                              key={`${service}-${index}`}
                              className="inline-flex items-center rounded-md bg-[#F0F0FF] px-2 py-1 text-[11px] font-medium text-[#2E3192]"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            No services
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              status === "Enabled" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />

                          <span
                            className={`text-xs font-medium ${
                              status === "Enabled" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Monthly Fee */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {getMonthlyFee(client)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="relative px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleMenuToggle(clientId)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 ${
                            openMenu === clientId
                              ? "bg-[#F0F0FF] text-[#2E3192]"
                              : "hover:bg-slate-100 hover:text-slate-700"
                          }`}
                          aria-label={`Actions for ${clientName}`}
                        >
                          <Ellipsis size={18} strokeWidth={1.8} />
                        </button>

                        {openMenu === clientId && (
                          <ClientActionMenu
                            client={client}
                            onView={onView}
                            onViewPortal={onViewPortal}
                            onEdit={onEdit}
                            onDisable={onDisable}
                            onDelete={onDelete}
                            onRemindPayment={onRemindPayment}
                            onClose={() => setOpenMenu(null)}
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
          {clients.map((client) => {
            const clientId = client.uuid || client.id;
            const clientName = getClientName(client);
            const services = getServices(client);
            const status = getStatusLabel(client);

            return (
              <div key={clientId} className="relative p-4 sm:p-5">
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {client.profile_photo ? (
                        <img
                          src={client.profile_photo}
                          alt={clientName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(client)
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {clientName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {client.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMenuToggle(clientId)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`Actions for ${clientName}`}
                    >
                      <Ellipsis size={18} />
                    </button>

                    {openMenu === clientId && (
                      <ClientActionMenu
                        client={client}
                        onView={onView}
                        onViewPortal={onViewPortal}
                        onEdit={onEdit}
                        onDisable={onDisable}
                        onDelete={onDelete}
                        onRemindPayment={onRemindPayment}
                        onClose={() => setOpenMenu(null)}
                      />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {/* Services */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Services
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {services.length > 0 ? (
                        services.map((service, index) => (
                          <span
                            key={`${service}-${index}`}
                            className="rounded-md bg-[#F0F0FF] px-2 py-1 text-[10px] font-medium text-[#2E3192]"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          No services
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Status
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            status === "Enabled" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />

                        <span
                          className={`text-xs font-medium ${
                            status === "Enabled" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Fee */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Monthly Fee
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {getMonthlyFee(client)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {clients.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-slate-600">
              No clients found
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