"use client";

import {
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

/* ========================= Types ========================= */

export type EmployeeTaskStatusFilter =
  | "ALL"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED";

export type EmployeeTaskPriorityFilter =
  | "ALL"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface EmployeeTaskFiltersValue {
  status: EmployeeTaskStatusFilter;
  priority: EmployeeTaskPriorityFilter;
  clientId: number | "ALL";
}

/* ========================= Constants ========================= */

export const DEFAULT_TASK_FILTERS: EmployeeTaskFiltersValue = {
  status: "ALL",
  priority: "ALL",
  clientId: "ALL",
};

/* ========================= Props ========================= */

interface EmployeeTaskFiltersProps {
  value: EmployeeTaskFiltersValue;

  onChange: (
    value: EmployeeTaskFiltersValue
  ) => void;

  loading?: boolean;
}

/* ========================= Options ========================= */

const STATUS_OPTIONS: {
  label: string;
  value: EmployeeTaskStatusFilter;
}[] = [
  {
    label: "All Statuses",
    value: "ALL",
  },
  {
    label: "To Do",
    value: "TODO",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "In Review",
    value: "IN_REVIEW",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
];

const PRIORITY_OPTIONS: {
  label: string;
  value: EmployeeTaskPriorityFilter;
}[] = [
  {
    label: "All Priorities",
    value: "ALL",
  },
  {
    label: "Low",
    value: "LOW",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "High",
    value: "HIGH",
  },
  {
    label: "Urgent",
    value: "URGENT",
  },
];

/* ========================= Component ========================= */

export default function EmployeeTaskFilters({
  value,
  onChange,
  loading = false,
}: EmployeeTaskFiltersProps) {
  const hasActiveFilters =
    value.status !== "ALL" ||
    value.priority !== "ALL" ||
    value.clientId !== "ALL";

  const handleStatusChange = (
    status: EmployeeTaskStatusFilter
  ) => {
    onChange({
      ...value,
      status,
    });
  };

  const handlePriorityChange = (
    priority: EmployeeTaskPriorityFilter
  ) => {
    onChange({
      ...value,
      priority,
    });
  };

  const handleReset = () => {
    onChange({
      ...DEFAULT_TASK_FILTERS,
    });
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* ========================= HEADER ========================= */}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#2E3192]" />

          <h3 className="text-sm font-semibold text-gray-900">
            Filter Tasks
          </h3>
        </div>

        {hasActiveFilters && (
          <span className="text-xs font-medium text-[#2E3192]">
            Filters active
          </span>
        )}
      </div>

      {/* ========================= FILTER FIELDS ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* ========================= STATUS ========================= */}

        <div className="space-y-2">
          <label
            htmlFor="employee-task-status-filter"
            className="text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="employee-task-status-filter"
            value={value.status}
            disabled={loading}
            onChange={(event) =>
              handleStatusChange(
                event.target.value as EmployeeTaskStatusFilter
              )
            }
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* ========================= PRIORITY ========================= */}

        <div className="space-y-2">
          <label
            htmlFor="employee-task-priority-filter"
            className="text-sm font-medium text-gray-700"
          >
            Priority
          </label>

          <select
            id="employee-task-priority-filter"
            value={value.priority}
            disabled={loading}
            onChange={(event) =>
              handlePriorityChange(
                event.target.value as EmployeeTaskPriorityFilter
              )
            }
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================= ACTIONS ========================= */}

      {hasActiveFilters && (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}