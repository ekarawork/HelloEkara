// =========================================================
// Meta Ads Dashboard Stats
// =========================================================

export interface ClientMetaAdsDashboardStats {
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
}

// =========================================================
// Daily Leads
// =========================================================

export interface ClientMetaAdsDailyLead {
  date: string;
  leads: number;
}

// =========================================================
// Daily Spend
// =========================================================

export interface ClientMetaAdsDailySpend {
  date: string;
  spend: number;
}

// =========================================================
// Dashboard Response Data
// =========================================================

export interface ClientMetaAdsDashboardData {
  stats: ClientMetaAdsDashboardStats;
  dailyLeads: ClientMetaAdsDailyLead[];
  dailySpend: ClientMetaAdsDailySpend[];
}

// =========================================================
// Dashboard Query
// =========================================================

export interface ClientMetaAdsDashboardQuery {
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
// Meta Ads Dashboard API Response
// =========================================================

export type GetClientMetaAdsDashboardResponse =
  ApiResponse<ClientMetaAdsDashboardData>;