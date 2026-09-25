"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, ShieldCheck } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import { StatusBadge } from "@bustrack/ui"
import useParent from "@bustrack/hooks/use-parent"

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

export default function ParentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { useParentDetail, useRevokeAccess, useResendInvite } = useParent()

  const { data: res, isLoading, error } = useParentDetail(id)
  const parent = res?.data ?? null

  const revokeMutation = useRevokeAccess()
  const resendMutation = useResendInvite()

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
        <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load parent"}</span>
        <div className="flex gap-2">
          <Link href="/parent" className="btn btn-ghost btn-sm">Back to Parents</Link>
          <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  if (!parent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-sm text-base-content/40">Parent not found</span>
        <Link href="/parent" className="btn btn-ghost btn-sm">Back to Parents</Link>
      </div>
    )
  }

  const badgeStatus = statusMap[parent.accessStatus] ?? "inactive"
  const isPending = parent.accessStatus === "PENDING_VERIFICATION"
  const isSuspended = parent.accessStatus === "SUSPENDED"

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Parents", href: "/parent" }, { label: parent.name }]} />

      <div className="flex items-start gap-3">
        <Link href="/parent" className="btn btn-ghost btn-xs btn-square mt-0.5 shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold">
          {parent.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{parent.name}</h1>
            <StatusBadge status={badgeStatus} label={statusLabel[parent.accessStatus] ?? parent.accessStatus} />
            <div className="flex gap-1.5 ml-auto">
              {!isSuspended && (
                <button
                  className="btn btn-outline btn-error btn-xs"
                  onClick={() => revokeMutation.mutate(id)}
                  disabled={revokeMutation.isPending}
                >
                  {revokeMutation.isPending ? <span className="loading loading-spinner loading-xs" /> : "Revoke Access"}
                </button>
              )}
              {isPending && (
                <button
                  className="btn btn-primary btn-xs"
                  onClick={() => resendMutation.mutate(id)}
                  disabled={resendMutation.isPending}
                >
                  {resendMutation.isPending ? <span className="loading loading-spinner loading-xs" /> : "Resend Invite"}
                </button>
              )}
            </div>
          </div>
          <p className="mt-0.5 text-sm text-base-content/50">
            <span className="font-medium text-base-content/70">{parent.children.length}</span>
            {parent.children.length === 1 ? " child" : " children"}
            <span className="mx-1.5 text-base-content/20">·</span>
            <span className="font-medium text-base-content/70">{statusLabel[parent.accessStatus] ?? parent.accessStatus}</span> access
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-box bg-base-100 p-3 shadow-card w-44">
          <div className="flex items-center gap-1.5 mb-1">
            <Users size={14} className="text-base-content/40" />
            <span className="t-micro text-base-content/40 font-medium">Children</span>
          </div>
          <div className="t-h2">{parent.children.length}</div>
        </div>
        <div className="rounded-box bg-base-100 p-3 shadow-card w-44">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck size={14} className="text-base-content/40" />
            <span className="t-micro text-base-content/40 font-medium">Access</span>
          </div>
          <StatusBadge status={badgeStatus} label={statusLabel[parent.accessStatus] ?? parent.accessStatus} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr] items-start">
        <div className="rounded-box bg-base-100 p-4 shadow-card">
          <h2 className="t-label font-semibold mb-3">Contact Details</h2>
          <div className="flex flex-col gap-3">
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Full Name</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm font-medium h-10 px-3 rounded-lg w-full">
                {parent.name}
              </div>
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Phone</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                {parent.phone ?? "—"}
              </div>
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Email</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                {parent.email ?? "—"}
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-box bg-base-100 p-4 shadow-card">
          <h2 className="t-label font-semibold mb-3">
            Children
            {parent.children.length > 0 && <span className="badge badge-sm badge-ghost ml-1.5">{parent.children.length}</span>}
          </h2>
          {parent.children.length > 0 ? (
            <div className="space-y-3">
              {parent.children.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-lg bg-base-200/30 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-base-content/50">
                      {c.busDisplayId && <>Bus: {c.busDisplayId}</>}
                      {c.busDisplayId && c.klass && <span className="mx-1 text-base-content/20">·</span>}
                      {c.klass && <>Class: {c.klass}</>}
                      {!c.busDisplayId && !c.klass && "—"}
                    </div>
                  </div>
                  <StatusBadge status="active" label="Active" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-base-content/40 py-4 text-center">No children linked.</p>
          )}
        </div>
      </div>
    </div>
  )
}
