import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";
import type { APIResponse, Page } from "@bustrack/types/api";
import type { SchoolListParams } from "@bustrack/types/api/school";
import type {
  CreateSchoolRequest,
  SchoolDetail,
  SchoolListItem,
  UpdateSchoolRequest,
} from "@bustrack/types/models/school";

/**
 * School lifecycle as seen by the platform console. Every one of these is
 * SUPER_ADMIN-gated server-side via `@PreAuthorize`.
 *
 * The server enforces no state machine on its own: POST /suspend against an
 * ARCHIVED school will un-archive it. The UI is responsible for gating which
 * lifecycle button is offered for a given status.
 *
 * Error shapes worth handling by `error` code rather than `message` (the
 * global handler copies raw exception text into BAD_REQUEST, which can leak
 * SQL): SCHOOL_NOT_FOUND, SCHOOL_NOT_EMPTY, SCHOOL_NOT_ARCHIVED,
 * SCHOOL_SUSPENDED, SCHOOL_ARCHIVED, VALIDATION_ERROR.
 */
export const listSchools = async (params?: SchoolListParams) => {
  const res = await axiosClient.get<APIResponse<Page<SchoolListItem>>>(
    API_ENDPOINTS.SUPER_ADMIN.SCHOOLS.BASE,
    { params },
  );
  return res.data;
};

export const getSchoolById = async (id: number | string) => {
  const res = await axiosClient.get<APIResponse<SchoolDetail>>(
    API_ENDPOINTS.SUPER_ADMIN.SCHOOLS.BY_ID(id),
  );
  return res.data;
};

export const createSchool = async (body: CreateSchoolRequest) => {
  const res = await axiosClient.post<APIResponse<SchoolDetail>>(
    API_ENDPOINTS.SUPER_ADMIN.SCHOOLS.BASE,
    body,
  );
  return res.data;
};

/**
 * Partial update. Omit a field to leave it untouched; send `""` to clear it,
 * except for `name` where `""` is a 400. `status` is not patchable here.
 */
export const updateSchool = async (
  id: number | string,
  body: UpdateSchoolRequest,
) => {
  const res = await axiosClient.patch<APIResponse<SchoolDetail>>(
    API_ENDPOINTS.SUPER_ADMIN.SCHOOLS.BY_ID(id),
    body,
  );
  return res.data;
};

/**
 * Sets status to SUSPENDED, bulk-suspends the school's admins, and deletes
 * their refresh tokens. Already-issued access tokens stay valid for up to the
 * access-token lifetime, so this is not instantaneous revocation.
 */
export const suspendSchool = async (id: number | string) => {
  const res = await axiosClient.post<APIResponse<SchoolDetail>>(
    API_ENDPOINTS.SUPER_ADMIN.SCHOOLS.SUSPEND(id),
  );
  return res.data;
};

/**
 * Sets status to ACTIVE and reactivates admins that were suspended *by the
 * school suspension* (the `suspendedBySchool` flag), not ones suspended
 * individually.
 */
export const restoreSchool = async (id: number | string) => {
  const res = await axiosClient.post<APIResponse<SchoolDetail>>(
    API_ENDPOINTS.SUPER_ADMIN.SCHOOLS.RESTORE(id),
  );
  return res.data;
};

/** Soft delete - sets status to ARCHIVED. Reversible via suspend/restore. */
export const archiveSchool = async (id: number | string) => {
  const res = await axiosClient.delete<APIResponse<SchoolDetail>>(
    API_ENDPOINTS.SUPER_ADMIN.SCHOOLS.BY_ID(id),
  );
  return res.data;
};
