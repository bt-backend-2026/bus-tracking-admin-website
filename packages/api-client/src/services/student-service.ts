import { API_ENDPOINTS } from "../constants/api-endpoints";
import axiosClient from "../lib/axios";
import type { APIResponse } from "@bustrack/types/api";
import type { StudentListParams } from "@bustrack/types/api/student";
import type {
  StudentBulkEditCommitRequest,
  StudentBulkEditCommitResponse,
  StudentBulkEditPreviewResponse,
  StudentImportCommitRequest,
  StudentImportCommitResponse,
  StudentImportPreviewResponse,
  StudentRequest,
  StudentResponse,
} from "@bustrack/types/models/student";

export const listStudents = async (params?: StudentListParams) => {
  const res = await axiosClient.get<APIResponse<StudentResponse[]>>(
    API_ENDPOINTS.STUDENT.BASE,
    { params },
  );

  return res.data;
};

export const getStudentById = async (id: number | string) => {
  const res = await axiosClient.get<APIResponse<StudentResponse>>(
    API_ENDPOINTS.STUDENT.BY_ID(id),
  );

  return res.data;
};

export const updateStudent = async (
  id: number | string,
  data: Partial<StudentRequest>,
) => {
  const res = await axiosClient.patch<APIResponse<StudentResponse>>(
    API_ENDPOINTS.STUDENT.BY_ID(id),
    data,
  );

  return res.data;
};

export const deleteStudent = async (id: number | string) => {
  const res = await axiosClient.delete<APIResponse<void>>(
    API_ENDPOINTS.STUDENT.BY_ID(id),
  );

  return res.data;
};

export const importStudentsPreview = async (
  busId: number | string,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post<APIResponse<StudentImportPreviewResponse>>(
    API_ENDPOINTS.BUS.IMPORT_PREVIEW(busId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return res.data;
};

export const importStudentsCommit = async (
  busId: number | string,
  data: StudentImportCommitRequest,
) => {
  const res = await axiosClient.post<APIResponse<StudentImportCommitResponse>>(
    API_ENDPOINTS.BUS.IMPORT_COMMIT(busId),
    data,
  );

  return res.data;
};

export const exportStudentsRoster = async (busId: number | string) => {
  const res = await axiosClient.get<Blob>(API_ENDPOINTS.BUS.EXPORT(busId), {
    responseType: "blob",
  });

  return res.data;
};

export const bulkEditPreview = async (
  busId: number | string,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post<
    APIResponse<StudentBulkEditPreviewResponse>
  >(API_ENDPOINTS.BUS.BULK_EDIT_PREVIEW(busId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const bulkEditCommit = async (
  busId: number | string,
  data: StudentBulkEditCommitRequest,
) => {
  const res = await axiosClient.post<APIResponse<StudentBulkEditCommitResponse>>(
    API_ENDPOINTS.BUS.BULK_EDIT_COMMIT(busId),
    data,
  );

  return res.data;
};
