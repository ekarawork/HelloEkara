"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  getAccessToken,
  getClientPortalPreviewToken,
  removeClientPortalPreviewToken,
  saveClientPortalPreviewToken,
  getUser,
} from "@/src/utils/storage";

import { clientPortalApi } from "@/src/api/admin/clientPortal.api";

interface ClientPortalGuardProps {
  children: ReactNode;
}

export default function ClientPortalGuard({
  children,
}: ClientPortalGuardProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializePortal = async () => {
      try {
        /* ============================================================
         * 1. Read preview token from URL
         * ============================================================
         */

        const hash = window.location.hash;

        if (hash) {
          const hashParams = new URLSearchParams(
            hash.substring(1)
          );

          const urlPreviewToken =
            hashParams.get("preview_token");

          if (urlPreviewToken) {
            saveClientPortalPreviewToken(
              urlPreviewToken
            );

            /*
             * Remove preview token from URL
             */
            window.history.replaceState(
              null,
              "",
              window.location.pathname +
                window.location.search
            );
          }
        }

        /* ============================================================
         * 2. Check preview mode
         * ============================================================
         */

        const previewToken =
          getClientPortalPreviewToken();

        if (previewToken) {
          const response =
            await clientPortalApi.verifyClientPortalAccess(
              previewToken
            );

          if (
            response.success &&
            response.data
          ) {
            if (mounted) {
              setAuthorized(true);
              setLoading(false);
            }

            return;
          }

          /*
           * Invalid / expired preview token
           */
          removeClientPortalPreviewToken();

          if (mounted) {
            setAuthorized(false);
            setLoading(false);
          }

          router.replace("/");

          return;
        }

        /* ============================================================
         * 3. Normal CLIENT login
         * ============================================================
         */

        const accessToken = getAccessToken();
        const user = getUser();

        /*
         * Only CLIENT users can normally access
         * the client portal.
         */
        if (
          !accessToken ||
          !user ||
          user.role !== "CLIENT"
        ) {
          if (mounted) {
            setAuthorized(false);
            setLoading(false);
          }

          router.replace("/");

          return;
        }

        /* ============================================================
         * Normal CLIENT authorized
         * ============================================================
         */

        if (mounted) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Client portal authorization failed:",
          error
        );

        removeClientPortalPreviewToken();

        if (mounted) {
          setAuthorized(false);
          setLoading(false);
        }

        router.replace("/");
      }
    };

    initializePortal();

    return () => {
      mounted = false;
    };
  }, [router]);

  /* ================================================================
   * Unauthorized
   * ================================================================
   */

  if (!authorized) {
    return null;
  }

  /* ================================================================
   * Authorized
   * ================================================================
   */

  return <>{children}</>;
}