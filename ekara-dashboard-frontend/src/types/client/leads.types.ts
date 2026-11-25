// =========================================================
// Daily Leads
// =========================================================

export interface ClientLeadsDailyLead {
  date: string;
  leads: number;
}

// =========================================================
// Leads By Platform
// =========================================================

export interface ClientLeadsByPlatform {
  platform: string;
  leads: number;
}

// =========================================================
// Daily Leads By Platform
// =========================================================

export interface ClientLeadsPlatformDailyLead {
  date: string;
  meta: number;
  google: number;
}

// =========================================================
// Leads Dashboard Response Data
// =========================================================

export interface ClientLeadsDashboardData {
  dailyLeads: ClientLeadsDailyLead[];

  leadsByPlatform: ClientLeadsByPlatform[];

  platformDailyLeads: ClientLeadsPlatformDailyLead[];
}

// =========================================================
// Leads Dashboard Query
// =========================================================

export interface ClientLeadsDashboardQuery {
  startDate?: string;
  endDate?: string;
}

// =========================================================
// Generic API Response
// =========================================================

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

// =========================================================
// Leads Dashboard API Response
// =========================================================

export type GetClientLeadsDashboardResponse =
  ApiResponse<ClientLeadsDashboardData>;