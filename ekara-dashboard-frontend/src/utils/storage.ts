/* Storage Keys */
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;


/* Auth User */
export interface AuthUser {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string | null;
  email: string;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "EMPLOYEE"
    | "CLIENT";
}


/* Access Token */
export const saveAccessToken = (
  token: string
): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEYS.ACCESS_TOKEN,
    token
  );
};

export const updateAccessToken = (
  token: string
): void => {
  saveAccessToken(token);
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(
    STORAGE_KEYS.ACCESS_TOKEN
  );
};

export const hasAccessToken = (): boolean => {
  return !!getAccessToken();
};

export const removeAccessToken = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(
    STORAGE_KEYS.ACCESS_TOKEN
  );
};


/* Refresh Token */
export const saveRefreshToken = (
  token: string
): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEYS.REFRESH_TOKEN,
    token
  );
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(
    STORAGE_KEYS.REFRESH_TOKEN
  );
};

export const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};

export const removeRefreshToken = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(
    STORAGE_KEYS.REFRESH_TOKEN
  );
};


/* User */
export const saveUser = (
  user: AuthUser
): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user)
  );
};

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(
    STORAGE_KEYS.USER
  );

  if (!user) return null;

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
};

export const getRole = (): AuthUser["role"] | null => {
  const user = getUser();

  return user?.role ?? null;
};


/* Role Helpers */
export const isAdmin = (): boolean => {
  const role = getRole();

  return (
    role === "ADMIN" ||
    role === "SUPER_ADMIN"
  );
};

export const isSuperAdmin = (): boolean => {
  return getRole() === "SUPER_ADMIN";
};

export const isEmployee = (): boolean => {
  return getRole() === "EMPLOYEE";
};

export const isClient = (): boolean => {
  return getRole() === "CLIENT";
};


/* Remove User */
export const removeUser = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.USER);
};


/* Authentication */
export const isAuthenticated = (): boolean => {
  return hasAccessToken();
};


/* Logout / Clear Storage */
export const clearAuth = (): void => {
  removeAccessToken();
  removeRefreshToken();
  removeUser();
};



const CLIENT_PORTAL_PREVIEW_TOKEN =
  "clientPortalPreviewToken";

export const saveClientPortalPreviewToken = (
  token: string
): void => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    CLIENT_PORTAL_PREVIEW_TOKEN,
    token
  );
};

export const getClientPortalPreviewToken =
  (): string | null => {
    if (typeof window === "undefined") return null;

    return sessionStorage.getItem(
      CLIENT_PORTAL_PREVIEW_TOKEN
    );
  };

export const removeClientPortalPreviewToken =
  (): void => {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(
      CLIENT_PORTAL_PREVIEW_TOKEN
    );
  };