import { clientPortalApi } from "@/src/api/admin/clientPortal.api";

import {
  ClientPortalAccessData,
} from "@/src/types/admin/clientPortal.types";

// Create Client Portal Preview Access
const createClientPortalAccess = async (
  clientUuid: string
): Promise<ClientPortalAccessData> => {
  const response =
    await clientPortalApi.createClientPortalAccess(
      clientUuid
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to create client portal access."
    );
  }

  return response.data;
};

// Export
export const clientPortalService = {
  createClientPortalAccess,
};