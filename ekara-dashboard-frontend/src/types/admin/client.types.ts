export type ClientStatus = "ACTIVE" | "INACTIVE";

export type ClientServiceName =
  | "META_ADS"
  | "GOOGLE_ADS"
  | "WEBSITE_SALES"
  | "ORGANIC_SOCIAL";

export interface ClientService {
  id: number;
  uuid: string;
  client_id: number;
  service_name: ClientServiceName;
  monthly_budget: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientServicePayload {
  service_name: ClientServiceName;
  monthly_budget: number;
}

// Client
export interface Client {
  id: number;
  uuid: string;
  name: string;
  email: string;
  login_id: string;
  monthly_service_fee: number;
  profile_photo: string | null;
  website_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  agreement_contract: string | null;
  status: ClientStatus;
  created_by: number | null;
  updated_by: number | null;
  createdAt: string;
  updatedAt: string;
  clientServices: ClientService[];
}

// Create Client Payload (names must match backend field names)
export interface CreateClientPayload {
  name: string;
  email: string;
  login_id: string;
  password: string;
  monthly_service_fee: number;
  website_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  status?: ClientStatus;
  services: ClientServicePayload[];
  profile_photo?: File | null;
  agreement_contract?: File | null;
}

// Update Client Payload
export interface UpdateClientPayload {
  name?: string;
  email?: string;
  login_id?: string;
  password?: string;
  monthly_service_fee?: number;
  website_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  status?: ClientStatus;
  services?: ClientServicePayload[];
  profile_photo?: File | null;
  agreement_contract?: File | null;
}

// Client List Query
export interface ClientListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ClientStatus;
}

// Client List Response Data
export interface ClientListResponseData {
  count: number;
  rows: Client[];
  page: number;
  limit: number;
  totalPages: number;
}

// Update Client Status
export interface UpdateClientStatusPayload {
  status: ClientStatus;
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
export type CreateClientResponse = ApiResponse<Client>;
export type GetClientResponse = ApiResponse<Client>;
export type GetClientsResponse = ApiResponse<ClientListResponseData>;
export type UpdateClientResponse = ApiResponse<Client>;
export type UpdateClientStatusResponse = ApiResponse<Client>;
export type DeleteClientResponse = ApiResponse<null>;
export type RestoreClientResponse = ApiResponse<Client>;
export type ForceDeleteClientResponse = ApiResponse<boolean>;
export type GetTrashClientsResponse = ApiResponse<ClientListResponseData>;