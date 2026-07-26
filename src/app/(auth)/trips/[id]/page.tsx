"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bus, Users, Clock, Flag, CircleCheck, XCircle } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { StatusBadge } from "@/components/status-badge"
import useTrip from "@/hooks/use-trip"

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

const attendanceLabel: Record<string, string> = {
  ONBOARD: "On Board",
  DROPPED: "Dropped",
  ABSENT: "Absent",
  NOT_TODAY: "Not Today",
}

const attendanceStyle: Record<string, string> = {
  ONBOARD: "badge-success",
  DROPPED: "badge-info",
  ABSENT: "badge-error",
  NOT_TODAY: "badge-ghost",
}

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
    return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })
  } catch {
    return iso
  }
}

const formatDateLong = (iso: string | null) => {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  } catch {
    return iso
  }
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { useTripDetail, useToggleCancelTrip } = useTrip()
  const cancelMutation = useToggleCancelTrip()

  const { data: tripRes, isLoading, error } = useTripDetail(id)
  const trip = tripRes?.data ?? null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load trip"}</span>
        <div className="flex gap-2">
          <Link href="/trips" className="btn btn-ghost btn-sm">Back to Trips</Link>
          <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-sm text-base-content/40">Trip not found</span>
        <Link href="/trips" className="btn btn-ghost btn-sm">Back to Trips</Link>
      </div>
    )
  }

  const badgeStatus = statusMap[trip.status] ?? "scheduled"
  const isCancelled = trip.status === "CANCELLED"

  const handleToggleCancel = () => {
    if (!confirm("Are you sure you want to toggle the cancellation status of this trip?")) return
    cancelMutation.mutate(trip.id)
  }

  const timelineSteps = [
    {
      label: "Trip Scheduled",
      time: formatDateLong(trip.date),
      done: true,
      icon: Clock,
    },
    {
      label: "Driver Started Trip",
      time: trip.start ? formatTime(trip.start) : null,
      done: !!trip.start,
      icon: Flag,
    },
    {
      label: "Trip Completed",
      time: trip.end ? formatTime(trip.end) : null,
      done: trip.status === "COMPLETED",
      icon: CircleCheck,
    },
    {
      label: "Cancelled",
      time: null,
      done: trip.status === "CANCELLED",
      icon: XCircle,
    },
  ]

  const rosterCount = trip.roster?.length ?? 0

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Trips", href: "/trips" }, { label: `Trip #${trip.id}` }]} />

      <div className="flex items-start gap-3">
        <Link href="/trips" className="btn btn-ghost btn-xs btn-square mt-0.5 shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bus size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Trip #{trip.id}</h1>
            <StatusBadge status={badgeStatus} label={statusLabel[trip.status] ?? trip.status} />
            {!isCancelled && trip.status !== "COMPLETED" && (
              <button
                className="btn btn-error btn-xs gap-1.5 ml-auto"
                onClick={handleToggleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <XCircle size={12} />
                )}
                Cancel Trip
              </button>
            )}
          </div>
          <p className="mt-0.5 text-sm text-base-content/50 truncate">
            {trip.routeName ?? "No route"}
            <span className="mx-1.5 text-base-content/20">·</span>
            {trip.driverName ?? "No driver"}
            <span className="mx-1.5 text-base-content/20">·</span>
            {formatDate(trip.date)}
            {trip.shift && (
              <>
                <span className="mx-1.5 text-base-content/20">·</span>
                {trip.shift}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-box bg-base-100 p-3 shadow-card w-44">
          <div className="flex items-center gap-1.5 mb-1">
            <Users size={14} className="text-base-content/40" />
            <span className="t-micro text-base-content/40 font-medium">Total Students</span>
          </div>
          <div className="t-h2">{trip.studentCount}</div>
        </div>
        <div className="rounded-box bg-base-100 p-3 shadow-card w-44">
          <div className="flex items-center gap-1.5 mb-1">
            <Flag size={14} className="text-base-content/40" />
            <span className="t-micro text-base-content/40 font-medium">Departed</span>
          </div>
          <div className="t-h2">{formatTime(trip.start)}</div>
        </div>
        <div className="rounded-box bg-base-100 p-3 shadow-card w-44">
          <div className="flex items-center gap-1.5 mb-1">
            <CircleCheck size={14} className="text-base-content/40" />
            <span className="t-micro text-base-content/40 font-medium">Arrived</span>
          </div>
          <div className="t-h2">{formatTime(trip.end)}</div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_360px] items-start">
        <div className="rounded-box bg-base-100 p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="t-label font-semibold">
              Attendance Roster
              <span className="badge badge-sm badge-ghost ml-1.5">{rosterCount}</span>
            </h2>
            <Link
              href={`/bus/${trip.busDisplayId}`}
              className="btn btn-outline btn-xs gap-1.5"
            >
              <Bus size={12} />
              Open Bus
            </Link>
          </div>
          {rosterCount > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Stop</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.roster.map((r) => (
                    <tr key={r.studentId}>
                      <td className="font-medium text-sm">{r.name}</td>
                      <td className="text-sm text-base-content/60">{r.klass ?? "—"}</td>
                      <td className="text-sm text-base-content/60">{r.checkpoint ?? "—"}</td>
                      <td>
                        <span className={`badge badge-sm ${attendanceStyle[r.attendanceStatus] ?? "badge-ghost"}`}>
                          {attendanceLabel[r.attendanceStatus] ?? r.attendanceStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-base-content/40 py-6 text-center">No students assigned to this trip.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-box bg-base-100 p-4 shadow-card">
            <h2 className="t-label font-semibold mb-3">Trip Details</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/40">Bus</span>
                <Link href={`/bus/${trip.busDisplayId}`} className="text-primary font-medium link link-hover">
                  {trip.busDisplayId}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/40">Route</span>
                <span className="text-base-content">{trip.routeName ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/40">Driver</span>
                <span className="text-base-content font-medium">{trip.driverName ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/40">Date</span>
                <span className="text-base-content">{formatDateLong(trip.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/40">Shift</span>
                <span className="text-base-content">{trip.shift ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-box bg-base-100 p-4 shadow-card">
            <h2 className="t-label font-semibold mb-4">Timeline</h2>
            <div className="relative">
              {timelineSteps.map((step, idx) => {
                const Icon = step.icon
                const isLast = idx === timelineSteps.length - 1
                return (
                  <div key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                          step.done
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content/30"
                        }`}
                      >
                        <Icon size={13} />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-px flex-1 min-h-[24px] ${
                            step.done ? "bg-primary/30" : "bg-base-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className={`text-sm font-medium ${
                          step.done ? "text-base-content" : "text-base-content/30"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.time && (
                        <p className="text-xs text-base-content/40 mt-0.5">{step.time}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
