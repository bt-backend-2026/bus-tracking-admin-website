import type { SchoolStatus } from "../enums";

/**
 * Detail shape - `GET /api/superadmin/schools/{id}` and the response of
 * create/update/lifecycle calls. Carries the contact block.
 */
export interface SchoolDetail {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  status: SchoolStatus;
  createdAt: string;
  busCount: number;
  studentCount: number;
  adminCount: number;
}

/**
 * List row - `GET /api/superadmin/schools` returns a `Page<SchoolListItem>`.
 * The backend deliberately omits the contact block here (D9), so these fields
 * do not exist on the wire and must not be rendered from a list response.
 */
export interface SchoolListItem {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  status: SchoolStatus;
  createdAt: string;
  busCount: number;
  studentCount: number;
  adminCount: number;
}

export type SchoolSummary = SchoolListItem;

/**
 * `POST /api/superadmin/schools`. `name` is the only required field; a new
 * school is always created ACTIVE (there is no `status` in the request).
 */
export interface CreateSchoolRequest {
  name: string;
  address?: string;
  city?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

/**
 * `PATCH /api/superadmin/schools/{id}`. Every field is optional and the
 * semantics are asymmetric, which the form layer must respect:
 * - `undefined` / omitted -> no change
 * - `""` -> clear the field to null, EXCEPT `name`, where `""` is a 400
 * - `status` is not patchable; use the suspend/restore/archive endpoints
 */
export interface UpdateSchoolRequest {
  name?: string;
  address?: string;
  city?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}
