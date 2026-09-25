import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";
import type { APIResponse } from "@bustrack/types/api";
import type { TripListParams } from "@bustrack/types/api/trip";
import type {
  TripDetailResponse,
  TripSummaryResponse,
} from "@bustrack/types/models/trip";

export const listTrips = async (params?: TripListParams) => {
  const res = await axiosClient.get<APIResponse<TripSummaryResponse[]>>(
    API_ENDPOINTS.TRIP.BASE,
    { params },
  );

  return res.data;
};

export const getTripById = async (id: number | string) => {
  const res = await axiosClient.get<APIResponse<TripDetailResponse>>(
    API_ENDPOINTS.TRIP.BY_ID(id),
  );

  return res.data;
};

export const toggleCancelTrip = async (id: number | string) => {
  const res = await axiosClient.post<APIResponse<TripDetailResponse>>(
    API_ENDPOINTS.TRIP.CANCEL(id),
  );

  return res.data;
};

export const getActiveTripByBus = async (busId: number | string) => {
  const res = await axiosClient.get<APIResponse<TripSummaryResponse | null>>(
    API_ENDPOINTS.TRIP.ACTIVE_BY_BUS(busId),
  );

  return res.data;
};
