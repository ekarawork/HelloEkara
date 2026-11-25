// =========================================================
// Google Ads Dashboard Stats
// =========================================================

export interface ClientGoogleAdsDashboardStats {
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
}

// =========================================================
// Daily Leads
// =========================================================

export interface ClientGoogleAdsDailyLead {
  date: string;
  leads: number;
}

// =========================================================
// Daily Spend
// =========================================================

export interface ClientGoogleAdsDailySpend {
  date: string;
  spend: number;
}

// =========================================================
// Dashboard Response Data
// =========================================================

export interface ClientGoogleAdsDashboardData {
  stats: ClientGoogleAdsDashboardStats;
  dailyLeads: ClientGoogleAdsDailyLead[];
  dailySpend: ClientGoogleAdsDailySpend[];
}

// =========================================================
// Dashboard Query
// =========================================================

export interface ClientGoogleAdsDashboardQuery {
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
// Google Ads Dashboard API Response
// =========================================================

export type GetClientGoogleAdsDashboardResponse =
  ApiResponse<ClientGoogleAdsDashboardData>;