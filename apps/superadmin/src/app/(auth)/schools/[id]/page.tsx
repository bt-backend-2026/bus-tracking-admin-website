"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Bus as BusIcon,
  Users,
  UserCog,
  Pencil,
  PauseCircle,
  PlayCircle,
  Archive,
  Plus,
} from "lucide-react"
import { Breadcrumbs, StatusBadge, KpiCard, ConfirmDialog } from "@bustrack/ui"
import useSchool from "@bustrack/hooks/use-school"
import { SchoolStatus } from "@bustrack/types/enums"
import type { UpdateSchoolRequest } from "@bustrack/types/models/school"
import { getApiErrorMessage } from "../../auth-errors"

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

type Lifecycle = "suspend" | "restore" | "archive" | null

const CONFIRM_COPY: Record<
  Exclude<Lifecycle, null>,
  { tone: "danger" | "warning"; title: string; message: string; label: string }
> = {
  suspend: {
    tone: "danger",
    title: "Suspend this school?",
    message:
      "Its admins will be signed out and their refresh tokens revoked. Any sessions already in flight stay valid for up to 15 minutes.",
    label: "Suspend",
  },
  restore: {
    tone: "warning",
    title: "Restore this school?",
    message:
      "The school returns to Active and any admins suspended by the previous suspension are reactivated.",
    label: "Restore",
  },
  archive: {
    tone: "danger",
    title: "Archive this school?",
    message:
      "The school is marked Archived and its admins are suspended. This can be reversed with Restore.",
    label: "Archive",
  },
}

