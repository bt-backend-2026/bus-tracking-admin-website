import type { AccountStatus } from "../enums";
import type { Role } from "../enums";

export interface CreateSchoolAdminRequest {
  schoolId: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CreatePlatformSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface PlatformUserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
  accountStatus: AccountStatus;
  schoolId: number | null;
}
