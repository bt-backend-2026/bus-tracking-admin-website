"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import { StatusBadge } from "@bustrack/ui"
import useDriver from "@bustrack/hooks/use-driver"
import type { DriverListParams } from "@bustrack/types/api/driver"

const statusStyle: Record<string, string> = {
  ACTIVE: "active",
  ON_LEAVE: "on-leave",
  INACTIVE: "inactive",
}

const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  INACTIVE: "Inactive",
}

export default function DriverPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { useDrivers } = useDriver()

  const params: DriverListParams = {
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter.toUpperCase(),
  }

  const { data, isLoading, error } = useDrivers(params)
  const drivers = data?.data.content ?? []

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Drivers" }]} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="t-h1">Drivers</h1>
          <p className="t-body text-base-content/50 mt-1">Manage driver profiles and assignments</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="input input-md input-ghost bg-base-100 shadow-card flex items-center gap-1.5 min-w-48">
          <Search size={14} className="text-base-content/30" />
          <input type="text" placeholder="Search by name, license, or phone..." className="grow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </label>
        <select className="select select-md select-ghost bg-base-100 shadow-card min-w-32" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-box bg-base-100 shadow-card">
        <table className="table">
          <thead>
            <tr>
              <th className="w-44">Name</th>
              <th className="w-28">License</th>
              <th className="w-24">Assigned Bus</th>
              <th className="w-28">Joined</th>
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
                    <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load drivers"}</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => window.location.reload()}>Retry</button>
                  </div>
                </td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-base-content/40">
                  {searchQuery || statusFilter !== "all" ? "No drivers match your search." : "No drivers found."}
                </td>
              </tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {d.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{d.name}</div>
                        <div className="text-[11px] text-base-content/40">{d.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm font-mono text-base-content/60">{d.license}</td>
                  <td className="text-sm text-base-content/60">{d.busDisplayId ?? "—"}</td>
                  <td className="text-sm text-base-content/60">{d.joined ? new Date(d.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                  <td>
                    <StatusBadge status={statusStyle[d.status] ?? "inactive"} label={statusLabel[d.status] ?? d.status} />
                  </td>
                  <td className="w-0">
                    <div className="tooltip" data-tip="View details">
                      <button type="button" className="btn btn-ghost btn-xs btn-square" onClick={() => router.push(`/driver/${d.id}`)}>
                        <Eye size={16} />
                      </button>
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
