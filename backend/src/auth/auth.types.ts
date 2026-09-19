export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
}

export interface AuthedRequest {
  headers: Record<string, string | undefined>;
  user?: AuthUser;
}
