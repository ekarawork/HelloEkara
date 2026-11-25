/* =========================================================
   ADMIN SETTINGS TYPES
========================================================= */

/* =========================
   Admin Profile
========================= */

export interface AdminProfile {
  id: number;
  uuid: string;

  first_name: string;
  last_name: string | null;

  email: string;

  role: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" | "CLIENT";

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";

  last_login: string | null;
}

/* =========================
   Update Admin Profile
========================= */

export interface UpdateAdminProfilePayload {
  first_name: string;
  last_name?: string | null;
  email: string;
}

/* =========================
   Admin Profile API Response
========================= */

export interface AdminProfileResponse {
  user: AdminProfile;
}

/* =========================
   Payment Reminder Settings
========================= */

export interface PaymentReminderSettings {
  id: number;

  before_due_enabled: boolean;
  before_due_days: number;

  due_day_enabled: boolean;

  after_due_enabled: boolean;
  after_due_days: number;

  created_by: number | null;
  updated_by: number | null;

  createdAt: string;
  updatedAt: string;
}

/* =========================
   Update Payment Reminder Settings
========================= */

export interface UpdatePaymentReminderSettingsPayload {
  before_due_enabled: boolean;
  before_due_days: number;

  due_day_enabled: boolean;

  after_due_enabled: boolean;
  after_due_days: number;
}

/* =========================
   Settings Section
========================= */

export type AdminSettingsSection =
  | "profile"
  | "payment-reminders"
  | "security"
  | "contracts";


/* =========================
   Change Admin Password
========================= */

export interface ChangeAdminPasswordPayload {
  current_password: string;
  new_password: string;
}