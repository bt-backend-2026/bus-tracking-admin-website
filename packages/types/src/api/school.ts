/**
 * Query params for `GET /api/superadmin/schools`.
 *
 * `status` is matched against the SchoolStatus enum name exactly
 * (case-sensitive: ACTIVE, SUSPENDED, ARCHIVED). An unrecognised value returns
 * 400 VALIDATION_ERROR rather than an empty list.
 *
 * `sortBy` is silently ignored unless it is one of the backend's allowlisted
 * columns (name, city, status, createdAt) - anything else falls back to `name`.
 * `sortDir` accepts only `asc`/`desc`; anything else falls back to `asc`. Both
 * are therefore sent from a fixed allowlist on the client, never from raw
 * user input.
 *
 * `page` is 0-based. There is no server-side cap on `size`, so clamp both
 * client-side.
 */
export interface SchoolListParams {
  status?: SchoolStatusParam;
  q?: string;
  page?: number;
  size?: number;
  sortBy?: SchoolSortField;
  sortDir?: "asc" | "desc";
}

export type SchoolStatusParam = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type SchoolSortField = "name" | "city" | "status" | "createdAt";
