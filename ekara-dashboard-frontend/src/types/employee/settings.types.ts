/* =========================================================
   EMPLOYEE SETTINGS TYPES
========================================================= */

/* =========================
   Employee Profile
========================= */

export interface EmployeeProfile {
  id: number;
  uuid: string;

  first_name: string;
  last_name: string | null;

  email: string;

  role: "EMPLOYEE";

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

/* =========================
   Update Employee Profile
========================= */

export interface UpdateEmployeeProfilePayload {
  first_name: string;
  last_name?: string | null;
  email: string;
}

/* =========================
   Employee Profile API Response
========================= */

export interface EmployeeProfileResponse {
  user: EmployeeProfile;
}

/* =========================
   Change Employee Password
========================= */

export interface ChangeEmployeePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/* =========================
   Employee Settings Section
========================= */

export type EmployeeSettingsSection =
  | "profile"
  | "security";