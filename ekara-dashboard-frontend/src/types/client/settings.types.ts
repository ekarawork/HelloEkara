/* =========================================================
   CLIENT SETTINGS TYPES
========================================================= */

/* =========================
   Client Profile
========================= */

export interface ClientProfile {
  id: number;
  uuid: string;

  first_name: string;
  last_name: string | null;

  email: string;

  role: "CLIENT";

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

/* =========================
   Update Client Profile
========================= */

export interface UpdateClientProfilePayload {
  first_name: string;
  last_name?: string | null;
  email: string;
}

/* =========================
   Client Profile API Response
========================= */

export interface ClientProfileResponse {
  user: ClientProfile;
}

/* =========================
   Change Client Password
========================= */

export interface ChangeClientPasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/* =========================
   Client Settings Section
========================= */

export type ClientSettingsSection =
  | "profile"
  | "security";