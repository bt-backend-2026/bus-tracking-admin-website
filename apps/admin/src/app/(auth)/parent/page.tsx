"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import { StatusBadge } from "@bustrack/ui"
import useParent from "@bustrack/hooks/use-parent"
import type { ParentListParams } from "@bustrack/types/api/parent"

const statusMap: Record<string, string> = {
  ACTIVE: "active",
  SUSPENDED: "inactive",
  PENDING_VERIFICATION: "pending",
}

const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  PENDING_VERIFICATION: "Pending",
}

export default function ParentPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const { useParentList } = useParent()

  const params: ParentListParams = {
    search: searchQuery,
  }

  const { data, isLoading, error } = useParentList(params)
  const parents = data?.data ?? []

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Parents" }]} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="t-h1">Parents</h1>
          <p className="t-body text-base-content/50 mt-1">Manage parent accounts and communication</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="input input-md input-ghost bg-base-100 shadow-card flex items-center gap-1.5 min-w-48">
          <Search size={14} className="text-base-content/30" />
          <input type="text" placeholder="Search by name, phone, or child..." className="grow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </label>
      </div>

      <div className="overflow-x-auto rounded-box bg-base-100 shadow-card">
        <table className="table">
          <thead>
            <tr>
              <th className="w-44">Name</th>
              <th className="w-28">Phone</th>
              <th className="w-36">Email</th>
              <th className="w-28">Children</th>
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
                    <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load parents"}</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => window.location.reload()}>Retry</button>
                  </div>
                </td>
              </tr>
            ) : parents.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-base-content/40">
                  {searchQuery ? "No parents match your search." : "No parents found."}
                </td>
              </tr>
            ) : (
              parents.map((p) => {
                const badgeStatus = statusMap[p.accessStatus] ?? "inactive"
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/60">{p.phone ?? "—"}</td>
                    <td className="text-sm text-base-content/60">{p.email ?? "—"}</td>
                    <td className="text-sm text-base-content/60">
                      {p.children.length > 0 ? (
                        <span className="text-xs">{p.children.map((c) => c.name).join(", ")}</span>
                      ) : (
                        <span className="text-base-content/30">—</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={badgeStatus} label={statusLabel[p.accessStatus] ?? p.accessStatus} />
                    </td>
                    <td className="w-0">
                      <div className="tooltip" data-tip="View details">
                        <button type="button" className="btn btn-ghost btn-xs btn-square" onClick={() => router.push(`/parent/${p.id}`)}>
                          <Eye size={16} />
                        </button>
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
