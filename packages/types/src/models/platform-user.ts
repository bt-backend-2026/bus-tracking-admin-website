import type { AccountStatus } from "../enums";
import type { Role } from "../enums";

/**
 * Mirrors the backend `CreateAdminRequest`. `password` is min 8 server-side
 * (`@Size(min = 8)`) - the API rejects 6-7 char values with VALIDATION_ERROR.
 */
export interface CreateSchoolAdminRequest {
  schoolId: number;
  name: string;
  email: string;
  /** Minimum 8 characters, enforced by the backend. */
  password: string;
  phone?: string;
}

/**
 * Mirrors the backend `CreateSuperAdminRequest`. Deliberately has no
 * `schoolId` - a super admin is platform-level.
 */
export interface CreatePlatformSuperAdminRequest {
  name: string;
  email: string;
  /** Minimum 8 characters, enforced by the backend. */
  password: string;
  phone?: string;
}

/**
 * Mirrors the backend `UserSummary` returned by create-admin /
 * create-superadmin. Note the field is `status`, not `accountStatus`, and the
 * type is `AccountStatus` (not `SchoolStatus`).
 */
export interface PlatformUserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
  /** Null for SUPER_ADMIN. */
  schoolId: number | null;
  status: AccountStatus;
}
