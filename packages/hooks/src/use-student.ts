import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  importStudentsPreview,
  importStudentsCommit,
  bulkEditPreview,
  bulkEditCommit,
} from "@bustrack/api-client/services/student-service"
import type { StudentListParams } from "@bustrack/types/api/student"
import type { StudentRequest } from "@bustrack/types/models/student"
import {
  StudentBulkEditCommitRequest,
  StudentImportCommitRequest,
} from "@bustrack/types/models/student"
import { toast } from "sonner"

const useStudent = () => {
  const qc = useQueryClient()

  const useStudentList = (params?: StudentListParams) =>
    useQuery({
      queryKey: ["students", params],
      queryFn: () => listStudents(params),
    })

  const useStudentDetail = (id?: number | string) =>
    useQuery({
      queryKey: ["student", id ?? "none"],
      queryFn: () => getStudentById(id!),
      enabled: !!id,
    })

  const useUpdateStudent = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number | string; data: Partial<StudentRequest> }) =>
        updateStudent(id, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["students"] })
        toast.success("Student updated")
      },
      onError: () => toast.error("Failed to update student"),
    })

  const useDeleteStudent = () =>
    useMutation({
      mutationFn: (id: number | string) => deleteStudent(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["students"] })
        toast.success("Student deleted")
      },
      onError: () => toast.error("Failed to delete student"),
    })

  const useImportPreview = () =>
    useMutation({
      mutationFn: ({ busId, file }: { busId: number | string; file: File }) =>
        importStudentsPreview(busId, file),
    })

  const useImportCommit = () =>
    useMutation({
      mutationFn: ({ busId, data }: { busId: number | string; data: StudentImportCommitRequest }) =>
        importStudentsCommit(busId, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["students"] })
        qc.invalidateQueries({ queryKey: ["buses"] })
        toast.success("Students imported")
      },
      onError: () => toast.error("Failed to import students"),
    })

  const useBulkEditPreview = () =>
    useMutation({
      mutationFn: ({ busId, file }: { busId: number | string; file: File }) =>
        bulkEditPreview(busId, file),
    })

  const useBulkEditCommit = () =>
    useMutation({
      mutationFn: ({ busId, data }: { busId: number | string; data: StudentBulkEditCommitRequest }) =>
        bulkEditCommit(busId, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["students"] })
        qc.invalidateQueries({ queryKey: ["buses"] })
        toast.success("Students updated")
      },
      onError: () => toast.error("Failed to bulk edit students"),
    })

  return {
    useStudentList,
    useStudentDetail,
    useUpdateStudent,
    useDeleteStudent,
    useImportPreview,
    useImportCommit,
    useBulkEditPreview,
    useBulkEditCommit,
  }
}

export default useStudent
