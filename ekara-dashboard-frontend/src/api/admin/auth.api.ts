import axiosInstance from "@/src/lib/axios";

import {
  LoginPayload,
  LoginResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  LogoutResponse,
} from "@/src/types/admin/auth.types";

const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/admin/auth/login",
    payload
  );

  return response.data;
};

const refreshToken = async (
  payload: RefreshTokenPayload
): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post<RefreshTokenResponse>(
    "/admin/auth/refresh-token",
    payload
  );

  return response.data;
};

const logout = async (
  payload: RefreshTokenPayload
): Promise<LogoutResponse> => {
  const response = await axiosInstance.post<LogoutResponse>(
    "/admin/auth/logout",
    payload
  );

  return response.data;
};

const logoutAll = async (): Promise<LogoutResponse> => {
  const response = await axiosInstance.post<LogoutResponse>(
    "/admin/auth/logout-all"
  );

  return response.data;
};

export const authApi = {
  login,
  refreshToken,
  logout,
  logoutAll,
};