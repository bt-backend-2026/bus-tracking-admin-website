export interface APIResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  error: string | null;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  error: string | null;
}
