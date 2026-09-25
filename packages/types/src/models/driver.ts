import { DriverStatus } from "../enums";

export interface DriverSummaryResponse {
  id: number;
  name: string;
  phone: string;
  license: string;
  busDisplayId: string | null;
  status: string;
  joined: string;
}

export interface DriverDetailResponse {
  id: number;
  name: string;
  phone: string;
  license: string;
  status: string;
  joined: string;
  busId: number | null;
  busDisplayId: string | null;
  routeName: string | null;
}

export interface DriverUpdateRequest {
  phone?: string;
  status?: DriverStatus;
}
