import { StudentResponse } from './student';

export interface DashboardStatsResponse {
  activeBuses: number;
  totalBuses: number;
  studentsRiding: number;
  onTimePct: number;
}

export interface BusLiveResponse {
  busId: number;
  displayId: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  recordedAt: string;
}

export interface BusSummaryResponse {
  id: number;
  displayId: string;
  plate: string;
  capacity: number | null;
  studentCount: number;
  driverName: string | null;
  driverPhone: string | null;
  status: string;
}

export interface RouteResponse {
  id: number;
  code: string;
  name: string;
  busId: number | null;
  busCapacity: number | null;
  stopCount: number;
}

export interface BusCreateRequest {
  plate: string;
  displayId?: string;
  capacity?: number;
  shift?: string;
  status?: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  routeCode?: string;
}

export interface BusDetailResponse {
  id: number;
  displayId: string;
  plate: string;
  capacity: number | null;
  shift: string | null;
  status: string;
  driverName: string | null;
  driverPhone: string | null;
  routeCode: string | null;
  routeName: string | null;
  students: StudentResponse[];
}

export interface BusUpdateRequest {
  capacity?: number | null;
  shift?: string | null;
  status?: string | null;
  routeCode?: string | null;
  routeName?: string | null;
}

export interface PlateChangeAuthorizeRequest {
  password: string;
}

export interface PlateChangeAuthorizeResponse {
  unlockToken: string;
  expiresIn: number;
}

export interface PlateUpdateRequest {
  newPlate: string;
  unlockToken: string;
}

export interface CheckpointResponse {
  id: number;
  label: string;
  order: number;
}

export interface CheckpointRequest {
  checkpoints: { id?: number; label: string }[];
}
