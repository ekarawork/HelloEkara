import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  getRefreshToken,
  getClientPortalPreviewToken,
  saveAccessToken,
  saveRefreshToken,
  clearAuth,
} from "@/src/utils/storage";

interface RetryAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

/* ================================================================
 * REQUEST INTERCEPTOR
 * ================================================================ */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    /*
     * IMPORTANT:
     *
     * If a request already has an Authorization header
     * (for example Client Portal Preview Token),
     * do NOT overwrite it with the Admin access token.
     */
    const hasAuthorizationHeader =
      !!config.headers?.Authorization;

    if (!hasAuthorizationHeader) {
      const previewToken =
        getClientPortalPreviewToken();

      const isClientPortalRequest =
        config.url?.includes("/client/");

      const token =
        isClientPortalRequest && previewToken
          ? previewToken
          : getAccessToken();

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] =
        "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================================================
 * RESPONSE INTERCEPTOR
 * ================================================================ */

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryAxiosRequestConfig;

    const requestUrl =
      originalRequest?.url || "";

    const isLoginRequest =
      requestUrl.includes(
        "/admin/auth/login"
      );

    const isRefreshTokenRequest =
      requestUrl.includes(
        "/admin/auth/refresh-token"
      );

    const isLogoutRequest =
      requestUrl.includes(
        "/admin/auth/logout"
      ) ||
      requestUrl.includes(
        "/admin/auth/logout-all"
      );

    const isClientPortalVerifyRequest =
      requestUrl.includes(
        "/admin/client-portal/verify"
      );

    const isClientPortalRequest =
      requestUrl.includes("/client/") ||
      isClientPortalVerifyRequest;

    const isAuthRequest =
      isLoginRequest ||
      isRefreshTokenRequest ||
      isLogoutRequest;

    /* ============================================================
     * CLIENT PORTAL PREVIEW
     *
     * Never use Admin refresh-token flow for
     * Client Portal Preview authentication.
     * ============================================================
     */

    if (
      error.response?.status === 401 &&
      isClientPortalRequest
    ) {
      return Promise.reject(error);
    }

    /* ============================================================
     * NORMAL ADMIN AUTH REFRESH
     * ============================================================
     */

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          getRefreshToken();

        if (!refreshToken) {
          clearAuth();

          if (
            typeof window !== "undefined"
          ) {
            window.location.href =
              "/admin/login";
          }

          return Promise.reject(error);
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        const newAccessToken =
          response.data.data.accessToken;

        const newRefreshToken =
          response.data.data.refreshToken;

        saveAccessToken(
          newAccessToken
        );

        saveRefreshToken(
          newRefreshToken
        );

        if (originalRequest.headers) {
          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;
        }

        return axiosInstance(
          originalRequest
        );
      } catch (refreshError) {
        clearAuth();

        if (
          typeof window !== "undefined"
        ) {
          window.location.href =
            "/admin/login";
        }

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;