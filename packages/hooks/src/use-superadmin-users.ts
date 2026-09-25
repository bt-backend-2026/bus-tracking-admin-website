import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSchoolAdmin } from "@bustrack/api-client/services/superadmin-users-service";
import type { CreateSchoolAdminRequest } from "@bustrack/types/models/platform-user";

const useSuperAdminUsers = () => {
  const useCreateSchoolAdmin = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreateSchoolAdminRequest) => createSchoolAdmin(body),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["superadmin", "schools"] });
        toast.success("School admin created");
      },
      onError: () => toast.error("Failed to create school admin"),
    });
  };

  return { useCreateSchoolAdmin };
};

export default useSuperAdminUsers;
