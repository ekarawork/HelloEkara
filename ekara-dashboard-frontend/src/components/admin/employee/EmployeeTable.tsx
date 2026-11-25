"use client";

import { Ellipsis } from "lucide-react";
import { useState } from "react";

import { Employee } from "@/src/types/admin/employee.types";
import EmployeeActionMenu from "@/src/components/admin/employee/EmployeeActionMenu";

/* ========================= Props ========================= */

interface EmployeeTableProps {
  employees: Employee[];
  onView?: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onDisable?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

/* ========================= Component ========================= */

export default function EmployeeTable({
  employees,
  onView,
  onEdit,
  onDisable,
  onDelete,
}: EmployeeTableProps) {
  const [openMenu, setOpenMenu] = useState<
    string | number | null
  >(null);

  /* ========================= Employee Name ========================= */

  const getEmployeeName = (
    employee: Employee
  ): string => {
    const name =
      `${employee.first_name || ""} ${
        employee.last_name || ""
      }`.trim();

    return name || "Unnamed Employee";
  };

  /* ========================= Employee Initials ========================= */

  const getInitials = (
    employee: Employee
  ): string => {
    const firstName =
      employee.first_name?.trim() || "";

    const lastName =
      employee.last_name?.trim() || "";

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    const name =
      firstName || lastName || "Employee";

    return name
      .slice(0, 2)
      .toUpperCase();
  };

  /* ========================= Status Label ========================= */

  const getStatusLabel = (
    employee: Employee
  ): string => {
    switch (employee.status) {
      case "ACTIVE":
        return "Enabled";

      case "INACTIVE":
        return "Disabled";

      default:
        return "Unknown";
    }
  };

  /* ========================= Employment Type ========================= */

  const getEmploymentTypeLabel = (
    employee: Employee
  ): string => {
    switch (
      employee.employment_type
    ) {
      case "FULL_TIME":
        return "Full Time";

      case "PART_TIME":
        return "Part Time";

      case "INTERN":
        return "Intern";

      case "FREELANCER":
        return "Freelancer";

      default:
        return employee.employment_type;
    }
  };

  /* ========================= Joined Date ========================= */

  const getJoinedDate = (
    employee: Employee
  ): string => {
    if (!employee.joining_date) {
      return "Not added";
    }

    const date = new Date(
      employee.joining_date
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return employee.joining_date;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ========================= Toggle Action Menu ========================= */

  const handleMenuToggle = (
    employeeId: string | number
  ) => {
    setOpenMenu(
      (current) =>
        current === employeeId
          ? null
          : employeeId
    );
  };

  /* ========================= Action Handler ========================= */

  const handleAction = (
    callback:
      | ((employee: Employee) => void)
      | undefined,
    employee: Employee
  ) => {
    setOpenMenu(null);
    callback?.(employee);
  };

  /* ========================= Render ========================= */

  return (
    <section className="mt-4 w-full">
      <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">

        {/* ========================= DESKTOP TABLE ========================= */}

        <div className="hidden overflow-visible xl:block">
          <table className="w-full min-w-[1250px] border-collapse">

            {/* ========================= Table Header ========================= */}

            <thead>
              <tr className="border-b border-slate-100">

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Employee
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Employee Code
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Department
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Designation
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Joined Date
                </th>

                <th className="w-16 px-5 py-4" />
              </tr>
            </thead>

            {/* ========================= Table Body ========================= */}

            <tbody>
              {employees.map(
                (employee) => {
                  const employeeId =
                    employee.uuid ||
                    employee.id;

                  const employeeName =
                    getEmployeeName(
                      employee
                    );

                  const status =
                    getStatusLabel(
                      employee
                    );

                  return (
                    <tr
                      key={employeeId}
                      className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/50"
                    >

                      {/* ========================= Employee ========================= */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">

                            {employee.profile_image ? (
                              <img
                                src={
                                  employee.profile_image
                                }
                                alt={
                                  employeeName
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(
                                employee
                              )
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {employeeName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ========================= Employee Code ========================= */}

                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-700">
                          {
                            employee.employee_code
                          }
                        </span>
                      </td>

                      {/* ========================= Department ========================= */}

                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-600">
                          {employee.department ||
                            "Not added"}
                        </span>
                      </td>

                      {/* ========================= Designation ========================= */}

                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-600">
                          {employee.designation ||
                            "Not added"}
                        </span>
                      </td>

                      {/* ========================= Email ========================= */}

                      <td className="px-5 py-4">
                        <span className="block max-w-[190px] truncate text-xs text-slate-600">
                          {
                            employee.email
                          }
                        </span>
                      </td>

                      {/* ========================= Phone ========================= */}

                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-600">
                          {employee.phone ||
                            "Not added"}
                        </span>
                      </td>

                      {/* ========================= Status ========================= */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              status ===
                              "Enabled"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />

                          <span
                            className={`text-xs font-medium ${
                              status ===
                              "Enabled"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {status}
                          </span>

                        </div>
                      </td>

                      {/* ========================= Joined Date ========================= */}

                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-600">
                          {getJoinedDate(
                            employee
                          )}
                        </span>
                      </td>

                      {/* ========================= Actions ========================= */}

                      <td className="relative px-5 py-4">
                        <div className="flex justify-end">

                          <button
                            type="button"
                            onClick={() =>
                              handleMenuToggle(
                                employeeId
                              )
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 ${
                              openMenu ===
                              employeeId
                                ? "bg-[#F0F0FF] text-[#2E3192]"
                                : "hover:bg-slate-100 hover:text-slate-700"
                            }`}
                            aria-label={`Actions for ${employeeName}`}
                          >
                            <Ellipsis
                              size={18}
                              strokeWidth={
                                1.8
                              }
                            />
                          </button>

                          {openMenu ===
                            employeeId && (
                            <EmployeeActionMenu
                              employee={
                                employee
                              }
                              onView={
                                onView
                              }
                              onEdit={
                                onEdit
                              }
                              onDisable={
                                onDisable
                              }
                              onDelete={
                                onDelete
                              }
                              onClose={() =>
                                setOpenMenu(
                                  null
                                )
                              }
                            />
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        {/* ========================= TABLET / MOBILE CARDS ========================= */}

        <div className="divide-y divide-slate-100 xl:hidden">
          {employees.map(
            (employee) => {
              const employeeId =
                employee.uuid ||
                employee.id;

              const employeeName =
                getEmployeeName(
                  employee
                );

              const status =
                getStatusLabel(
                  employee
                );

              return (
                <div
                  key={employeeId}
                  className="relative p-4 sm:p-5"
                >

                  {/* ========================= Top ========================= */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      {/* Avatar */}

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xs font-semibold text-slate-700">

                        {employee.profile_image ? (
                          <img
                            src={
                              employee.profile_image
                            }
                            alt={
                              employeeName
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(
                            employee
                          )
                        )}
                      </div>

                      {/* Name */}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {employeeName}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {employee.designation ||
                            employee.role ||
                            "Employee"}
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {
                            employee.email
                          }
                        </p>
                      </div>
                    </div>

                    {/* ========================= Mobile Actions ========================= */}

                    <div className="relative shrink-0">

                      <button
                        type="button"
                        onClick={() =>
                          handleMenuToggle(
                            employeeId
                          )
                        }
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 ${
                          openMenu ===
                          employeeId
                            ? "bg-[#F0F0FF] text-[#2E3192]"
                            : "hover:bg-slate-100 hover:text-slate-700"
                        }`}
                        aria-label={`Actions for ${employeeName}`}
                      >
                        <Ellipsis
                          size={18}
                          strokeWidth={
                            1.8
                          }
                        />
                      </button>

                      {openMenu ===
                        employeeId && (
                        <EmployeeActionMenu
                          employee={
                            employee
                          }
                          onView={
                            onView
                          }
                          onEdit={
                            onEdit
                          }
                          onDisable={
                            onDisable
                          }
                          onDelete={
                            onDelete
                          }
                          onClose={() =>
                            setOpenMenu(
                              null
                            )
                          }
                        />
                      )}

                    </div>
                  </div>

                  {/* ========================= Details ========================= */}

                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">

                    {/* Employee Code */}

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Employee Code
                      </p>

                      <p className="mt-2 text-xs font-medium text-slate-700">
                        {
                          employee.employee_code
                        }
                      </p>
                    </div>

                    {/* Department */}

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Department
                      </p>

                      <p className="mt-2 truncate text-xs text-slate-600">
                        {employee.department ||
                          "Not added"}
                      </p>
                    </div>

                    {/* Designation */}

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Designation
                      </p>

                      <p className="mt-2 truncate text-xs text-slate-600">
                        {employee.designation ||
                          "Not added"}
                      </p>
                    </div>

                    {/* Phone */}

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Phone
                      </p>

                      <p className="mt-2 text-xs text-slate-600">
                        {employee.phone ||
                          "Not added"}
                      </p>
                    </div>

                    {/* Employment Type */}

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Employment
                      </p>

                      <p className="mt-2 text-xs text-slate-600">
                        {getEmploymentTypeLabel(
                          employee
                        )}
                      </p>
                    </div>

                    {/* Status */}

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Status
                      </p>

                      <div className="mt-2 flex items-center gap-2">

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            status ===
                            "Enabled"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />

                        <span
                          className={`text-xs font-medium ${
                            status ===
                            "Enabled"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {status}
                        </span>

                      </div>
                    </div>

                    {/* Joined Date */}

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Joined Date
                      </p>

                      <p className="mt-2 text-xs text-slate-600">
                        {getJoinedDate(
                          employee
                        )}
                      </p>
                    </div>

                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* ========================= Empty State ========================= */}

        {employees.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-slate-600">
              No employees found
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