// Performance Service Name
export type ClientPerformanceServiceName =
  | "META_ADS"
  | "GOOGLE_ADS"
  | "WEBSITE_SALES"
  | "ORGANIC_SOCIAL";

// Client information included with performance
export interface PerformanceClient {
  id: number;
  uuid: string;
  name: string;
}

// Client Service information included with performance
export interface PerformanceClientService {
  id: number;
  uuid: string;
  client_id: number;
  service_name: ClientPerformanceServiceName;
  monthly_budget: number;
}

// Client Service option used in performance search/filter and form
export interface ClientServiceOption {
  id: number;
  uuid: string;
  client_id: number;
  service_name: ClientPerformanceServiceName;
  monthly_budget: number;
}

// User information included with performance
export interface PerformanceUser {
  id: number;
  first_name: string;
  last_name: string;
}

// Client Performance
export interface ClientPerformance {
  id: number;
  uuid: string;
  client_id: number;
  client_service_id: number;
  performance_date: string;
  daily_spend: number | string;
  impressions: number;
  clicks: number;
  leads: number;
  edit_count: number;
  created_by: number | null;
  updated_by: number | null;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;

  client?: PerformanceClient;
  clientService?: PerformanceClientService;
  createdBy?: PerformanceUser;
  updatedBy?: PerformanceUser;
}

// Create Performance Payload
// Names must match backend field names
export interface CreateClientPerformancePayload {
  client_id: number;
  client_service_id: number;
  performance_date: string;
  daily_spend?: number;
  impressions?: number;
  clicks?: number;
  leads?: number;
}

// Update Performance Payload
export interface UpdateClientPerformancePayload {
  client_id?: number;
  client_service_id?: number;
  performance_date?: string;
  daily_spend?: number;
  impressions?: number;
  clicks?: number;
  leads?: number;
}

// Performance List Query
export interface ClientPerformanceListQuery {
  page?: number;
  limit?: number;
  search?: string;
  serviceName?: ClientPerformanceServiceName;
}

// Performance List Response Data
export interface ClientPerformanceListResponseData {
  count: number;
  rows: ClientPerformance[];
  page: number;
  limit: number;
  totalPages: number;
}

/* ========================= Dashboard ========================= */

// Dashboard summary statistics
export interface ClientPerformanceDashboardStats {
  leads: number;
  spend: number;
  impressions: number;
  clicks: number;
}

// Daily leads data used for dashboard chart
export interface ClientPerformanceDailyLeads {
  date: string;
  leads: number;
}

// Dashboard response data
export interface ClientPerformanceDashboardData {
  stats: ClientPerformanceDashboardStats;
  dailyLeads: ClientPerformanceDailyLeads[];
}

// Dashboard query parameters
export interface ClientPerformanceDashboardQuery {
  startDate?: string;
  endDate?: string;
  serviceName?: ClientPerformanceServiceName;
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

// API Responses
export type CreateClientPerformanceResponse =
  ApiResponse<ClientPerformance>;

export type GetClientPerformanceResponse =
  ApiResponse<ClientPerformance>;

export type GetClientPerformancesResponse =
  ApiResponse<ClientPerformanceListResponseData>;

export type UpdateClientPerformanceResponse =
  ApiResponse<ClientPerformance>;

export type DeleteClientPerformanceResponse =
  ApiResponse<null>;

export type RestoreClientPerformanceResponse =
  ApiResponse<ClientPerformance>;

export type ForceDeleteClientPerformanceResponse =
  ApiResponse<boolean>;

export type GetTrashClientPerformancesResponse =
  ApiResponse<ClientPerformanceListResponseData>;

// Dashboard API Response
export type GetClientPerformanceDashboardResponse =
  ApiResponse<ClientPerformanceDashboardData>;