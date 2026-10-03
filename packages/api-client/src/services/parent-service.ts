import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";
import type { APIResponse, Page } from "@bustrack/types/api";
import type { ParentListParams } from "@bustrack/types/api/parent";
import type {
  ParentDetailResponse,
  ParentSummaryResponse,
  ParentUpdateRequest,
} from "@bustrack/types/models/parent";

export const listParents = async (params?: ParentListParams) => {
  const res = await axiosClient.get<APIResponse<Page<ParentSummaryResponse>>>(
    API_ENDPOINTS.PARENT.BASE,
    { params },
  );

  return res.data;
};

export const getParentById = async (id: number | string) => {
  const res = await axiosClient.get<APIResponse<ParentDetailResponse>>(
    API_ENDPOINTS.PARENT.BY_ID(id),
  );

  return res.data;
};

export const updateParent = async (
  id: number | string,
  data: ParentUpdateRequest,
) => {
  const res = await axiosClient.patch<APIResponse<ParentDetailResponse>>(
    API_ENDPOINTS.PARENT.BY_ID(id),
    data,
  );

  return res.data;
};

export const revokeParentAccess = async (id: number | string) => {
  const res = await axiosClient.post<APIResponse<ParentDetailResponse>>(
    API_ENDPOINTS.PARENT.REVOKE(id),
  );

  return res.data;
};

export const resendParentInvite = async (id: number | string) => {
  const res = await axiosClient.post<APIResponse<ParentDetailResponse>>(
    API_ENDPOINTS.PARENT.RESEND_INVITE(id),
  );

  return res.data;
};
