import { APIResponse } from "@bustrack/types/api";
import {
  CreateSchoolAdminRequest,
  CreatePlatformSuperAdminRequest,
  PlatformUserSummary,
} from "@bustrack/types/models/platform-user";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";

export const createSchoolAdmin = async (body: CreateSchoolAdminRequest) => {
  const res = await axiosClient.post<APIResponse<PlatformUserSummary>>(
    API_ENDPOINTS.SUPER_ADMIN.CREATE_ADMIN,
    body,
  );
  return res.data;
};
