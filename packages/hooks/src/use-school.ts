import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  suspendSchool,
  restoreSchool,
  archiveSchool,
} from "@bustrack/api-client/services/school-service"
import type { SchoolListParams } from "@bustrack/types/api/school"
import type {
  CreateSchoolRequest,
  UpdateSchoolRequest,
} from "@bustrack/types/models/school"
import { toast } from "sonner"

const useSchool = () => {
  const qc = useQueryClient()

  const invalidateSchools = () => {
    qc.invalidateQueries({ queryKey: ["superadmin", "schools"] })
  }

  const invalidateSchool = (id: number | string) => {
    qc.invalidateQueries({ queryKey: ["superadmin", "school", id] })
  }

  const useSchoolList = (params?: SchoolListParams) =>
    useQuery({
      queryKey: ["superadmin", "schools", params],
      queryFn: () => listSchools(params),
    })

  const useSchoolDetail = (id?: number | string) =>
    useQuery({
      queryKey: ["superadmin", "school", id ?? "none"],
      queryFn: () => getSchoolById(id!),
      enabled: !!id,
    })

  const useCreateSchool = () =>
    useMutation({
      mutationFn: (body: CreateSchoolRequest) => createSchool(body),
      onSuccess: () => {
        invalidateSchools()
        toast.success("School created")
      },
      onError: () => toast.error("Failed to create school"),
    })

  const useUpdateSchool = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number | string; data: UpdateSchoolRequest }) =>
        updateSchool(id, data),
      onSuccess: (_res, vars) => {
        invalidateSchools()
        invalidateSchool(vars.id)
        toast.success("School updated")
      },
      onError: () => toast.error("Failed to update school"),
    })

  const useSuspendSchool = () =>
    useMutation({
      mutationFn: (id: number | string) => suspendSchool(id),
      onSuccess: (_res, id) => {
        invalidateSchools()
        invalidateSchool(id)
        toast.success("School suspended", {
          description: "Its admins were signed out. Existing sessions may stay active for up to 15 minutes.",
        })
      },
      onError: () => toast.error("Failed to suspend school"),
    })

  const useRestoreSchool = () =>
    useMutation({
      mutationFn: (id: number | string) => restoreSchool(id),
      onSuccess: (_res, id) => {
        invalidateSchools()
        invalidateSchool(id)
        toast.success("School restored")
      },
      onError: () => toast.error("Failed to restore school"),
    })

  const useArchiveSchool = () =>
    useMutation({
      mutationFn: (id: number | string) => archiveSchool(id),
      onSuccess: (_res, id) => {
        invalidateSchools()
        invalidateSchool(id)
        toast.success("School archived")
      },
      onError: () => toast.error("Failed to archive school"),
    })

  return {
    useSchoolList,
    useSchoolDetail,
    useCreateSchool,
    useUpdateSchool,
    useSuspendSchool,
    useRestoreSchool,
    useArchiveSchool,
  }
}

export default useSchool
