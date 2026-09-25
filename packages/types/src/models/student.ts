export interface StudentRequest {
  name: string;
  klass?: string | null;
  parentName: string;
  phone: string;
  secondaryPhone: string;
  checkpoint?: string | null;
}

export interface StudentResponse {
  id: number;
  name: string;
  klass: string | null;
  parentName: string;
  phone: string;
  secondaryPhone: string;
  checkpointStopId: number | null;
  checkpoint: string | null;
  parentId: number | null;
  attendanceStatus: string | null;
}

export interface StudentImportRowResult {
  rowNumber: number;
  ok: boolean;
  error: string | null;
  name?: string;
  klass?: string;
  parentName?: string;
  phone?: string;
  secondaryPhone?: string;
  checkpoint?: string;
}

export interface StudentImportPreviewResponse {
  rows: StudentImportRowResult[];
  okCount: number;
  errorCount: number;
}

export interface StudentImportCommitRequest {
  rows: StudentImportRowResult[];
}

export interface StudentImportCommitResponse {
  importedCount: number;
  skippedCount: number;
}

export interface StudentBulkEditRowResult {
  rowNumber: number;
  ok: boolean;
  error: string | null;
  studentId?: number;
  changedFields?: string[];
}

export interface StudentBulkEditPreviewResponse {
  rows: StudentBulkEditRowResult[];
  okCount: number;
  errorCount: number;
}

export interface StudentBulkEditCommitRequest {
  rows: StudentBulkEditRowResult[];
}

export interface StudentBulkEditCommitResponse {
  updatedCount: number;
  skippedCount: number;
}
