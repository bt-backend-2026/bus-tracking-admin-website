import type { SchoolStatus } from "../enums";

export interface School {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  status: SchoolStatus;
  createdAt: string;
}

export interface SchoolListItem {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  status: SchoolStatus;
  createdAt: string;
  adminCount: number;
  busCount: number;
  studentCount: number;
}

export type SchoolSummary = SchoolListItem;

export interface CreateSchoolRequest {
  name: string;
  address?: string;
  city?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface UpdateSchoolRequest {
  name?: string;
  address?: string;
  city?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}
