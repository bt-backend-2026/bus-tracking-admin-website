import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";
import type { APIResponse } from "@bustrack/types/api";
import type { AuthResponse, LoginRequest } from "@bustrack/types/models/auth";

export const loginUser = async (data: LoginRequest) => {
  const res = await axiosClient.post<APIResponse<AuthResponse>>(
    API_ENDPOINTS.LOGIN,
    data,
  );

  return res.data;
};

export const refreshToken = async (): Promise<string> => {
  const res = await axiosClient.post<APIResponse<{ accessToken: string }>>(
    API_ENDPOINTS.REFRESH,
  );

  const token = res.data.data?.accessToken;
  if (!token) throw new Error("Token refresh failed");
  return token;
};
