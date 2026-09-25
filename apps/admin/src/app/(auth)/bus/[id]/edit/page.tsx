"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@bustrack/ui"
import { StatusBadge } from "@bustrack/ui"
import useBus from "@bustrack/hooks/use-bus"
import type { BusUpdateRequest } from "@bustrack/types/models/bus"

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

const shiftOptions = [
  { value: "", label: "—" },
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
]

export default function BusEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { useBusDetail, useUpdateBus } = useBus()

  const { data, isLoading, error } = useBusDetail(id)
  const bus = data?.data ?? null

  const updateBus = useUpdateBus()

  const [capacity, setCapacity] = useState("")
  const [shift, setShift] = useState("")
  const [status, setStatus] = useState("")
  const [routeName, setRouteName] = useState("")
  const [routeCode, setRouteCode] = useState("")

  useEffect(() => {
    if (!bus) return
    setCapacity(bus.capacity?.toString() ?? "")
    setShift(bus.shift ?? "")
    setStatus(bus.status.toLowerCase())
    setRouteName(bus.routeName ?? "")
    setRouteCode(bus.routeCode ?? "")
  }, [bus])

  const handleSave = async () => {
    const data: BusUpdateRequest = {}
    if (capacity) data.capacity = Number(capacity)
    if (shift) data.shift = shift
    if (status) data.status = status
    if (routeName) data.routeName = routeName
    if (routeCode) data.routeCode = routeCode

    await updateBus.mutateAsync({ id, data })
    router.push(`/bus/${id}`)
  }

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
        <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load bus"}</span>
        <Link href="/bus" className="btn btn-ghost btn-sm">Back to Buses</Link>
      </div>
    )
  }

  if (!bus) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-sm text-base-content/40">Bus not found</span>
        <Link href="/bus" className="btn btn-ghost btn-sm">Back to Buses</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        href={`/bus/${id}`}
        className="inline-flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/70 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Bus Details
      </Link>

      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Buses", href: "/bus" },
          { label: bus.displayId, href: `/bus/${id}` },
          { label: "Edit" },
        ]}
      />

      <div>
        <div className="flex items-center gap-2">
          <h1 className="t-h1">Edit Bus — {bus.displayId}</h1>
          <StatusBadge status={bus.status} />
        </div>
        <p className="t-body text-base-content/50 mt-0.5">Update bus configuration, route info, and operational status</p>
      </div>

      <div className="rounded-box bg-base-100 p-5 shadow-card">
        <h2 className="t-label font-semibold mb-4">Bus Info</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="t-label text-base-content/70 mb-1.5 block">Capacity</label>
              <input
                className="input w-full"
                type="number"
                min={0}
                placeholder="Seats"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            <div>
              <label className="t-label text-base-content/70 mb-1.5 block">Shift</label>
              <select
                className="select w-full"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              >
                {shiftOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="t-label text-base-content/70 mb-1.5 block">Status</label>
              <select
                className="select w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="t-label text-base-content/70 mb-1.5 block">Route name</label>
            <input
              className="input w-full"
              placeholder="e.g. Route Sanepa"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />
          </div>

          <div>
            <label className="t-label text-base-content/70 mb-1.5 block">Route code</label>
            <input
              className="input w-full"
              placeholder="e.g. RTE-A"
              value={routeCode}
              onChange={(e) => setRouteCode(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Link href={`/bus/${id}`} className="btn btn-ghost btn-sm">
          Cancel
        </Link>
        <button
          className="btn btn-primary btn-sm gap-1.5"
          disabled={updateBus.isPending}
          onClick={handleSave}
        >
          {updateBus.isPending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Save size={14} />
          )}
          Save Changes
        </button>
      </div>
    </div>
  )
}
