// Social Calendar Platform
export type SocialCalendarPlatform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube";

// Social Calendar Post Status
export type SocialCalendarStatus =
  | "draft"
  | "approved"
  | "scheduled"
  | "published";

// Social Calendar Content Type
export type SocialCalendarContentType =
  | "post"
  | "reel"
  | "carousel"
  | "story";

// Client information included with social calendar post
export interface SocialCalendarClient {
  id: number;
  uuid: string;
  name: string;
}

// User information included with social calendar post
export interface SocialCalendarUser {
  id: number;
  first_name: string;
  last_name: string;
}

// Social Calendar Post
export interface SocialCalendarPost {
  id: number;
  uuid: string;
  client_id: number;
  post_date: string;
  platform: SocialCalendarPlatform;
  status: SocialCalendarStatus;
  content_type: SocialCalendarContentType;
  note: string | null;
  created_by: number | null;
  updated_by: number | null;
  createdAt: string;
  updatedAt: string;

  client?: SocialCalendarClient;
  createdBy?: SocialCalendarUser;
  updatedBy?: SocialCalendarUser;
}

// Create Social Calendar Post Payload
// Names must match backend field names
export interface CreateSocialCalendarPostPayload {
  client_id: number;
  post_date: string;
  platform: SocialCalendarPlatform;
  status?: SocialCalendarStatus;
  content_type: SocialCalendarContentType;
  note?: string | null;
}

// Update Social Calendar Post Payload
export interface UpdateSocialCalendarPostPayload {
  client_id?: number;
  post_date?: string;
  platform?: SocialCalendarPlatform;
  status?: SocialCalendarStatus;
  content_type?: SocialCalendarContentType;
  note?: string | null;
}

// Social Calendar List Query
export interface SocialCalendarListQuery {
  client_id?: number;
  start_date?: string;
  end_date?: string;
  platform?: SocialCalendarPlatform;
  status?: SocialCalendarStatus;
  content_type?: SocialCalendarContentType;
}

// Social Calendar List Response Data
export interface SocialCalendarListResponseData {
  count: number;
  rows: SocialCalendarPost[];
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

export type CreateSocialCalendarPostResponse =
  ApiResponse<SocialCalendarPost>;

export type GetSocialCalendarPostResponse =
  ApiResponse<SocialCalendarPost>;

export type GetSocialCalendarPostsResponse =
  ApiResponse<SocialCalendarListResponseData>;

export type UpdateSocialCalendarPostResponse =
  ApiResponse<SocialCalendarPost>;

export type DeleteSocialCalendarPostResponse =
  ApiResponse<null>;