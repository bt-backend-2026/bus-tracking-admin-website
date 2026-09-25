"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye, RotateCcw, X } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import { StatusBadge } from "@bustrack/ui"
import useTrip from "@bustrack/hooks/use-trip"
import type { TripListParams } from "@bustrack/types/api/trip"

const statusMap: Record<string, string> = {
  PENDING: "scheduled",
  ACTIVE: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

const statusLabel: Record<string, string> = {
  PENDING: "Scheduled",
  ACTIVE: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export default function TripsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { useTripList, useToggleCancelTrip } = useTrip()
  const cancelMutation = useToggleCancelTrip()

  const apiStatus = statusFilter === "all" ? undefined : statusFilter === "completed" ? "COMPLETED" : statusFilter === "in-progress" ? "ACTIVE" : statusFilter === "scheduled" ? "PENDING" : "CANCELLED"

  const params: TripListParams = {
    search: searchQuery,
    status: apiStatus,
  }

  const { data, isLoading, error } = useTripList(params)
  const trips = data?.data ?? []

  const formatTime = (iso: string | null) => {
    if (!iso) return "—"
    try {
      return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    } catch {
      return iso
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } catch {
      return iso
    }
  }

  const handleToggleCancel = (tripId: number) => {
    if (!confirm("Are you sure you want to toggle the cancellation status of this trip?")) return
    cancelMutation.mutate(tripId)
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Trips" }]} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="t-h1">Trips</h1>
          <p className="t-body text-base-content/50 mt-1">Manage bus trips and schedules</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="input input-md input-ghost bg-base-100 shadow-card flex items-center gap-1.5 min-w-48">
          <Search size={14} className="text-base-content/30" />
          <input type="text" placeholder="Search by bus, route, or driver..." className="grow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </label>
        <select className="select select-md select-ghost bg-base-100 shadow-card min-w-32" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-box bg-base-100 shadow-card">
        <table className="table">
          <thead>
            <tr>
              <th className="w-24">Date</th>
              <th className="w-16">Shift</th>
              <th className="w-32">Bus / Route</th>
              <th className="w-28">Driver</th>
              <th className="w-20">Start</th>
              <th className="w-20">End</th>
              <th className="w-20">Students</th>
              <th className="w-20">Status</th>
              <th className="w-0">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-12">
                  <span className="loading loading-spinner loading-md text-primary" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load trips"}</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => window.location.reload()}>Retry</button>
                  </div>
                </td>
              </tr>
            ) : trips.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-sm text-base-content/40">
                  {searchQuery || statusFilter !== "all" ? "No trips match your search." : "No trips found."}
                </td>
              </tr>
            ) : (
              trips.map((t) => {
                const badgeStatus = statusMap[t.status] ?? "scheduled"
                return (
                  <tr key={t.id}>
                    <td className="text-sm text-base-content/60">{formatDate(t.date)}</td>
                    <td>
                      <span className="badge badge-sm badge-ghost text-base-content/60">{t.shift ?? "—"}</span>
                    </td>
                    <td className="text-sm">
                      <span className="font-medium">{t.busDisplayId ?? "—"}</span>
                      {t.routeName && <span className="text-base-content/40"> / {t.routeName}</span>}
                    </td>
                    <td className="text-sm text-base-content/60">{t.driverName ?? "—"}</td>
                    <td className="text-sm text-base-content/60">{formatTime(t.start)}</td>
                    <td className="text-sm text-base-content/60">{formatTime(t.end)}</td>
                    <td className="text-sm text-base-content/60">{t.studentCount}</td>
                    <td>
                      <StatusBadge status={badgeStatus} label={statusLabel[t.status] ?? t.status} />
                    </td>
                    <td className="w-0">
                      <div className="flex items-center gap-0.5">
                        <div className="tooltip" data-tip="View details">
                          <button type="button" className="btn btn-ghost btn-xs btn-square" onClick={() => router.push(`/trips/${t.id}`)}>
                            <Eye size={16} />
                          </button>
                        </div>
                        {(t.status === "PENDING" || t.status === "ACTIVE" || t.status === "CANCELLED") && (
                          <div className="tooltip" data-tip={t.status === "CANCELLED" ? "Restore trip" : "Cancel trip"}>
                            <button
                              type="button"
                              className={`btn btn-ghost btn-xs btn-square ${t.status === "CANCELLED" ? "text-success" : "text-error"}`}
                              onClick={() => handleToggleCancel(t.id)}
                              disabled={cancelMutation.isPending}
                            >
                              {t.status === "CANCELLED" ? <RotateCcw size={16} /> : <X size={16} />}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
