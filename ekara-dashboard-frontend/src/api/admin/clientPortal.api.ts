import axiosInstance from "@/src/lib/axios";

import {
  CreateClientPortalAccessResponse,
  ClientPortalVerifyResponse,
} from "@/src/types/admin/clientPortal.types";

/* ================================================================
 * Create Client Portal Preview Access
 * ================================================================ */

const createClientPortalAccess = async (
  clientUuid: string
): Promise<CreateClientPortalAccessResponse> => {
  const response =
    await axiosInstance.post<CreateClientPortalAccessResponse>(
      `/admin/client-portal/${clientUuid}/access`
    );

  return response.data;
};

/* ================================================================
 * Verify Client Portal Preview Access
 * ================================================================ */

const verifyClientPortalAccess = async (
  previewToken: string
): Promise<ClientPortalVerifyResponse> => {
  const response =
    await axiosInstance.get<ClientPortalVerifyResponse>(
      "/admin/client-portal/verify",
      {
        headers: {
          Authorization: `Bearer ${previewToken}`,
        },
      }
    );

  return response.data;
};

/* ================================================================
 * Export
 * ================================================================ */

export const clientPortalApi = {
  createClientPortalAccess,
  verifyClientPortalAccess,
};