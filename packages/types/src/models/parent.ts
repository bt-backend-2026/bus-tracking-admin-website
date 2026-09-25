import { AccountStatus } from "../enums";

export interface ChildSummary {
  id: number;
  name: string;
  klass: string | null;
  busDisplayId: string | null;
}

export interface ParentSummaryResponse {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  children: ChildSummary[];
  accessStatus: AccountStatus;
}

export interface ParentDetailResponse {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  accessStatus: AccountStatus;
  children: ChildSummary[];
}

export interface ParentUpdateRequest {
  name?: string;
  phone?: string;
  email?: string;
}
