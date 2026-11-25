"use client";

import { Plus, Search, Trash2 } from "lucide-react";

interface ClientSearchProps {
  search: string;
  filter: string;
  onAddClient?: () => void;
  onClearClients?: () => void;
  onSearch?: (value: string) => void;
  onFilterChange?: (value: string) => void;
}

const filterOptions = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export default function ClientSearch({
  search,
  filter,
  onAddClient,
  onClearClients,
  onSearch,
  onFilterChange,
}: ClientSearchProps) {
  return (
    <section className="w-full">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Clients
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 sm:text-[15px]">
            Manage accounts, services, budgets, contracts and access.
          </p>
        </div>

        {/* CLIENT ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Clear Clients */}
          <button
            type="button"
            onClick={onClearClients}
            title="Clear clients"
            aria-label="Clear clients"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-[0.98]"
          >
            <Trash2 size={17} strokeWidth={1.8} />
          </button>

          {/* Add Client */}
          <button
            type="button"
            onClick={onAddClient}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2E3192] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98]"
          >
            <Plus size={17} strokeWidth={2} />
            <span>Add client</span>
          </button>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {/* SEARCH */}
        <div className="relative w-full sm:max-w-[295px]">
          <Search
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              onSearch?.(event.target.value);
            }}
            placeholder="Search clients..."
            autoComplete="off"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
          />
        </div>

        {/* FILTER */}
        <div className="relative min-w-0 flex-1">
          <select
            value={filter}
            onChange={(event) => {
              onFilterChange?.(event.target.value);
            }}
            className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition-all focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}