import axiosInstance from "@/src/lib/axios";

import {
  CreateClientPayload,
  CreateClientResponse,
  GetClientResponse,
  GetClientsResponse,
  GetTrashClientsResponse,
  UpdateClientPayload,
  UpdateClientResponse,
  UpdateClientStatusPayload,
  UpdateClientStatusResponse,
  DeleteClientResponse,
  RestoreClientResponse,
  ForceDeleteClientResponse,
  ClientListQuery,
} from "@/src/types/admin/client.types";

// Helper - Create Client FormData
const createClientFormData = (payload: CreateClientPayload): FormData => {
  const formData = new FormData();

  // Basic Client Fields
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("login_id", payload.login_id);
  formData.append("password", payload.password);

  // Monthly Service Fee
  formData.append(
    "monthly_service_fee",
    String(payload.monthly_service_fee)
  );

  // Website / Social URLs
  formData.append("website_url", payload.website_url ?? "");
  formData.append("instagram_url", payload.instagram_url ?? "");
  formData.append("facebook_url", payload.facebook_url ?? "");
  formData.append("linkedin_url", payload.linkedin_url ?? "");
  formData.append("youtube_url", payload.youtube_url ?? "");

  // Status
  formData.append("status", payload.status ?? "ACTIVE");

  // Client Services (sent as string because request is multipart/form-data)
  formData.append("services", JSON.stringify(payload.services));

  // Profile Photo
  if (payload.profile_photo) {
    formData.append("profile_photo", payload.profile_photo);
  }

  // Agreement Contract
  if (payload.agreement_contract) {
    formData.append("agreement_contract", payload.agreement_contract);
  }

  return formData;
};

// Helper - Update Client FormData
const updateClientFormData = (payload: UpdateClientPayload): FormData => {
  const formData = new FormData();

  // Basic Client Fields
  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.email !== undefined) {
    formData.append("email", payload.email);
  }

  if (payload.login_id !== undefined) {
    formData.append("login_id", payload.login_id);
  }

  // Password
  if (payload.password !== undefined && payload.password !== "") {
    formData.append("password", payload.password);
  }

  // Monthly Service Fee
  if (payload.monthly_service_fee !== undefined) {
    formData.append(
      "monthly_service_fee",
      String(payload.monthly_service_fee)
    );
  }

  // Website / Social URLs
  if (payload.website_url !== undefined) {
    formData.append("website_url", payload.website_url);
  }

  if (payload.instagram_url !== undefined) {
    formData.append("instagram_url", payload.instagram_url);
  }

  if (payload.facebook_url !== undefined) {
    formData.append("facebook_url", payload.facebook_url);
  }

  if (payload.linkedin_url !== undefined) {
    formData.append("linkedin_url", payload.linkedin_url);
  }

  if (payload.youtube_url !== undefined) {
    formData.append("youtube_url", payload.youtube_url);
  }

  // Status
  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  // Client Services
  if (payload.services !== undefined) {
    formData.append("services", JSON.stringify(payload.services));
  }

  // Profile Photo
  if (payload.profile_photo) {
    formData.append("profile_photo", payload.profile_photo);
  }

  // Agreement Contract
  if (payload.agreement_contract) {
    formData.append("agreement_contract", payload.agreement_contract);
  }

  return formData;
};

// Create Client
const createClient = async (
  payload: CreateClientPayload
): Promise<CreateClientResponse> => {
  const formData = createClientFormData(payload);

  try {
    const response = await axiosInstance.post<CreateClientResponse>(
      "/admin/client/create",
      formData
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Get Clients
const getClients = async (
  query: ClientListQuery = {}
): Promise<GetClientsResponse> => {
  const response = await axiosInstance.get<GetClientsResponse>(
    "/admin/client/list",
    {
      params: query,
    }
  );

  return response.data;
};

// Get Client Details
const getClient = async (uuid: string): Promise<GetClientResponse> => {
  const response = await axiosInstance.get<GetClientResponse>(
    `/admin/client/list/${uuid}`
  );

  return response.data;
};

// Update Client
const updateClient = async (
  uuid: string,
  payload: UpdateClientPayload
): Promise<UpdateClientResponse> => {
  const formData = updateClientFormData(payload);

  const response = await axiosInstance.patch<UpdateClientResponse>(
    `/admin/client/update/${uuid}`,
    formData
  );

  return response.data;
};

// Update Client Status
const updateClientStatus = async (
  uuid: string,
  payload: UpdateClientStatusPayload
): Promise<UpdateClientStatusResponse> => {
  const response = await axiosInstance.patch<UpdateClientStatusResponse>(
    `/admin/client/status/${uuid}`,
    payload
  );

  return response.data;
};

// Soft Delete Client
const deleteClient = async (uuid: string): Promise<DeleteClientResponse> => {
  const response = await axiosInstance.delete<DeleteClientResponse>(
    `/admin/client/trash/${uuid}`
  );

  return response.data;
};

// Restore Client
const restoreClient = async (
  uuid: string
): Promise<RestoreClientResponse> => {
  const response = await axiosInstance.patch<RestoreClientResponse>(
    `/admin/client/restore/${uuid}`
  );

  return response.data;
};

// Force Delete Client
const forceDeleteClient = async (
  uuid: string
): Promise<ForceDeleteClientResponse> => {
  const response = await axiosInstance.delete<ForceDeleteClientResponse>(
    `/admin/client/force-delete/${uuid}`
  );

  return response.data;
};

// Get Trash Clients
const getTrashClients = async (
  query: ClientListQuery = {}
): Promise<GetTrashClientsResponse> => {
  const response = await axiosInstance.get<GetTrashClientsResponse>(
    "/admin/client/trash",
    {
      params: query,
    }
  );

  return response.data;
};

// Get Client Agreement Contract
const getClientAgreement = async (uuid: string): Promise<Blob> => {
  const response = await axiosInstance.get<Blob>(
    `/admin/client/agreement/${uuid}`,
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    }
  );

  return response.data;
};

// Export
export const clientApi = {
  createClient,
  getClients,
  getClient,
  updateClient,
  updateClientStatus,
  deleteClient,
  restoreClient,
  forceDeleteClient,
  getTrashClients,
  getClientAgreement,
};