export const API_ENDPOINTS = {
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  LOGOUT: "auth/logout",
  REFRESH: "auth/refresh",

  DASHBOARD: {
    STATS: "admin/dashboard/stats",
  },

  BUS: {
    BASE: "admin/buses",
    BY_ID: (id: number | string) => `admin/buses/${id}`,
    LIVE: "admin/buses/live",
    CHECKPOINTS: (id: number | string) => `admin/buses/${id}/checkpoints`,
    PLATE_CHANGE_AUTHORIZE: (id: number | string) =>
      `admin/buses/${id}/plate-change/authorize`,
    PLATE_UPDATE: (id: number | string) => `admin/buses/${id}/plate`,
    STUDENTS: (id: number | string) => `admin/buses/${id}/students`,
    IMPORT_PREVIEW: (id: number | string) =>
      `admin/buses/${id}/students/import/preview`,
    IMPORT_COMMIT: (id: number | string) =>
      `admin/buses/${id}/students/import/commit`,
    EXPORT: (id: number | string) => `admin/buses/${id}/students/export`,
    BULK_EDIT_PREVIEW: (id: number | string) =>
      `admin/buses/${id}/students/bulk-edit/preview`,
    BULK_EDIT_COMMIT: (id: number | string) =>
      `admin/buses/${id}/students/bulk-edit/commit`,
  },

  ROUTES: "admin/routes",

  DRIVER: {
    BASE: "admin/drivers",
    BY_ID: (id: number | string) => `admin/drivers/${id}`,
  },

  STUDENT: {
    BASE: "admin/students",
    BY_ID: (id: number | string) => `admin/students/${id}`,
  },

  PARENT: {
    BASE: "admin/parents",
    BY_ID: (id: number | string) => `admin/parents/${id}`,
    REVOKE: (id: number | string) => `admin/parents/${id}/revoke`,
    RESEND_INVITE: (id: number | string) =>
      `admin/parents/${id}/resend-invite`,
  },

  TRIP: {
    BASE: "admin/trips",
    BY_ID: (id: number | string) => `admin/trips/${id}`,
    CANCEL: (id: number | string) => `admin/trips/${id}/cancel`,
    ACTIVE_BY_BUS: (busId: number | string) => `trips/active/${busId}`,
  },

  SUPER_ADMIN: {
    CREATE_ADMIN: "superadmin/create-admin",
  },
} as const;
