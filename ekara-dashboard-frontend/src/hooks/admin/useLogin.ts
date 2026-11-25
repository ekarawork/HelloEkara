"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authService } from "@/src/services/admin/auth.service";
import { LoginPayload } from "@/src/types/admin/auth.types";
import { getUser } from "@/src/utils/storage";

interface UseLoginReturn {
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const useLogin = (): UseLoginReturn => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
  payload: LoginPayload
): Promise<boolean> => {
  try {
    setIsLoading(true);
    setError(null);

    await authService.login(payload);

    const user = getUser();

    if (!user) {
      throw new Error("User information not found.");
    }

    // Success Toast
    toast.success("Login successful", {
     description: `Welcome back to ${user.first_name} ${user.last_name ?? ""}.`,
    });

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
        throw new Error("Invalid user role.");
    }

    return true;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to login. Please try again.";

    setError(message);

    toast.error("Login failed", {
      description: message,
    });

    return false;
  } finally {
    setIsLoading(false);
  }
};

  const clearError = (): void => {
    setError(null);
  };


const logout = async (): Promise<void> => {
  try {
    setIsLoading(true);

    await authService.logout();

    toast.success("Logged out successfully", {
      description: "You have been logged out successfully.",
    });
  } catch (error: any) {
    console.error("Logout API error:", error);

    const isNetworkError =
      !error?.response ||
      error?.code === "ERR_NETWORK" ||
      error?.message === "Network Error";

    if (isNetworkError) {
      toast.warning("Network error", {
        description:
          "Unable to connect to the server. You have been logged out locally.",
      });
    } else {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Logout failed.";

      toast.error("Logout failed", {
        description: message,
      });
    }
  } finally {
    setIsLoading(false);
    router.replace("/");
  }
};

return {
  login,
  logout,
  isLoading,
  error,
  clearError,
};
};

export default useLogin;