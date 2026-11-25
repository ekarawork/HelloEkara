"use client";

import axiosInstance from "@/src/lib/axios";

import type {
  ClientProfile,
  UpdateClientProfilePayload,
  ChangeClientPasswordPayload,
} from "@/src/types/client/settings.types";

/* =========================================================
   GET CLIENT PROFILE
========================================================= */

export const getClientProfileApi = async (): Promise<ClientProfile> => {
  const response = await axiosInstance.get<{
    data: ClientProfile;
  }>("/client/settings/profile");

  return response.data.data;
};

/* =========================================================
   UPDATE CLIENT PROFILE
========================================================= */

export const updateClientProfileApi = async (
  payload: UpdateClientProfilePayload
): Promise<ClientProfile> => {
  const response = await axiosInstance.put<{
    data: ClientProfile;
  }>("/client/settings/profile", payload);

  return response.data.data;
};

/* =========================================================
   CHANGE CLIENT PASSWORD
========================================================= */

export const changeClientPasswordApi = async (
  payload: ChangeClientPasswordPayload
): Promise<void> => {
  await axiosInstance.put(
    "/client/settings/change-password",
    payload
  );
};