export default function SchoolDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const {
    useSchoolDetail,
    useUpdateSchool,
    useSuspendSchool,
    useRestoreSchool,
    useArchiveSchool,
  } = useSchool()

  const { data, isLoading, error } = useSchoolDetail(id)
  const school = data?.data

  const updateMutation = useUpdateSchool()
  const suspendMutation = useSuspendSchool()
  const restoreMutation = useRestoreSchool()
  const archiveMutation = useArchiveSchool()

  const [editing, setEditing] = useState(false)
  const [confirm, setConfirm] = useState<Lifecycle>(null)

  const onLifecycleError = (err: unknown) =>
    toast.error(getApiErrorMessage(err, "Action failed"))

  // The backend enforces no state machine, so gating which button is offered
  // here is what stops suspend/restore/archive from silently flipping.
  const isActive = school?.status === SchoolStatus.ACTIVE
  const isArchived = school?.status === SchoolStatus.ARCHIVED

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: "Platform", href: "/" }, { label: "Schools", href: "/schools" }]} />
        <div className="rounded-box bg-base-100 shadow-card p-10 text-center">
          <p className="t-body text-base-content/50">{getApiErrorMessage(error, "School not found")}</p>
          <Link href="/schools" className="btn btn-ghost btn-sm mt-4">
            Back to schools
          </Link>
        </div>
      </div>
    )
  }

  const copy = confirm ? CONFIRM_COPY[confirm] : null

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Platform", href: "/" },
          { label: "Schools", href: "/schools" },
          { label: school.name },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="t-h1">{school.name}</h1>
            <StatusBadge
              status={statusStyle[school.status] ?? "inactive"}
              label={statusLabel[school.status] ?? school.status}
            />
          </div>
          <p className="t-body text-base-content/50 mt-1">
            {[school.city, school.address].filter(Boolean).join(", ") || "No location set"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isActive && (
            <button
              className="btn btn-outline btn-sm gap-1.5"
              onClick={() => setEditing((v) => !v)}
              disabled={updateMutation.isPending}
            >
              <Pencil size={14} />
              {editing ? "Cancel" : "Edit"}
            </button>
          )}
          {isActive && (
            <button className="btn btn-warning btn-sm gap-1.5" onClick={() => setConfirm("suspend")}>
              <PauseCircle size={14} />
              Suspend
            </button>
          )}
          {!isArchived && (
            <button className="btn btn-success btn-sm gap-1.5" onClick={() => setConfirm("restore")}>
              <PlayCircle size={14} />
              Restore
            </button>
          )}
          {!isArchived && (
            <button className="btn btn-error btn-outline btn-sm gap-1.5" onClick={() => setConfirm("archive")}>
              <Archive size={14} />
              Archive
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Buses" value={school.busCount} icon={<BusIcon size={16} />} />
        <KpiCard title="Students" value={school.studentCount} icon={<Users size={16} />} />
        <KpiCard title="Admins" value={school.adminCount} icon={<UserCog size={16} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-box bg-base-100 shadow-card p-5">
          <h2 className="t-h3">Profile</h2>
          {editing ? (
            <EditSchoolForm
              school={school}
              saving={updateMutation.isPending}
              onCancel={() => setEditing(false)}
              onSubmit={(body) =>
                updateMutation.mutate(
                  { id: school.id, data: body },
                  {
                    onSuccess: () => {
                      setEditing(false)
                      toast.success("School updated")
                    },
                    onError: onLifecycleError,
                  }
                )
              }
            />
          ) : (
            <dl className="mt-4 space-y-3">
              <Row label="School ID" value={<span className="tabular-nums">{school.id}</span>} />
              <Row label="City" value={school.city ?? "—"} />
              <Row label="Address" value={school.address ?? "—"} />
              <Row label="Contact name" value={school.contactName ?? "—"} />
              <Row label="Contact phone" value={school.contactPhone ?? "—"} />
              <Row label="Contact email" value={school.contactEmail ?? "—"} />
              <Row
                label="Onboarded"
                value={
                  new Date(school.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
            </dl>
          )}
        </section>

        <section className="rounded-box bg-base-100 shadow-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="t-h3">School Admins</h2>
            {isActive && (
              <Link
                href={`/admins?schoolId=${school.id}&schoolName=${encodeURIComponent(school.name)}`}
                className="btn btn-ghost btn-xs gap-1"
              >
                <Plus size={14} />
                Add admin
              </Link>
            )}
          </div>
          <p className="t-body text-base-content/50 mt-1">
            {school.adminCount === 0
              ? "No admins provisioned yet."
              : `${school.adminCount} admin${school.adminCount === 1 ? "" : "s"} provisioned for this school.`}
          </p>
          {!isActive && (
            <p className="t-micro text-warning mt-3">
              This school is {statusLabel[school.status]?.toLowerCase()} — new admins cannot be created
              until it is restored.
            </p>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={copy !== null}
        tone={copy?.tone ?? "danger"}
        title={copy?.title ?? ""}
        message={copy?.message ?? ""}
        confirmLabel={copy?.label ?? "Confirm"}
        loading={suspendMutation.isPending || restoreMutation.isPending || archiveMutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          const kind = confirm
          setConfirm(null)
          if (kind === "suspend") suspendMutation.mutate(school.id, { onError: onLifecycleError })
          if (kind === "restore") restoreMutation.mutate(school.id, { onError: onLifecycleError })
          if (kind === "archive") archiveMutation.mutate(school.id, { onError: onLifecycleError })
        }}
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="t-micro text-base-content/40 pt-0.5">{label}</dt>
      <dd className="t-body text-right text-base-content">{value}</dd>
    </div>
  )
}

const EDITABLE_FIELDS = [
  ["name", "School name"],
  ["address", "Address"],
  ["city", "City"],
  ["contactName", "Contact name"],
  ["contactPhone", "Contact phone"],
  ["contactEmail", "Contact email"],
] as const

type EditableField = (typeof EDITABLE_FIELDS)[number][0]

function EditSchoolForm({
  school,
  saving,
  onSubmit,
  onCancel,
}: {
  school: Record<EditableField, string | null>
  saving: boolean
  onSubmit: (body: UpdateSchoolRequest) => void
  onCancel: () => void
}) {
  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const body: UpdateSchoolRequest = {}
        for (const [key] of EDITABLE_FIELDS) {
          const v = String(fd.get(key) ?? "").trim()
          // PATCH semantics: `""` clears the field, which the backend accepts
          // for every optional field. `name` is never sent empty because the
          // server rejects that with 400.
          body[key] = v
        }
        onSubmit(body)
      }}
    >
      {EDITABLE_FIELDS.map(([key, label]) => (
        <label key={key} className="form-control">
          <div className="label py-1">
            <span className="label-text">{label}</span>
          </div>
          <input
            name={key}
            defaultValue={school[key] ?? ""}
            className="input input-sm w-full bg-base-100"
          />
        </label>
      ))}
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? <span className="loading loading-spinner loading-xs" /> : "Save changes"}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
