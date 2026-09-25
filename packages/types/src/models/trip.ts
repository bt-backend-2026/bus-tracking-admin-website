import { TripStatus } from "../enums";

export interface TripSummaryResponse {
  id: number;
  date: string;
  shift: string;
  busDisplayId: string;
  routeName: string;
  driverName: string;
  start: string | null;
  end: string | null;
  studentCount: number;
  status: TripStatus;
  onTime: boolean | null;
}

export interface TripRosterEntryResponse {
  studentId: number;
  name: string;
  klass: string | null;
  checkpoint: string | null;
  attendanceStatus: string;
}

export type TripDetailResponse = TripSummaryResponse & {
  roster: TripRosterEntryResponse[];
};
