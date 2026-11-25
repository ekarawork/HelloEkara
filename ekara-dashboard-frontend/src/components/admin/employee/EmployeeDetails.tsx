"use client";

import {
  Mail,
  User,
  Phone,
  Briefcase,
  CalendarDays,
  ShieldCheck,
  LogIn,
  Hash,
  Building2,
  BadgeCheck,
  Clock,
  UserRound,
} from "lucide-react";

import { Employee } from "@/src/types/admin/employee.types";

/* ========================= Props ========================= */

interface EmployeeDetailsProps {
  employee: Employee;
}

/* ========================= Component ========================= */

export default function EmployeeDetails({
  employee,
}: EmployeeDetailsProps) {
  /* ========================= Status ========================= */

  const getStatusLabel = () => {
    return employee.status === "ACTIVE"
      ? "Active"
      : "Inactive";
  };

  const getStatusClass = () => {
    return employee.status === "ACTIVE"
      ? "bg-[#F0F0FF] text-[#2E3192]"
      : "bg-slate-100 text-slate-500";
  };

  /* ========================= Employee Name ========================= */

  const employeeName =
    `${employee.first_name} ${employee.last_name}`.trim();

  /* ========================= Initials ========================= */

  const initials =
    `${employee.first_name?.[0] || ""}${employee.last_name?.[0] || ""}`
      .toUpperCase();

  /* ========================= Employment Type ========================= */

  const getEmploymentTypeLabel = () => {
    switch (employee.employment_type) {
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

  /* ========================= Date Formatter ========================= */

  const formatDate = (
    date: string | null | undefined
  ) => {
    if (!date) {
      return "Not added";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ========================= Render ========================= */

  return (
    <div className="space-y-5">
      {/* ========================= Profile ========================= */}

      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
          {employee.profile_image ? (
            <img
              src={employee.profile_image}
              alt={employeeName}
              className="h-full w-full object-cover"
            />
          ) : (
            initials || (
              <User
                size={20}
                strokeWidth={1.8}
              />
            )
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {employeeName}
          </h3>

          <p className="truncate text-xs text-slate-400">
            {employee.designation ||
              employee.role ||
              "Employee"}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {employee.email}
          </p>
        </div>

        <span
          className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass()}`}
        >
          {getStatusLabel()}
        </span>
      </div>

      {/* ========================= Basic Information ========================= */}

      <DetailSection title="Basic Information">
        <DetailItem
          icon={
            <User
              size={15}
            />
          }
          label="Employee name"
          value={employeeName}
        />

        <DetailItem
          icon={
            <Mail
              size={15}
            />
          }
          label="Email"
          value={employee.email}
        />

        <DetailItem
          icon={
            <Phone
              size={15}
            />
          }
          label="Phone"
          value={
            employee.phone ||
            "Not added"
          }
        />

        <DetailItem
          icon={
            <Hash
              size={15}
            />
          }
          label="Employee code"
          value={
            employee.employee_code
          }
        />
      </DetailSection>

      {/* ========================= Employment Information ========================= */}

      <DetailSection title="Employment Information">
        <DetailItem
          icon={
            <Building2
              size={15}
            />
          }
          label="Department"
          value={
            employee.department ||
            "Not added"
          }
        />

        <DetailItem
          icon={
            <Briefcase
              size={15}
            />
          }
          label="Designation"
          value={
            employee.designation ||
            "Not added"
          }
        />

        <DetailItem
          icon={
            <CalendarDays
              size={15}
            />
          }
          label="Joining date"
          value={formatDate(
            employee.joining_date
          )}
        />

        <DetailItem
          icon={
            <BadgeCheck
              size={15}
            />
          }
          label="Employment type"
          value={getEmploymentTypeLabel()}
        />
      </DetailSection>

      {/* ========================= Role & Access ========================= */}

      <DetailSection title="Role & Access">
        <DetailItem
          icon={
            <ShieldCheck
              size={15}
            />
          }
          label="Employee role"
          value={
            employee.role ||
            "EMPLOYEE"
          }
        />

        <DetailItem
          icon={
            <UserRound
              size={15}
            />
          }
          label="Portal role"
          value={
            employee.user?.role ||
            "EMPLOYEE"
          }
        />

        <DetailItem
          icon={
            <Hash
              size={15}
            />
          }
          label="Login user ID"
          value={
            employee.user_id
              ? String(employee.user_id)
              : "Not available"
          }
        />
      </DetailSection>

      {/* ========================= Account Status ========================= */}

      <DetailSection title="Account Status">
        <DetailItem
          icon={
            <BadgeCheck
              size={15}
            />
          }
          label="Employee status"
          value={getStatusLabel()}
        />

        <DetailItem
          icon={
            <LogIn
              size={15}
            />
          }
          label="Login account status"
          value={
            employee.user?.status ===
            "ACTIVE"
              ? "Active"
              : employee.user?.status ===
                "INACTIVE"
              ? "Inactive"
              : "Not available"
          }
        />

        <DetailItem
          icon={
            <Clock
              size={15}
            />
          }
          label="Last login"
          value={formatDateTime(
            employee.user?.last_login
          )}
        />
      </DetailSection>

      {/* ========================= Created / Updated Information ========================= */}

      <DetailSection title="Record Information">
        <DetailItem
          icon={
            <CalendarDays
              size={15}
            />
          }
          label="Created at"
          value={formatDateTime(
            employee.createdAt
          )}
        />

        <DetailItem
          icon={
            <Clock
              size={15}
            />
          }
          label="Last updated"
          value={formatDateTime(
            employee.updatedAt
          )}
        />

        <DetailItem
          icon={
            <UserRound
              size={15}
            />
          }
          label="Created by"
          value={
            employee.created_by
              ? String(
                  employee.created_by
                )
              : "System"
          }
        />

        <DetailItem
          icon={
            <UserRound
              size={15}
            />
          }
          label="Updated by"
          value={
            employee.updated_by
              ? String(
                  employee.updated_by
                )
              : "System"
          }
        />
      </DetailSection>
    </div>
  );
}

/* ========================= Detail Section ========================= */

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

/* ========================= Detail Item ========================= */

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

/* ========================= Date Time Formatter ========================= */

function formatDateTime(
  date: string | null | undefined
): string {
  if (!date) {
    return "Not available";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}