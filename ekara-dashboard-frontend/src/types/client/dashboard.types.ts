// =========================================================
// Dashboard Stats
// =========================================================

export interface ClientDashboardStats {
  adSpend: number;
  leads: number;
  impressions: number;
  clicks: number;
  conversionRate: number;
}

// =========================================================
// Daily Leads
// =========================================================

export interface ClientDashboardDailyLead {
  date: string;
  leads: number;
}

// =========================================================
// Daily Ad Spend
// =========================================================

export interface ClientDashboardDailyAdSpend {
  date: string;
  spend: number;
}

// =========================================================
// Dashboard Charts
// =========================================================

export interface ClientDashboardCharts {
  dailyLeads: ClientDashboardDailyLead[];
  dailyAdSpend: ClientDashboardDailyAdSpend[];
}

// =========================================================
// Client Progress
// =========================================================

export interface ClientDashboardServiceProgress {
  spent: number;
  budget: number;
  percentage: number;
}

export interface ClientDashboardProgress {
  metaAds: ClientDashboardServiceProgress;
  googleAds: ClientDashboardServiceProgress;
}

// =========================================================
// Current Payment
// =========================================================

export interface ClientDashboardPayment {
  uuid: string;
  paymentMonth: string;
  amount: number;
  dueDate: string;
  status: "due" | "paid" | "overdue";
  paidAt: string | null;
  remindersEnabled: boolean;
}

// =========================================================
// Payments
// =========================================================

export interface ClientDashboardPayments {
  current: ClientDashboardPayment | null;
}

// =========================================================
// Upcoming Content
// =========================================================

export interface ClientDashboardUpcomingPost {
  uuid: string;
  postDate: string;
  platform:
    | "instagram"
    | "facebook"
    | "linkedin"
    | "youtube";
  status:
    | "draft"
    | "approved"
    | "scheduled"
    | "published";
  contentType:
    | "post"
    | "reel"
    | "carousel"
    | "story";
  note: string | null;
}

export interface ClientDashboardUpcomingContent {
  nextPost: ClientDashboardUpcomingPost | null;
}

// =========================================================
// Dashboard Response Data
// =========================================================

export interface ClientDashboardData {
  stats: ClientDashboardStats;
  charts: ClientDashboardCharts;
  clientProgress: ClientDashboardProgress;
  payments: ClientDashboardPayments;
  upcomingContent: ClientDashboardUpcomingContent;
}

// =========================================================
// Dashboard Query
// =========================================================

export interface ClientDashboardQuery {
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
// Client Dashboard API Response
// =========================================================

export type GetClientDashboardResponse =
  ApiResponse<ClientDashboardData>;