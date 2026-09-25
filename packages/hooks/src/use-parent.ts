import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listParents,
  getParentById,
  updateParent,
  revokeParentAccess,
  resendParentInvite,
} from "@bustrack/api-client/services/parent-service"
import type { ParentListParams } from "@bustrack/types/api/parent"
import type { ParentUpdateRequest } from "@bustrack/types/models/parent"
import { toast } from "sonner"

const useParent = () => {
  const qc = useQueryClient()

  const useParentList = (params?: ParentListParams) =>
    useQuery({
      queryKey: ["parents", params],
      queryFn: () => listParents(params),
    })

  const useParentDetail = (id?: number | string) =>
    useQuery({
      queryKey: ["parent", id ?? "none"],
      queryFn: () => getParentById(id!),
      enabled: !!id,
    })

  const useUpdateParent = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number | string; data: ParentUpdateRequest }) =>
        updateParent(id, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["parents"] })
        toast.success("Parent updated")
      },
      onError: () => toast.error("Failed to update parent"),
    })

  const useRevokeAccess = () =>
    useMutation({
      mutationFn: (id: number | string) => revokeParentAccess(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["parents"] })
        toast.success("Parent access revoked")
      },
      onError: () => toast.error("Failed to revoke access"),
    })

  const useResendInvite = () =>
    useMutation({
      mutationFn: (id: number | string) => resendParentInvite(id),
      onSuccess: () => {
        toast.success("Invite resent")
      },
      onError: () => toast.error("Failed to resend invite"),
    })

  return {
    useParentList,
    useParentDetail,
    useUpdateParent,
    useRevokeAccess,
    useResendInvite,
  }
}

export default useParent
