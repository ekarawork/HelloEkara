 // =========================================================
 // Social Calendar Platform
 // =========================================================

export type SocialCalendarPlatform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube";

// =========================================================
// Social Calendar Status
// =========================================================

export type SocialCalendarStatus =
  | "draft"
  | "approved"
  | "scheduled"
  | "published";

// =========================================================
// Social Calendar Content Type
// =========================================================

export type SocialCalendarContentType =
  | "post"
  | "reel"
  | "carousel"
  | "story";

// =========================================================
// Social Calendar Post
// =========================================================

export interface ClientSocialCalendarPost {
  id: number;
  uuid: string;
  client_id: number;
  post_date: string;
  platform: SocialCalendarPlatform;
  status: SocialCalendarStatus;
  content_type: SocialCalendarContentType;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

// =========================================================
// Social Calendar Dashboard Response Data
// =========================================================

export interface ClientSocialCalendarDashboardData {
  rows: ClientSocialCalendarPost[];
}

// =========================================================
// Social Calendar Dashboard Query
// =========================================================

export interface ClientSocialCalendarDashboardQuery {
  startDate?: string;
  endDate?: string;
  platform?: SocialCalendarPlatform;
  status?: SocialCalendarStatus;
  contentType?: SocialCalendarContentType;
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
// Social Calendar Dashboard API Response
// =========================================================

export type GetClientSocialCalendarDashboardResponse =
  ApiResponse<ClientSocialCalendarDashboardData>;