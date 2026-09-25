import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";
import type { APIResponse } from "@bustrack/types/api";
import type {
  BusLiveResponse,
  BusSummaryResponse,
  DashboardStatsResponse,
  RouteResponse,
} from "@bustrack/types/models/bus";
import type { BusListParams } from "@bustrack/types/api/bus";

export const getDashboardStats = async () => {
  const res = await axiosClient.get<APIResponse<DashboardStatsResponse>>(
    API_ENDPOINTS.DASHBOARD.STATS,
  );

  return res.data;
};

export const getLiveBuses = async () => {
  const res = await axiosClient.get<APIResponse<BusLiveResponse[]>>(
    API_ENDPOINTS.BUS.LIVE,
  );

  return res.data;
};


export const getRoutes = async () => {
  const res = await axiosClient.get<APIResponse<RouteResponse[]>>(
    API_ENDPOINTS.ROUTES,
  );

  return res.data;
};
