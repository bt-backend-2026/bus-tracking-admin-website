"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Bus, Eye, PencilLine } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import { StatusBadge } from "@bustrack/ui"
import useBus from "@bustrack/hooks/use-bus"
import type { BusListParams } from "@bustrack/types/api/bus"

const busStatusStyle: Record<string, string> = {
  active: "active",
  inactive: "inactive",
}

const busStatusLabel: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
}

export default function BusPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { useBusList } = useBus()

  const params: BusListParams = {
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
  }

  const { data, isLoading, error } = useBusList(params)
  const buses = data?.data ?? []

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Buses" }]} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="t-h1">Buses</h1>
          <p className="t-body text-base-content/50 mt-1">Manage bus fleet and assignments</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="input input-md input-ghost bg-base-100 shadow-card flex items-center gap-1.5 min-w-48">
          <Search size={14} className="text-base-content/30" />
          <input type="text" placeholder="Search by plate or driver..." className="grow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </label>
        <select className="select select-md select-ghost bg-base-100 shadow-card min-w-32" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-box bg-base-100 shadow-card">
        <table className="table">
          <thead>
            <tr>
              <th className="w-44">Plate</th>
              <th className="w-24">Capacity</th>
              <th className="w-36">Driver</th>
              <th className="w-28">Phone</th>
              <th className="w-24">Status</th>
              <th className="w-0">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <span className="loading loading-spinner loading-md text-primary" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load buses"}</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => window.location.reload()}>Retry</button>
                  </div>
                </td>
              </tr>
            ) : buses.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-base-content/40">
                  {searchQuery || statusFilter !== "all" ? "No buses match your search." : "No buses found."}
                </td>
              </tr>
            ) : (
              buses.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Bus size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{b.displayId}</div>
                        <div className="text-[11px] text-base-content/40 font-mono">{b.plate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-base-content/60">
                    {b.studentCount}<span className="text-base-content/30"> / </span>{b.capacity ?? "—"}
                  </td>
                  <td>
                    {b.driverName ? (
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {b.driverName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{b.driverName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-base-content/30">—</span>
                    )}
                  </td>
                  <td className="text-sm text-base-content/60">{b.driverPhone ?? "—"}</td>
                  <td>
                    <StatusBadge
                      status={busStatusStyle[b.status.toLowerCase()] ?? "inactive"}
                      label={busStatusLabel[b.status.toLowerCase()] ?? b.status}
                    />
                  </td>
                  <td className="w-0">
                    <div className="flex items-center gap-0.5">
                      <div className="tooltip" data-tip="View details">
                        <button type="button" className="btn btn-ghost btn-xs btn-square" onClick={() => router.push(`/bus/${b.id}`)}>
                          <Eye size={16} />
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Edit bus">
                        <button type="button" className="btn btn-ghost btn-xs btn-square text-base-content/30 hover:text-primary" onClick={() => router.push(`/bus/${b.id}/edit`)}>
                          <PencilLine size={16} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
