import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSchoolAdmin,
  createPlatformSuperAdmin,
} from "@bustrack/api-client/services/superadmin-users-service";
import type {
  CreateSchoolAdminRequest,
  CreatePlatformSuperAdminRequest,
} from "@bustrack/types/models/platform-user";
import { toast } from "sonner";

const useSuperAdminUsers = () => {
  const qc = useQueryClient();

  const useCreateSchoolAdmin = () =>
    useMutation({
      mutationFn: (body: CreateSchoolAdminRequest) => createSchoolAdmin(body),
      onSuccess: () => {
        // Creating an admin changes the school's adminCount on the list row.
        qc.invalidateQueries({ queryKey: ["superadmin", "schools"] });
        toast.success("School admin created");
      },
      onError: () => toast.error("Failed to create school admin"),
    });

  const useCreatePlatformSuperAdmin = () =>
    useMutation({
      mutationFn: (body: CreatePlatformSuperAdminRequest) =>
        createPlatformSuperAdmin(body),
      onSuccess: () => {
        toast.success("Super admin created");
      },
      onError: () => toast.error("Failed to create super admin"),
    });

  return { useCreateSchoolAdmin, useCreatePlatformSuperAdmin };
};

export default useSuperAdminUsers;
