"use client"

import Link from "next/link"
import { Building2, Bus, Users, GraduationCap, UserPlus, ArrowRight } from "lucide-react"
import { KpiCard, StatusBadge } from "@bustrack/ui"
import useSchool from "@bustrack/hooks/use-school"
import { SchoolStatus } from "@bustrack/types/enums"
import { getApiErrorMessage } from "./auth-errors"

// The list endpoint is paginated with no server-side cap on `size`, so a large
// `size` is how the platform totals are derived in one round trip rather than
// paging through every school. Clamped client-side.
const SUMMARY_PAGE_SIZE = 100

const statusStyle: Record<string, string> = {
  ACTIVE: "active",
  SUSPENDED: "on-leave",
  ARCHIVED: "inactive",
}

export default function PlatformOverview() {
  const { useSchoolList } = useSchool()
  const { data, isLoading, error } = useSchoolList({
    page: 0,
    size: SUMMARY_PAGE_SIZE,
    sortBy: "name",
    sortDir: "asc",
  })

  const schools = data?.data.content ?? []
  const total = data?.data.totalElements ?? 0
  const activeCount = schools.filter((s) => s.status === SchoolStatus.ACTIVE).length

  // Counts come back per row, so these are sums over the fetched page.
  const totalBuses = schools.reduce((n, s) => n + s.busCount, 0)
  const totalStudents = schools.reduce((n, s) => n + s.studentCount, 0)
  const totalAdmins = schools.reduce((n, s) => n + s.adminCount, 0)
  const truncated = total > schools.length

  const shortlist = schools.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="t-h1">Platform</h1>
        <p className="t-body text-base-content/50 mt-1">
          Cross-school overview for every tenant on BusTrack.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Schools"
          value={isLoading ? "—" : total}
          description={truncated ? `First ${schools.length} shown` : "All tenants"}
          icon={<Building2 size={16} />}
        />
        <KpiCard
          title="Active Schools"
          value={isLoading ? "—" : activeCount}
          valueColor="text-success"
          icon={<GraduationCap size={16} />}
        />
        <KpiCard
          title="Buses & Students"
          value={isLoading ? "—" : `${totalBuses} / ${totalStudents}`}
          icon={<Bus size={16} />}
        />
        <KpiCard title="Admins" value={isLoading ? "—" : totalAdmins} icon={<Users size={16} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="rounded-box bg-base-100 shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-base-300 px-5 py-4">
            <h2 className="t-h3">Schools</h2>
            <Link href="/schools" className="btn btn-ghost btn-xs gap-1">
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-14">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : error ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm text-base-content/40">{getApiErrorMessage(error, "Failed to load schools")}</p>
            </div>
          ) : schools.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="t-body text-base-content/40">No schools yet.</p>
              <Link href="/schools/new" className="btn btn-primary btn-sm mt-4">
                Onboard the first school
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-base-200">
              {shortlist.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/schools/${s.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-base-200/60"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{s.name}</div>
                      <div className="truncate text-[11px] text-base-content/40">
                        {[s.city, s.address].filter(Boolean).join(", ") || "No location set"}
                      </div>
                    </div>
                    <div className="tabular-nums hidden shrink-0 gap-4 text-xs text-base-content/50 sm:flex">
                      <span>{s.busCount} buses</span>
                      <span>{s.studentCount} students</span>
                    </div>
                    <StatusBadge
                      status={statusStyle[s.status] ?? "inactive"}
                      label={s.status === SchoolStatus.ACTIVE ? "Active" : s.status === SchoolStatus.SUSPENDED ? "Suspended" : "Archived"}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-4">
          <Link
            href="/schools/new"
            className="card-hover block rounded-box bg-primary p-5 text-primary-content"
          >
            <Building2 size={20} />
            <h3 className="t-h3 mt-3">Onboard a school</h3>
            <p className="t-body mt-1 opacity-80">
              Create the tenant record, then provision its first admin.
            </p>
          </Link>

          <Link
            href="/admins"
            className="card-hover block rounded-box bg-base-100 p-5 shadow-card"
          >
            <UserPlus size={20} className="text-primary" />
            <h3 className="t-h3 mt-3">Create school admin</h3>
            <p className="t-body text-base-content/50 mt-1">
              Provision an ADMIN account scoped to one school.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
