import { authApi } from "@/src/api/admin/auth.api";

import {
  LoginPayload,
  LoginResponseData,
  RefreshTokenPayload,
  RefreshTokenResponseData,
} from "@/src/types/admin/auth.types";

import {
  saveAccessToken,
  saveRefreshToken,
  saveUser,
  clearAuth,
  getRefreshToken,
} from "@/src/utils/storage";

const login = async (
  payload: LoginPayload
): Promise<LoginResponseData> => {

  const response = await authApi.login(payload);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Login failed."
    );
  }

  const {
    accessToken,
    refreshToken,
    user,
  } = response.data;

  saveAccessToken(accessToken);
  saveRefreshToken(refreshToken);
  saveUser(user);

  return response.data;
};

const refreshToken = async (
  payload: RefreshTokenPayload
): Promise<RefreshTokenResponseData> => {

  const response =
    await authApi.refreshToken(payload);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
      "Token refresh failed."
    );
  }

  const {
    accessToken,
    refreshToken: newRefreshToken,
  } = response.data;

  saveAccessToken(accessToken);
  saveRefreshToken(newRefreshToken);

  return response.data;
};

const logout = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await authApi.logout({
        refreshToken,
      });
    }

    return true;
  } catch {
    return false;
  } finally {
    clearAuth();
  }
};

const logoutAll = async (): Promise<void> => {

  try {

    await authApi.logoutAll();

  } finally {

    clearAuth();
  }
};


export const authService = {
  login,
  refreshToken,
  logout,
  logoutAll,
};