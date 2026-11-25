"use client";

import axiosInstance from "@/src/lib/axios";


/* =========================================================
   EXPORT ADMIN DATA
========================================================= */

export const exportAdminDataApi = async (): Promise<Blob> => {
  const response = await axiosInstance.get(
    "/admin/export",
    {
      responseType: "blob",
    }
  );

  return response.data;
};