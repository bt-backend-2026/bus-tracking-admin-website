"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User, Bus, Route } from "lucide-react"
import { Breadcrumbs } from "@bustrack/ui"
import { StatusBadge } from "@bustrack/ui"
import useStudent from "@bustrack/hooks/use-student"

const dummyBus = { displayId: "B12", routeName: "North Route" }

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

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { useStudentDetail, useUpdateStudent } = useStudent()

  const { data: res, isLoading, error } = useStudentDetail(id)
  const student = res?.data ?? null

  const updateMutation = useUpdateStudent()

  const [name, setName] = useState("")
  const [klass, setKlass] = useState("")
  const [checkpoint, setCheckpoint] = useState("")

  useEffect(() => {
    if (student) {
      setName(student.name)
      setKlass(student.klass ?? "")
      setCheckpoint(student.checkpoint ?? "")
    }
  }, [student])

  const handleSave = () => {
    updateMutation.mutate(
      { id, data: { name, klass: klass || undefined, checkpoint: checkpoint || undefined } },
      { onSuccess: () => router.refresh() },
    )
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
        <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load student"}</span>
        <div className="flex gap-2">
          <Link href="/student" className="btn btn-ghost btn-sm">Back to Students</Link>
          <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-sm text-base-content/40">Student not found</span>
        <Link href="/student" className="btn btn-ghost btn-sm">Back to Students</Link>
      </div>
    )
  }

  const hasChanges = name !== student.name || klass !== (student.klass ?? "") || checkpoint !== (student.checkpoint ?? "")

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Students", href: "/student" }, { label: student.name }]} />

      <div className="flex items-start gap-3">
        <Link href="/student" className="btn btn-ghost btn-xs btn-square mt-0.5 shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{student.name}</h1>
            <button
              className="btn btn-primary btn-xs gap-1.5 ml-auto"
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Save size={12} />
              )}
              Save Changes
            </button>
          </div>
          <p className="mt-0.5 text-sm text-base-content/50">
            {student.klass && <>Class: <span className="font-medium text-base-content/70">{student.klass}</span><span className="mx-1.5 text-base-content/20">·</span></>}
            Bus: <span className="font-medium text-base-content/70">{dummyBus.displayId}</span>
            <span className="mx-1.5 text-base-content/20">·</span>
            Route: <span className="font-medium text-base-content/70">{dummyBus.routeName}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-box bg-base-100 p-3 shadow-card w-44">
          <div className="t-micro text-base-content/40 font-medium mb-1">Class</div>
          <div className="t-h2">{student.klass ?? "—"}</div>
        </div>
        <div className="rounded-box bg-base-100 p-3 shadow-card w-44">
          <div className="t-micro text-base-content/40 font-medium mb-1">Bus</div>
          <div className="t-h2">{dummyBus.displayId}</div>
        </div>
        <div className="rounded-box bg-base-100 p-3 shadow-card w-44">
          <div className="t-micro text-base-content/40 font-medium mb-1">Stop</div>
          <div className="t-h2 truncate">{student.checkpoint ?? "—"}</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 items-start">
        <div className="rounded-box bg-base-100 p-4 shadow-card">
          <h2 className="t-label font-semibold mb-3">Student Details</h2>
          <div className="flex flex-col gap-3">
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Full Name</span>
              </div>
              <input
                type="text"
                className="input input-bordered input-md bg-base-200/50 h-10 px-3 rounded-lg w-full text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="form-control w-full">
                <div className="label py-0 pb-1">
                  <span className="label-text text-xs text-base-content/40">Class</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered input-md bg-base-200/50 h-10 px-3 rounded-lg w-full text-sm"
                  value={klass}
                  onChange={(e) => setKlass(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <div className="label py-0 pb-1">
                  <span className="label-text text-xs text-base-content/40">Bus</span>
                </div>
                <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                  {dummyBus.displayId}
                </div>
              </label>
            </div>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Stop</span>
              </div>
              <input
                type="text"
                className="input input-bordered input-md bg-base-200/50 h-10 px-3 rounded-lg w-full text-sm"
                value={checkpoint}
                onChange={(e) => setCheckpoint(e.target.value)}
              />
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Status</span>
              </div>
              <div className="select select-bordered select-md bg-base-200/50 flex items-center h-10 px-3 rounded-lg w-full">
                {student.attendanceStatus ? (
                  <span className={`badge badge-sm ${attendanceStyle[student.attendanceStatus] ?? "badge-ghost"}`}>
                    {attendanceLabel[student.attendanceStatus] ?? student.attendanceStatus}
                  </span>
                ) : (
                  <span className="text-sm text-base-content/50">—</span>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-box bg-base-100 p-4 shadow-card">
            <h2 className="t-label font-semibold mb-3">Parent / Guardian</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                {student.parentName?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm">{student.parentName ?? "—"}</div>
                <div className="text-xs text-base-content/50">{student.phone ?? "—"}</div>
              </div>
            </div>
            {student.secondaryPhone && (
              <div className="mt-2 text-xs text-base-content/40">
                Secondary: {student.secondaryPhone}
              </div>
            )}
            {student.parentId && (
              <div className="mt-3 pt-3 border-t border-base-200">
                <Link href={`/parent/${student.parentId}`} className="text-xs text-primary link link-hover">
                  View Profile &rarr;
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-box bg-base-100 p-4 shadow-card">
            <h2 className="t-label font-semibold mb-3">Route</h2>
            <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Route size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm">{dummyBus.routeName}</div>
                <div className="text-xs text-base-content/50">Bus {dummyBus.displayId}</div>
              </div>
            </div>
            <Link
              href={`/bus/${dummyBus.displayId}`}
              className="btn btn-outline btn-sm w-full gap-1.5 mt-3"
            >
              <Bus size={14} />
              Open Bus
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
