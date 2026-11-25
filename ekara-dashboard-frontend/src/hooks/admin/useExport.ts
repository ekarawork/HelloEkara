"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  exportAdminData,
} from "@/src/services/admin/export.service";


/* =========================================================
   HOOK
========================================================= */

export const useExport = () => {
  const [isExporting, setIsExporting] =
    useState(false);

  const handleExport = useCallback(
    async () => {
      try {
        setIsExporting(true);

        const blob =
          await exportAdminData();

        /* ===================================================
           CREATE DOWNLOAD URL
        =================================================== */

        const url =
          window.URL.createObjectURL(blob);

        /* ===================================================
           CREATE DOWNLOAD LINK
        =================================================== */

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          `ekara-admin-export-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx`;

        document.body.appendChild(link);

        link.click();

        /* ===================================================
           CLEANUP
        =================================================== */

        link.remove();

        window.URL.revokeObjectURL(url);

        toast.success(
          "Export completed successfully",
          {
            description:
              "Your Excel file has been downloaded.",
          }
        );
      } catch (error: any) {
        console.error(
          "Admin export error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to export admin data.";

        toast.error(
          "Export failed",
          {
            description: message,
          }
        );
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    isExporting,
    handleExport,
  };
};


export default useExport;