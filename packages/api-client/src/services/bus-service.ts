import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";
import type { APIResponse } from "@bustrack/types/api";
import type { BusListParams } from "@bustrack/types/api/bus";
import type {
  BusCreateRequest,
  BusDetailResponse,
  BusSummaryResponse,
  BusUpdateRequest,
  CheckpointRequest,
  CheckpointResponse,
  PlateChangeAuthorizeRequest,
  PlateChangeAuthorizeResponse,
  PlateUpdateRequest,
} from "@bustrack/types/models/bus";
import type { StudentRequest, StudentResponse } from "@bustrack/types/models/student";

export const listBuses = async (params?: BusListParams) => {
  const res = await axiosClient.get<APIResponse<BusSummaryResponse[]>>(
    API_ENDPOINTS.BUS.BASE,
    { params },
  );

  return res.data;
};

export const getBusById = async (id: number | string) => {
  const res = await axiosClient.get<APIResponse<BusDetailResponse>>(
    API_ENDPOINTS.BUS.BY_ID(id),
  );

  return res.data;
};

export const createBus = async (data: BusCreateRequest) => {
  const res = await axiosClient.post<APIResponse<BusDetailResponse>>(
    API_ENDPOINTS.BUS.BASE,
    data,
  );

  return res.data;
};

export const updateBus = async (id: number | string, data: BusUpdateRequest) => {
  const res = await axiosClient.patch<APIResponse<BusDetailResponse>>(
    API_ENDPOINTS.BUS.BY_ID(id),
    data,
  );

  return res.data;
};

export const authorizePlateChange = async (
  id: number | string,
  data: PlateChangeAuthorizeRequest,
) => {
  const res = await axiosClient.post<
    APIResponse<PlateChangeAuthorizeResponse>
  >(API_ENDPOINTS.BUS.PLATE_CHANGE_AUTHORIZE(id), data);

  return res.data;
};

export const updatePlate = async (
  id: number | string,
  data: PlateUpdateRequest,
) => {
  const res = await axiosClient.patch<APIResponse<BusDetailResponse>>(
    API_ENDPOINTS.BUS.PLATE_UPDATE(id),
    data,
  );

  return res.data;
};

export const listCheckpoints = async (busId: number | string) => {
  const res = await axiosClient.get<APIResponse<CheckpointResponse[]>>(
    API_ENDPOINTS.BUS.CHECKPOINTS(busId),
  );

  return res.data;
};

export const replaceCheckpoints = async (
  busId: number | string,
  data: CheckpointRequest,
) => {
  const res = await axiosClient.put<APIResponse<CheckpointResponse[]>>(
    API_ENDPOINTS.BUS.CHECKPOINTS(busId),
    data,
  );

  return res.data;
};

export const addStudentToBus = async (
  busId: number | string,
  data: StudentRequest,
) => {
  const res = await axiosClient.post<APIResponse<StudentResponse>>(
    API_ENDPOINTS.BUS.STUDENTS(busId),
    data,
  );

  return res.data;
};
