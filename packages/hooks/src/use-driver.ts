import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listDrivers, getDriverById, updateDriver } from "@bustrack/api-client/services/driver-service"
import type { DriverListParams } from "@bustrack/types/api/driver"
import type { DriverUpdateRequest } from "@bustrack/types/models/driver"
import { toast } from "sonner"

const useDriver = () => {
  const qc = useQueryClient()

  const useDrivers = (params?: DriverListParams) =>
    useQuery({
      queryKey: ["drivers", params],
      queryFn: () => listDrivers(params),
    })

  const useDriverDetail = (id?: number | string) =>
    useQuery({
      queryKey: ["driver", id ?? "none"],
      queryFn: () => getDriverById(id!),
      enabled: !!id,
    })

  const useUpdateDriver = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number | string; data: DriverUpdateRequest }) =>
        updateDriver(id, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["drivers"] })
        toast.success("Driver updated")
      },
      onError: () => toast.error("Failed to update driver"),
    })

  return { useDrivers, useDriverDetail, useUpdateDriver }
}

export default useDriver
