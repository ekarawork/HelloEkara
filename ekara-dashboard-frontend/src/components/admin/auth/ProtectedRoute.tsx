"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { AuthUser } from "@/src/utils/storage";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AuthUser["role"][];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const {
    loading,
    authenticated,
    user,
  } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!authenticated) {
      router.replace("/");
      return;
    }

    if (
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      switch (user.role) {
        case "SUPER_ADMIN":
        case "ADMIN":
          router.replace("/admin/dashboard");
          break;

        case "CLIENT":
          router.replace("/client/dashboard");
          break;

        case "EMPLOYEE":
          router.replace("/employee/dashboard");
          break;

        default:
          router.replace("/");
      }
    }
  }, [
    loading,
    authenticated,
    user,
    allowedRoles,
    router,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-5">
          <Loader2
            className="animate-spin text-white"
            size={42}
          />

          <p className="text-sm tracking-[4px] uppercase text-white/60">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}