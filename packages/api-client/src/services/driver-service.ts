import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";
import type { APIResponse } from "@bustrack/types/api";
import type { DriverListParams } from "@bustrack/types/api/driver";
import type {
  DriverDetailResponse,
  DriverSummaryResponse,
  DriverUpdateRequest,
} from "@bustrack/types/models/driver";

export const listDrivers = async (params?: DriverListParams) => {
  const res = await axiosClient.get<APIResponse<DriverSummaryResponse[]>>(
    API_ENDPOINTS.DRIVER.BASE,
    { params },
  );

  return res.data;
};

export const getDriverById = async (id: number | string) => {
  const res = await axiosClient.get<APIResponse<DriverDetailResponse>>(
    API_ENDPOINTS.DRIVER.BY_ID(id),
  );

  return res.data;
};

export const updateDriver = async (
  id: number | string,
  data: DriverUpdateRequest,
) => {
  const res = await axiosClient.patch<APIResponse<DriverDetailResponse>>(
    API_ENDPOINTS.DRIVER.BY_ID(id),
    data,
  );

  return res.data;
};
