import { useQuery } from "@tanstack/react-query"
import { getDashboardStats, getLiveBuses, getRoutes } from "@bustrack/api-client/services/dashboard-service"

const useDashboard = () => {
  const useDashboardStats = () =>
    useQuery({
      queryKey: ["dashboard-stats"],
      queryFn: getDashboardStats,
    })

  const useLiveBuses = () =>
    useQuery({
      queryKey: ["live-buses"],
      queryFn: getLiveBuses,
    })

  const useRoutes = () =>
    useQuery({
      queryKey: ["routes"],
      queryFn: getRoutes,
    })

  return { useDashboardStats, useLiveBuses, useRoutes }
}

export default useDashboard
