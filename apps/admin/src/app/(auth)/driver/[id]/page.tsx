"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lock, Bus, Calendar } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import { StatusBadge } from "@bustrack/ui"
import useDriver from "@bustrack/hooks/use-driver"
import { DriverStatus } from "@bustrack/types/enums"

const statusMap: Record<string, string> = {
  ACTIVE: "active",
  ON_LEAVE: "on-leave",
  INACTIVE: "inactive",
}

const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  INACTIVE: "Inactive",
}

const formatDate = (iso: string | null) => {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return iso
  }
}

export default function DriverDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { useDriverDetail, useUpdateDriver } = useDriver()

  const { data: res, isLoading, error } = useDriverDetail(id)
  const driver = res?.data ?? null

  const deactivateMutation = useUpdateDriver()

  const handleDeactivate = () => {
    if (!confirm("Are you sure you want to deactivate this driver?")) return
    deactivateMutation.mutate({ id, data: { status: DriverStatus.INACTIVE } })
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
        <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load driver"}</span>
        <div className="flex gap-2">
          <Link href="/driver" className="btn btn-ghost btn-sm">Back to Drivers</Link>
          <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-sm text-base-content/40">Driver not found</span>
        <Link href="/driver" className="btn btn-ghost btn-sm">Back to Drivers</Link>
      </div>
    )
  }

  const badgeStatus = statusMap[driver.status] ?? "inactive"
  const isActive = driver.status === "ACTIVE" || driver.status === "ON_LEAVE"

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Drivers", href: "/driver" }, { label: driver.name }]} />

      <div className="flex items-start gap-3">
        <Link href="/driver" className="btn btn-ghost btn-xs btn-square mt-0.5 shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold">
          {driver.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{driver.name}</h1>
            <StatusBadge status={badgeStatus} label={statusLabel[driver.status] ?? driver.status} />
            {isActive && (
              <button
                className="btn btn-error btn-xs gap-1.5 ml-auto"
                onClick={handleDeactivate}
                disabled={deactivateMutation.isPending}
              >
                {deactivateMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Lock size={12} />
                )}
                Deactivate
              </button>
            )}
          </div>
          <p className="mt-0.5 text-sm text-base-content/50">
            {driver.busDisplayId ? (
              <>Bus: <span className="font-medium text-base-content/70">{driver.busDisplayId}</span></>
            ) : (
              "No bus assigned"
            )}
            <span className="mx-1.5 text-base-content/20">·</span>
            Joined: <span className="font-medium text-base-content/70">{formatDate(driver.joined)}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-box bg-base-100 p-3 shadow-card w-48">
          <div className="flex items-center gap-1.5 mb-1">
            <Bus size={14} className="text-base-content/40" />
            <span className="t-micro text-base-content/40 font-medium">Assigned Bus</span>
          </div>
          {driver.busDisplayId ? (
            <div>
              <div className="t-h2">{driver.busDisplayId}</div>
              <Link href={`/bus/${driver.busId ?? driver.busDisplayId}`} className="text-xs text-primary link link-hover">
                View Bus &rarr;
              </Link>
            </div>
          ) : (
            <p className="text-sm text-base-content/40 py-2">No bus assigned.</p>
          )}
        </div>

        <div className="rounded-box bg-base-100 p-3 shadow-card w-48">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={14} className="text-base-content/40" />
            <span className="t-micro text-base-content/40 font-medium">Tenure</span>
          </div>
          <div className="t-h2">{formatDate(driver.joined)}</div>
          <p className="t-micro text-base-content/40">Start date</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 items-start">
        <div className="rounded-box bg-base-100 p-4 shadow-card">
          <h2 className="t-label font-semibold mb-3">Driver Details</h2>
          <div className="flex flex-col gap-3">
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Full Name</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm font-medium h-10 px-3 rounded-lg w-full">
                {driver.name}
              </div>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="form-control w-full">
                <div className="label py-0 pb-1">
                  <span className="label-text text-xs text-base-content/40">Phone</span>
                </div>
                <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                  {driver.phone}
                </div>
              </label>
              <label className="form-control w-full">
                <div className="label py-0 pb-1">
                  <span className="label-text text-xs text-base-content/40">License</span>
                </div>
                <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm font-mono h-10 px-3 rounded-lg w-full">
                  {driver.license}
                </div>
              </label>
            </div>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Assigned Bus</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                {driver.busDisplayId ?? "—"}
              </div>
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Status</span>
              </div>
              <div className="select select-bordered select-md bg-base-200/50 flex items-center h-10 px-3 rounded-lg w-full">
                <StatusBadge status={badgeStatus} label={statusLabel[driver.status] ?? driver.status} />
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-box bg-base-100 p-4 shadow-card">
            <h2 className="t-label font-semibold mb-3">Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/40">Phone</span>
                <span className="text-base-content">{driver.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/40">License</span>
                <span className="text-base-content font-mono">{driver.license}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/40">Assigned Bus</span>
                <span className="text-base-content">{driver.busDisplayId ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/40">Joined</span>
                <span className="text-base-content">{formatDate(driver.joined)}</span>
              </div>
            </div>
          </div>

          {driver.busDisplayId && (
            <div className="rounded-box bg-base-100 p-4 shadow-card">
              <h2 className="t-label font-semibold mb-3">Current Fleet</h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bus size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{driver.busDisplayId}</div>
                    {driver.routeName && (
                      <div className="text-xs text-base-content/50 truncate">{driver.routeName}</div>
                    )}
                  </div>
                </div>
                <Link
                  href={`/bus/${driver.busId ?? driver.busDisplayId}`}
                  className="btn btn-outline btn-sm w-full gap-1.5"
                >
                  <Bus size={14} />
                  Open Bus
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
