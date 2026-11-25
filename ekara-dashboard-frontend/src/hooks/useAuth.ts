"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AuthUser,
  clearAuth,
  getAccessToken,
  getUser,
} from "@/src/utils/storage";

export function useAuth() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const checkAuthentication = () => {
    const token = getAccessToken();
    const storedUser = getUser();

    if (!token || !storedUser) {
      setAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    setAuthenticated(true);
    setUser(storedUser);
    setLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const logout = () => {
    clearAuth();

    setAuthenticated(false);
    setUser(null);

    router.replace("/");
  };

  const hasRole = (...roles: AuthUser["role"][]) => {
    if (!user) return false;

    return roles.includes(user.role);
  };

  const isSuperAdmin = () => {
    return user?.role === "SUPER_ADMIN";
  };

  const isAdmin = () => {
    return (
      user?.role === "SUPER_ADMIN" ||
      user?.role === "ADMIN"
    );
  };

  const isEmployee = () => {
    return user?.role === "EMPLOYEE";
  };

  const isClient = () => {
    return user?.role === "CLIENT";
  };

  return {
    loading,
    authenticated,
    user,
    logout,
    checkAuthentication,
    hasRole,
    isAdmin,
    isSuperAdmin,
    isEmployee,
    isClient,
  };
}