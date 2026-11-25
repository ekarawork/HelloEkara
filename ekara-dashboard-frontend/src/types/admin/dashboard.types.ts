// Dashboard Stats
export interface DashboardStats {
  totalServiceFees: number;
  activeClients: number;
  totalImpressions: number;
  totalAdSpend: number;
  totalDuePayment: number;
  totalEmployees: number;
  totalLeads: number;
  totalClicks: number;
}

// Daily Leads
export interface DashboardDailyLead {
  performance_date: string;
  leads: number;
}

// Daily Ad Spend
export interface DashboardDailyAdSpend {
  performance_date: string;
  adSpend: number;
}

// Daily Performance
export interface DashboardDailyPerformance {
  dailyLeads: DashboardDailyLead[];
  dailyAdSpend: DashboardDailyAdSpend[];
}

// Client Service
export interface DashboardClientService {
  id: number;
  uuid: string;
  service_name:
    | "META_ADS"
    | "GOOGLE_ADS"
    | "WEBSITE_SALES"
    | "ORGANIC_SOCIAL";
  monthly_budget: number;
}

// Client Overview
export interface DashboardClient {
  id: number;
  uuid: string;
  name: string;
  email: string;
  profile_photo: string | null;
  monthly_service_fee: number;
  clientServices: DashboardClientService[];
}

// Individual Client Performance
export interface DashboardClientPerformance {
  clientId: number;
  client: {
    id: number;
    uuid: string;
    name: string;
    email: string;
  } | null;
  totalAdSpend: number;
  totalLeads: number;
  totalClicks: number;
  totalImpressions: number;
  conversionRate: number;
  totalDuePayment: number;
}

// Dashboard Query
export interface DashboardQuery {
  days?: number;
}

// Dashboard Response Data
export interface DashboardResponseData {
  days: number;
  startDate: string;
  endDate: string;
  stats: DashboardStats;
  dailyPerformance: DashboardDailyPerformance;
  clients: DashboardClient[];
  clientPerformance: DashboardClientPerformance[];
}

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

// API Response
export type GetDashboardResponse =
  ApiResponse<DashboardResponseData>;