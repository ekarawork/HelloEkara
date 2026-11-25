"use client";

import {
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import type {
  TaskClientOption,
  TaskEmployeeOption,
  TaskPriority,
  TaskStatus,
} from "@/src/types/admin/task.types";

import {
  TASK_STATUS_OPTIONS,
} from "@/src/components/admin/task/TaskStatus";

/* ========================= Types ========================= */

export type TaskFiltersValue = {
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  employeeId: number | "ALL";
  clientId: number | "ALL";
};

interface TaskFiltersProps {
  value: TaskFiltersValue;
  onChange: (
    filters: TaskFiltersValue
  ) => void;

  employees?: TaskEmployeeOption[];
  clients?: TaskClientOption[];

  disabled?: boolean;
  loading?: boolean;

  showLabel?: boolean;
  showReset?: boolean;

  className?: string;
}

/* ========================= Defaults ========================= */

export const DEFAULT_TASK_FILTERS: TaskFiltersValue =
  {
    status: "ALL",
    priority: "ALL",
    employeeId: "ALL",
    clientId: "ALL",
  };

/* ========================= Priority Options ========================= */

const PRIORITY_OPTIONS: Array<{
  value: TaskPriority | "ALL";
  label: string;
}> = [
  {
    value: "ALL",
    label: "All Priorities",
  },
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "URGENT",
    label: "Urgent",
  },
];

/* ========================= Component ========================= */

export default function TaskFilters({
  value,
  onChange,
  employees = [],
  clients = [],
  disabled = false,
  loading = false,
  showLabel = true,
  showReset = true,
  className = "",
}: TaskFiltersProps) {
  const isDisabled =
    disabled || loading;

  /* ========================= Handlers ========================= */

  const handleChange = (
    field: keyof TaskFiltersValue,
    fieldValue: string
  ) => {
    if (
      field === "employeeId" ||
      field === "clientId"
    ) {
      onChange({
        ...value,
        [field]:
          fieldValue === "ALL"
            ? "ALL"
            : Number(fieldValue),
      });

      return;
    }

    if (field === "status") {
      onChange({
        ...value,
        status:
          fieldValue as TaskStatus | "ALL",
      });

      return;
    }

    if (field === "priority") {
      onChange({
        ...value,
        priority:
          fieldValue as TaskPriority | "ALL",
      });
    }
  };

  const handleReset = () => {
    onChange({
      ...DEFAULT_TASK_FILTERS,
    });
  };

  /* ========================= Active Filters ========================= */

  const hasActiveFilters =
    value.status !== "ALL" ||
    value.priority !== "ALL" ||
    value.employeeId !== "ALL" ||
    value.clientId !== "ALL";

  /* ========================= Render ========================= */

  return (
    <div
      className={`
        w-full
        rounded-2xl
        border border-slate-200
        bg-white
        p-4
        ${className}
      `}
    >
      {/* ========================= Header ========================= */}

      <div className="mb-4 flex items-center justify-between gap-3">
        {showLabel && (
          <div className="flex items-center gap-2">
           <div
  className="
    flex
    h-8
    w-8
    items-center
    justify-center
    rounded-lg
    bg-[#2E3192]/10
    text-[#2E3192]
  "
>
  <SlidersHorizontal size={16} />
</div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Filters
              </h3>

              <p className="text-xs text-slate-400">
                Filter tasks by criteria
              </p>
            </div>
          </div>
        )}

        {showReset && hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isDisabled}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              px-2.5
              py-1.5
              text-xs
              font-medium
              text-slate-500
              transition
              hover:bg-[#2E3192]/10
hover:text-[#2E3192]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RotateCcw size={13} />

            Reset
          </button>
        )}
      </div>

      {/* ========================= Filters ========================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* ========================= Status ========================= */}

        <FilterSelect
          label="Status"
          value={value.status}
          disabled={isDisabled}
          onChange={(nextValue) =>
            handleChange(
              "status",
              nextValue
            )
          }
        >
          <option value="ALL">
            All Statuses
          </option>

          {TASK_STATUS_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </FilterSelect>

        {/* ========================= Priority ========================= */}

        <FilterSelect
          label="Priority"
          value={value.priority}
          disabled={isDisabled}
          onChange={(nextValue) =>
            handleChange(
              "priority",
              nextValue
            )
          }
        >
          {PRIORITY_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </FilterSelect>

        {/* ========================= Employee ========================= */}

        <FilterSelect
          label="Employee"
          value={String(
            value.employeeId
          )}
          disabled={isDisabled}
          onChange={(nextValue) =>
            handleChange(
              "employeeId",
              nextValue
            )
          }
        >
          <option value="ALL">
            All Employees
          </option>

          {employees.map(
            (employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.name}
              </option>
            )
          )}
        </FilterSelect>

        {/* ========================= Client ========================= */}

        <FilterSelect
          label="Client"
          value={String(
            value.clientId
          )}
          disabled={isDisabled}
          onChange={(nextValue) =>
            handleChange(
              "clientId",
              nextValue
            )
          }
        >
          <option value="ALL">
            All Clients
          </option>

          {clients.map(
            (client) => (
              <option
                key={client.id}
                value={client.id}
              >
                {client.name}
              </option>
            )
          )}
        </FilterSelect>
      </div>

      {/* ========================= Loading ========================= */}

      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <div
            className="
              h-3.5
              w-3.5
              animate-spin
              rounded-full
              border-2
              border-slate-200
              border-t-[#2E3192]
            "
          />

          Applying filters...
        </div>
      )}
    </div>
  );
}

/* ========================= Filter Select ========================= */

interface FilterSelectProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (
    value: string
  ) => void;
  children: React.ReactNode;
}

function FilterSelect({
  label,
  value,
  disabled = false,
  onChange,
  children,
}: FilterSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        disabled={disabled}
        className="
          w-full
          rounded-xl
          border border-slate-200
          bg-white
          px-3
          py-2.5
          text-sm
          text-slate-700
          outline-none
          transition
          focus:border-[#2E3192]
focus:ring-2
focus:ring-[#2E3192]/10
          disabled:cursor-not-allowed
          disabled:bg-slate-50
          disabled:text-slate-400
        "
      >
        {children}
      </select>
    </div>
  );
}
