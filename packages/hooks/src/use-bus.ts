import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listBuses,
  getBusById,
  createBus,
  updateBus,
  authorizePlateChange,
  updatePlate,
  listCheckpoints,
  replaceCheckpoints,
  addStudentToBus,
} from "@bustrack/api-client/services/bus-service"
import type { BusListParams } from "@bustrack/types/api/bus"
import type {
  BusCreateRequest,
  BusUpdateRequest,
  CheckpointRequest,
  PlateChangeAuthorizeRequest,
  PlateUpdateRequest,
} from "@bustrack/types/models/bus"
import type { StudentRequest } from "@bustrack/types/models/student"
import { toast } from "sonner"

const useBus = () => {
  const qc = useQueryClient()

  const useBusList = (params?: BusListParams) =>
    useQuery({
      queryKey: ["buses", params],
      queryFn: () => listBuses(params),
    })

  const useBusDetail = (id?: number | string) =>
    useQuery({
      queryKey: ["bus", id ?? "none"],
      queryFn: () => getBusById(id!),
      enabled: !!id,
    })

  const useBusCheckpoints = (busId?: number | string) =>
    useQuery({
      queryKey: ["checkpoints", busId ?? "none"],
      queryFn: () => listCheckpoints(busId!),
      enabled: !!busId,
    })

  const useCreateBus = () =>
    useMutation({
      mutationFn: (data: BusCreateRequest) => createBus(data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["buses"] })
        toast.success("Bus created")
      },
      onError: () => toast.error("Failed to create bus"),
    })

  const useUpdateBus = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number | string; data: BusUpdateRequest }) =>
        updateBus(id, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["buses"] })
        toast.success("Bus updated")
      },
      onError: () => toast.error("Failed to update bus"),
    })

  const useReplaceCheckpoints = () =>
    useMutation({
      mutationFn: ({ busId, data }: { busId: number | string; data: CheckpointRequest }) =>
        replaceCheckpoints(busId, data),
      onSuccess: (_, { busId }) => {
        qc.invalidateQueries({ queryKey: ["checkpoints", busId] })
        qc.invalidateQueries({ queryKey: ["bus", busId] })
        toast.success("Checkpoints updated")
      },
      onError: () => toast.error("Failed to update checkpoints"),
    })

  const useAuthorizePlateChange = () =>
    useMutation({
      mutationFn: ({ busId, data }: { busId: number | string; data: PlateChangeAuthorizeRequest }) =>
        authorizePlateChange(busId, data),
    })

  const useUpdatePlate = () =>
    useMutation({
      mutationFn: ({ busId, data }: { busId: number | string; data: PlateUpdateRequest }) =>
        updatePlate(busId, data),
      onSuccess: (_, { busId }) => {
        qc.invalidateQueries({ queryKey: ["bus", busId] })
        qc.invalidateQueries({ queryKey: ["buses"] })
        toast.success("Plate updated")
      },
      onError: () => toast.error("Failed to update plate"),
    })

  const useAddStudentToBus = () =>
    useMutation({
      mutationFn: ({ busId, data }: { busId: number | string; data: StudentRequest }) =>
        addStudentToBus(busId, data),
      onSuccess: (_, { busId }) => {
        qc.invalidateQueries({ queryKey: ["bus", busId] })
        qc.invalidateQueries({ queryKey: ["students"] })
        toast.success("Student added")
      },
      onError: () => toast.error("Failed to add student"),
    })

  return {
    useBusList,
    useBusDetail,
    useBusCheckpoints,
    useCreateBus,
    useUpdateBus,
    useReplaceCheckpoints,
    useAuthorizePlateChange,
    useUpdatePlate,
    useAddStudentToBus,
  }
}

export default useBus
