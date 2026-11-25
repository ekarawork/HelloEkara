"use client";

import {
  getClientProfileApi,
  updateClientProfileApi,
  changeClientPasswordApi,
} from "@/src/api/client/settings.api";

import type {
  ClientProfile,
  UpdateClientProfilePayload,
  ChangeClientPasswordPayload,
} from "@/src/types/client/settings.types";

/* =========================================================
   GET CLIENT PROFILE
========================================================= */

export const getClientProfile = async (): Promise<ClientProfile> => {
  return await getClientProfileApi();
};

/* =========================================================
   UPDATE CLIENT PROFILE
========================================================= */

export const updateClientProfile = async (
  payload: UpdateClientProfilePayload
): Promise<ClientProfile> => {
  return await updateClientProfileApi(payload);
};

/* =========================================================
   CHANGE CLIENT PASSWORD
========================================================= */

export const changeClientPassword = async (
  payload: ChangeClientPasswordPayload
): Promise<void> => {
  await changeClientPasswordApi(payload);
};