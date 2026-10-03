"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Eye, Plus, School as SchoolIcon } from "lucide-react"
import { Breadcrumbs, StatusBadge } from "@bustrack/ui"
import useSchool from "@bustrack/hooks/use-school"
import type { SchoolStatusParam, SchoolSortField } from "@bustrack/types/api/school"
import { SchoolStatus } from "@bustrack/types/enums"
import { getApiErrorMessage } from "../auth-errors"

const PAGE_SIZE = 20

const statusStyle: Record<string, string> = {
  ACTIVE: "active",
  SUSPENDED: "on-leave",
  ARCHIVED: "inactive",
}

const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  ARCHIVED: "Archived",
}

function SortHeader({
  label,
  field,
  active,
  dir,
  onClick,
}: {
  label: string
  field: SchoolSortField
  active: SchoolSortField
  dir: "asc" | "desc"
  onClick: (field: SchoolSortField) => void
}) {
  const isActive = field === active
  return (
    <button
      type="button"
      className="inline-flex items-center font-semibold hover:text-primary"
      onClick={() => onClick(field)}
    >
      {label}
      <span className={isActive ? "text-primary" : "text-base-content/20"}>
        {isActive ? (dir === "asc" ? " ↑" : " ↓") : ""}
      </span>
    </button>
  )
}

export default function SchoolsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | SchoolStatusParam>("all")
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<SchoolSortField>("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const { useSchoolList } = useSchool()

  const params = useMemo(
    () => ({
      q: searchQuery || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      size: PAGE_SIZE,
      sortBy,
      sortDir,
    }),
    [searchQuery, statusFilter, page, sortBy, sortDir]
  )

  const { data, isLoading, error } = useSchoolList(params)
  const schools = data?.data.content ?? []
  const totalPages = data?.data.totalPages ?? 0
  const totalElements = data?.data.totalElements ?? 0

  const toggleSort = (field: SchoolSortField) => {
    if (field === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(field)
      setSortDir("asc")
    }
    setPage(0)
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Platform", href: "/" }, { label: "Schools" }]} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="t-h1">Schools</h1>
          <p className="t-body text-base-content/50 mt-1">
            {isLoading ? "Loading schools..." : `${totalElements} school${totalElements === 1 ? "" : "s"} on the platform`}
          </p>
        </div>
        <Link href="/schools/new" className="btn btn-primary btn-sm gap-1.5">
          <Plus size={16} />
          New School
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="input input-md input-ghost bg-base-100 shadow-card flex items-center gap-1.5 min-w-48">
          <Search size={14} className="text-base-content/30" />
          <input
            type="text"
            placeholder="Search by name, city, or address..."
            className="grow"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(0)
            }}
          />
        </label>
        <select
          className="select select-md select-ghost bg-base-100 shadow-card min-w-32"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "all" | SchoolStatusParam)
            setPage(0)
          }}
        >
          <option value="all">All Status</option>
          <option value={SchoolStatus.ACTIVE}>Active</option>
          <option value={SchoolStatus.SUSPENDED}>Suspended</option>
          <option value={SchoolStatus.ARCHIVED}>Archived</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-box bg-base-100 shadow-card">
        <table className="table">
          <thead>
            <tr>
              <th className="w-56">
                <SortHeader label="Name" field="name" active={sortBy} dir={sortDir} onClick={toggleSort} />
              </th>
              <th className="w-40">
                <SortHeader label="City" field="city" active={sortBy} dir={sortDir} onClick={toggleSort} />
              </th>
              <th className="w-24 text-right">Buses</th>
              <th className="w-24 text-right">Students</th>
              <th className="w-24 text-right">Admins</th>
              <th className="w-28">
                <SortHeader label="Status" field="status" active={sortBy} dir={sortDir} onClick={toggleSort} />
              </th>
              <th className="w-0" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <span className="loading loading-spinner loading-md text-primary" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-base-content/40">
                      {getApiErrorMessage(error, "Failed to load schools")}
                    </span>
                    <button className="btn btn-ghost btn-xs" onClick={() => window.location.reload()}>
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : schools.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-sm text-base-content/40">
                  {searchQuery || statusFilter !== "all"
                    ? "No schools match your search."
                    : "No schools yet."}
                </td>
              </tr>
            ) : (
              schools.map((s) => (
                <tr key={s.id} className="hover:bg-base-200/50">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <SchoolIcon size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{s.name}</div>
                        {s.address && (
                          <div className="truncate text-[11px] text-base-content/40">{s.address}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-base-content/60">{s.city ?? "—"}</td>
                  <td className="tabular-nums text-right text-sm text-base-content/60">{s.busCount}</td>
                  <td className="tabular-nums text-right text-sm text-base-content/60">{s.studentCount}</td>
                  <td className="tabular-nums text-right text-sm text-base-content/60">{s.adminCount}</td>
                  <td>
                    <StatusBadge
                      status={statusStyle[s.status] ?? "inactive"}
                      label={statusLabel[s.status] ?? s.status}
                    />
                  </td>
                  <td className="w-0">
                    <div className="tooltip" data-tip="View details">
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-square"
                        onClick={() => router.push(`/schools/${s.id}`)}
                      >
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="t-micro text-base-content/40">
            Page {page + 1} of {totalPages}
          </span>
          <div className="join">
            <button
              className="btn btn-sm join-item"
              disabled={page === 0 || isLoading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              «
            </button>
            <button
              className="btn btn-sm join-item"
              disabled={page >= totalPages - 1 || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
