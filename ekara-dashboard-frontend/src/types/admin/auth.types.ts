export interface LoginPayload {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface AuthUser {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string | null;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" | "CLIENT";
}

export interface LoginResponseData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;
export type LogoutResponse = ApiResponse<null>;