"use client";

import {
  exportAdminDataApi,
} from "@/src/api/admin/export.api";


/* =========================================================
   EXPORT ADMIN DATA
========================================================= */

export const exportAdminData = async (): Promise<Blob> => {
  return await exportAdminDataApi();
};