import { APIResponse } from "@bustrack/types/api";
import {
  CreateSchoolAdminRequest,
  CreatePlatformSuperAdminRequest,
  PlatformUserSummary,
} from "@bustrack/types/models/platform-user";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";

/**
 * Creates an ADMIN scoped to one school. Rejects with:
 * - 404 SCHOOL_NOT_FOUND when `schoolId` is unknown
 * - 409 SCHOOL_SUSPENDED / SCHOOL_ARCHIVED
 * - 409 EMAIL_ALREADY_EXISTS
 * - 400 VALIDATION_ERROR when `password` is shorter than 8 characters
 */
export const createSchoolAdmin = async (body: CreateSchoolAdminRequest) => {
  const res = await axiosClient.post<APIResponse<PlatformUserSummary>>(
    API_ENDPOINTS.SUPER_ADMIN.CREATE_ADMIN,
    body,
  );
  return res.data;
};

export const createPlatformSuperAdmin = async (
  body: CreatePlatformSuperAdminRequest,
) => {
  const res = await axiosClient.post<APIResponse<PlatformUserSummary>>(
    API_ENDPOINTS.SUPER_ADMIN.CREATE_SUPER_ADMIN,
    body,
  );
  return res.data;
};
