import { Role, AccountStatus } from "../enums";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
  schoolId: number | null;
  status: AccountStatus;
}

export interface AuthResponse {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  user: UserSummary | null;
  message: string | null;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  schoolId: number;
}
