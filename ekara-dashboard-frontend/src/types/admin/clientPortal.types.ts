export interface ClientPortalClient {
  id: number;
  uuid: string;
  name: string;
  email: string;
  profile_photo: string | null;
}

export interface ClientPortalAccessData {
  token: string;
  expiresIn: string;
  client: ClientPortalClient;
}

export interface CreateClientPortalAccessResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ClientPortalAccessData | null;
  errors: unknown;
  timestamp: string;
}

/* Client Portal Preview Verification */

export interface ClientPortalVerifyData {
  token: {
    type: "CLIENT_PORTAL_PREVIEW";
    client_id: number;
    client_uuid: string;
    client_email: string;
    admin_id: number;
    admin_role:
      | "SUPER_ADMIN"
      | "ADMIN";
    iat: number;
    exp: number;
  };

  client: ClientPortalClient;
}

export interface ClientPortalVerifyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ClientPortalVerifyData | null;
  errors: unknown;
  timestamp: string;
}