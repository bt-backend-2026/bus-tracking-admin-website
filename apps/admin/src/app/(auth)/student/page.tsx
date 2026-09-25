"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import useStudent from "@bustrack/hooks/use-student"
import type { StudentListParams } from "@bustrack/types/api/student"

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

export default function StudentPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const { useStudentList } = useStudent()

  const params: StudentListParams = {
    search: searchQuery,
  }

  const { data, isLoading, error } = useStudentList(params)
  const students = data?.data ?? []

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Students" }]} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="t-h1">Students</h1>
          <p className="t-body text-base-content/50 mt-1">View and manage student records</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="input input-md input-ghost bg-base-100 shadow-card flex items-center gap-1.5 min-w-48">
          <Search size={14} className="text-base-content/30" />
          <input type="text" placeholder="Search by name or parent..." className="grow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </label>
      </div>

      <div className="overflow-x-auto rounded-box bg-base-100 shadow-card">
        <table className="table">
          <thead>
            <tr>
              <th className="w-44">Name</th>
              <th className="w-20">Class</th>
              <th className="w-28">Bus / Route</th>
              <th className="w-28">Stop</th>
              <th className="w-28">Parent</th>
              <th className="w-24">Status</th>
              <th className="w-0">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <span className="loading loading-spinner loading-md text-primary" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load students"}</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => window.location.reload()}>Retry</button>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-base-content/40">
                  {searchQuery ? "No students match your search." : "No students found."}
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td>
                    {s.klass ? (
                      <span className="badge badge-sm badge-ghost text-base-content/60">{s.klass}</span>
                    ) : (
                      <span className="text-base-content/30">—</span>
                    )}
                  </td>
                  <td className="text-sm text-base-content/30">—</td>
                  <td className="text-sm text-base-content/60">{s.checkpoint ?? "—"}</td>
                  <td className="text-sm text-base-content/60">{s.parentName ?? "—"}</td>
                  <td>
                    {s.attendanceStatus ? (
                      <span className={`badge badge-sm ${attendanceStyle[s.attendanceStatus] ?? "badge-ghost"}`}>
                        {attendanceLabel[s.attendanceStatus] ?? s.attendanceStatus}
                      </span>
                    ) : (
                      <span className="text-base-content/30">—</span>
                    )}
                  </td>
                  <td className="w-0">
                    <div className="tooltip" data-tip="View details">
                      <button type="button" className="btn btn-ghost btn-xs btn-square" onClick={() => router.push(`/student/${s.id}`)}>
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
