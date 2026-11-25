"use client";

import {
  Check,
  ChevronDown,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  TaskEmployee,
} from "@/src/types/admin/task.types";

/* ========================= Props ========================= */

interface TaskAssignmentProps {
  employees: TaskEmployee[];

  selectedEmployeeIds?: number[];

  onChange?: (
    employees: TaskEmployee[]
  ) => void;

  disabled?: boolean;

  loading?: boolean;
}

/* ========================= Component ========================= */

export default function TaskAssignment({
  employees,
  selectedEmployeeIds = [],
  onChange,
  disabled = false,
  loading = false,
}: TaskAssignmentProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef =
    useRef<HTMLDivElement>(null);

  /* ========================= Selected Employees ========================= */

  const selectedEmployees = useMemo(() => {
    return employees.filter((employee) =>
      selectedEmployeeIds.includes(
        employee.id
      )
    );
  }, [
    employees,
    selectedEmployeeIds,
  ]);

  /* ========================= Filter Employees ========================= */

  const filteredEmployees = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return employees;
    }

    return employees.filter((employee) => {
      const employeeName =
        getEmployeeName(employee);

      return (
        employeeName
          .toLowerCase()
          .includes(query) ||
        employee.designation
          ?.toLowerCase()
          .includes(query) ||
        employee.department
          ?.toLowerCase()
          .includes(query) ||
        employee.employee_code
          ?.toLowerCase()
          .includes(query) ||
        employee.email
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [employees, search]);

  /* ========================= Close Dropdown ========================= */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* ========================= Select / Unselect Employee ========================= */

  const handleSelect = (
    employee: TaskEmployee
  ) => {
    if (
      disabled ||
      loading ||
      employee.status === "INACTIVE"
    ) {
      return;
    }

    const isAlreadySelected =
      selectedEmployeeIds.includes(
        employee.id
      );

    let nextSelectedIds: number[];

    if (isAlreadySelected) {
      nextSelectedIds =
        selectedEmployeeIds.filter(
          (id) =>
            id !== employee.id
        );
    } else {
      nextSelectedIds = [
        ...selectedEmployeeIds,
        employee.id,
      ];
    }

    const nextSelectedEmployees =
      employees.filter((item) =>
        nextSelectedIds.includes(
          item.id
        )
      );

    onChange?.(
      nextSelectedEmployees
    );
  };

  /* ========================= Remove Employee ========================= */

  const handleRemove = (
    employeeId: number
  ) => {
    if (disabled || loading) {
      return;
    }

    const nextSelectedIds =
      selectedEmployeeIds.filter(
        (id) =>
          id !== employeeId
      );

    const nextSelectedEmployees =
      employees.filter((employee) =>
        nextSelectedIds.includes(
          employee.id
        )
      );

    onChange?.(
      nextSelectedEmployees
    );
  };

  /* ========================= Clear All ========================= */

  const handleClearAll = () => {
    if (disabled || loading) {
      return;
    }

    onChange?.([]);

    setSearch("");
  };

  /* ========================= Render ========================= */

  return (
    <div
      ref={containerRef}
      className="w-full"
    >
      {/* ========================= Section Header ========================= */}

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Assigned Employees
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Select one or more employees for
            this task.
          </p>
        </div>

        <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      </div>

      {/* ========================= Assignment Button ========================= */}

      <button
        type="button"
        disabled={
          disabled || loading
        }
        onClick={() =>
          setOpen(
            (previous) =>
              !previous
          )
        }
        className={`flex min-h-[58px] w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
          open
            ? "border-blue-300 bg-blue-50/40 ring-2 ring-blue-100"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        } ${
          disabled || loading
            ? "cursor-not-allowed opacity-60"
            : ""
        }`}
      >
        {/* Avatar / Multiple Avatars */}

        {selectedEmployees.length >
        0 ? (
          <div className="flex shrink-0 -space-x-2">
            {selectedEmployees
              .slice(0, 3)
              .map((employee) => (
                <div
                  key={employee.id}
                  className="rounded-full border-2 border-white"
                >
                  <EmployeeAvatar
                    employee={
                      employee
                    }
                  />
                </div>
              ))}

            {selectedEmployees.length >
              3 && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-blue-50 text-[10px] font-semibold text-blue-600">
                +
                {selectedEmployees.length -
                  3}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <UserRound className="h-4 w-4" />
          </div>
        )}

        {/* Employee Information */}

        <div className="min-w-0 flex-1">
          {loading ? (
            <>
              <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />

              <div className="mt-1.5 h-2.5 w-20 animate-pulse rounded bg-slate-100" />
            </>
          ) : selectedEmployees.length >
            0 ? (
            <>
              <p className="truncate text-xs font-semibold text-slate-800">
                {selectedEmployees.length ===
                1
                  ? getEmployeeName(
                      selectedEmployees[0]
                    )
                  : `${selectedEmployees.length} employees assigned`}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                {selectedEmployees
                  .slice(0, 2)
                  .map(
                    (employee) =>
                      getEmployeeName(
                        employee
                      )
                  )
                  .join(", ")}

                {selectedEmployees.length >
                  2 &&
                  ` +${
                    selectedEmployees.length -
                    2
                  } more`}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium text-slate-600">
                Assign employees
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                No employees assigned
              </p>
            </>
          )}
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {/* ========================= Selected Employee Chips ========================= */}

      {selectedEmployees.length >
        0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedEmployees.map(
            (employee) => (
              <div
                key={employee.id}
                className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2 py-1"
              >
                <span className="max-w-[140px] truncate text-[10px] font-medium text-blue-700">
                  {getEmployeeName(
                    employee
                  )}
                </span>

                <button
                  type="button"
                  disabled={
                    disabled ||
                    loading
                  }
                  onClick={() =>
                    handleRemove(
                      employee.id
                    )
                  }
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-blue-400 transition hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed"
                  aria-label={`Remove ${getEmployeeName(
                    employee
                  )}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* ========================= Dropdown ========================= */}

      {open &&
        !disabled &&
        !loading && (
          <div className="relative z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {/* Search */}

            <div className="border-b border-slate-100 p-2.5">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
                <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search employee..."
                  autoFocus
                  className="h-9 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Employee List */}

            <div className="max-h-60 overflow-y-auto p-1.5">
              {/* Clear All */}

              {selectedEmployees.length >
                0 && (
                <button
                  type="button"
                  onClick={
                    handleClearAll
                  }
                  className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-red-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <X className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-red-600">
                      Clear all assignments
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Remove all selected employees
                    </p>
                  </div>
                </button>
              )}

              {filteredEmployees.length >
              0 ? (
                filteredEmployees.map(
                  (employee) => {
                    const isSelected =
                      selectedEmployeeIds.includes(
                        employee.id
                      );

                    const isInactive =
                      employee.status ===
                      "INACTIVE";

                    const employeeName =
                      getEmployeeName(
                        employee
                      );

                    return (
                      <button
                        key={
                          employee.id
                        }
                        type="button"
                        disabled={
                          isInactive
                        }
                        onClick={() =>
                          handleSelect(
                            employee
                          )
                        }
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                          isInactive
                            ? "cursor-not-allowed opacity-50"
                            : isSelected
                              ? "bg-blue-50"
                              : "hover:bg-slate-50"
                        }`}
                      >
                        {/* Avatar */}

                        <EmployeeAvatar
                          employee={
                            employee
                          }
                        />

                        {/* Info */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-xs font-medium text-slate-700">
                              {
                                employeeName
                              }
                            </p>

                            {isInactive && (
                              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-medium text-slate-400">
                                Inactive
                              </span>
                            )}
                          </div>

                          <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                            <p className="truncate text-[10px] text-slate-400">
                              {employee.designation ||
                                employee.department ||
                                "Employee"}
                            </p>

                            {employee.employee_code && (
                              <>
                                <span className="text-[9px] text-slate-300">
                                  •
                                </span>

                                <p className="shrink-0 text-[9px] text-slate-400">
                                  {
                                    employee.employee_code
                                  }
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Selected */}

                        {isSelected ? (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 shrink-0 rounded-full border border-slate-300" />
                        )}
                      </button>
                    );
                  }
                )
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    No employees found
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Try a different employee
                    name, department
                    or code.
                  </p>
                </div>
              )}
            </div>

            {/* Dropdown Footer */}

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-3 py-2">
              <p className="text-[10px] text-slate-400">
                {selectedEmployees.length}{" "}
                employee
                {selectedEmployees.length !==
                1
                  ? "s"
                  : ""}{" "}
                selected
              </p>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSearch("");
                }}
                className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[10px] font-medium text-white transition hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

/* ========================= Employee Avatar ========================= */

function EmployeeAvatar({
  employee,
}: {
  employee: TaskEmployee;
}) {
  const employeeName =
    getEmployeeName(employee);

  if (employee.profile_image) {
    return (
      <img
        src={employee.profile_image}
        alt={employeeName}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600">
      {getEmployeeInitials(
        employee
      )}
    </div>
  );
}

/* ========================= Helpers ========================= */

function getEmployeeName(
  employee: TaskEmployee
) {
  if (employee.name?.trim()) {
    return employee.name.trim();
  }

  const fullName = [
    employee.first_name,
    employee.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Employee";
}

function getEmployeeInitials(
  employee: TaskEmployee
) {
  const name =
    getEmployeeName(employee);

  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase()
      )
      .join("") || "EM"
  );
}