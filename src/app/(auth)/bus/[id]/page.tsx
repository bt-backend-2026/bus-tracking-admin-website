"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Download, Save, X, ArrowUp, ArrowDown, Lock } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { StatusBadge } from "@/components/status-badge"
import { FileUploadBtn } from "@/components/file-upload-btn"
import { ImportPreviewModal } from "@/components/import-preview-modal"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { PlateChangeModal } from "@/components/plate-change-modal"
import useBus from "@/hooks/use-bus"
import useStudent from "@/hooks/use-student"
import { exportStudentsRoster } from "@/services/student-service"
import type { StudentRequest, StudentImportRowResult } from "@/types/models/student"
import type { PlateChangeAuthorizeRequest, PlateUpdateRequest, CheckpointRequest } from "@/types/models/bus"

const statusLabel: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
}

export default function BusDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { useBusDetail, useBusCheckpoints, useAddStudentToBus, useAuthorizePlateChange, useUpdatePlate, useReplaceCheckpoints } = useBus()
  const { useImportPreview, useImportCommit, useDeleteStudent } = useStudent()

  const { data, isLoading, error } = useBusDetail(id)
  const { data: cpRes } = useBusCheckpoints(id)
  const bus = data?.data ?? null
  const checkpoints = cpRes?.data ?? []

  const importPreview = useImportPreview()
  const importCommit = useImportCommit()
  const addStudent = useAddStudentToBus()
  const deleteStudent = useDeleteStudent()
  const authorizePlate = useAuthorizePlateChange()
  const updatePlate = useUpdatePlate()
  const replaceCheckpoints = useReplaceCheckpoints()

  const [importRows, setImportRows] = useState<StudentImportRowResult[]>([])
  const [importPreviewOpen, setImportPreviewOpen] = useState(false)
  const [importOkCount, setImportOkCount] = useState(0)
  const [importErrorCount, setImportErrorCount] = useState(0)

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [plateChangeOpen, setPlateChangeOpen] = useState(false)

  const [addFormOpen, setAddFormOpen] = useState(false)
  const [formData, setFormData] = useState<StudentRequest>({
    name: "",
    klass: "",
    parentName: "",
    phone: "",
    secondaryPhone: "",
    checkpoint: "",
  })
  const formRef = useRef<HTMLDialogElement>(null)

  const [checkpointItems, setCheckpointItems] = useState<{ id?: number; label: string }[]>([])

  useEffect(() => {
    if (checkpoints.length > 0) {
      setCheckpointItems(checkpoints.map((c) => ({ id: c.id, label: c.label })))
    }
  }, [checkpoints])

  const [newCheckpoint, setNewCheckpoint] = useState("")
  const [checkpointDirty, setCheckpointDirty] = useState(false)

  const handleAddCheckpoint = () => {
    if (!newCheckpoint.trim()) return
    setCheckpointItems((prev) => [...prev, { label: newCheckpoint.trim() }])
    setNewCheckpoint("")
    setCheckpointDirty(true)
  }

  const handleRemoveCheckpoint = (index: number) => {
    setCheckpointItems((prev) => prev.filter((_, i) => i !== index))
    setCheckpointDirty(true)
  }

  const handleMoveCheckpointUp = (index: number) => {
    if (index === 0) return
    setCheckpointItems((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
    setCheckpointDirty(true)
  }

  const handleMoveCheckpointDown = (index: number) => {
    setCheckpointItems((prev) => {
      if (index === prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
    setCheckpointDirty(true)
  }

  const handleImportFile = useCallback(async (file: File) => {
    const res = await importPreview.mutateAsync({ busId: id, file })
    const rows = res.data?.rows ?? []
    const okCount = res.data?.okCount ?? 0
    const errorCount = res.data?.errorCount ?? 0
    setImportRows(rows)
    setImportOkCount(okCount)
    setImportErrorCount(errorCount)
    setImportPreviewOpen(true)
  }, [id, importPreview])

  const handleImportCommit = useCallback(async () => {
    const okRows = importRows.filter((r) => r.ok)
    await importCommit.mutateAsync({ busId: id, data: { rows: okRows } })
    setImportPreviewOpen(false)
    setImportRows([])
  }, [id, importRows, importCommit])

  const handleExport = useCallback(async () => {
    try {
      const blob = await exportStudentsRoster(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bus-${id}-students.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Export downloaded")
    } catch {
      toast.error("Failed to export students")
    }
  }, [id])

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteTarget == null) return
    await deleteStudent.mutateAsync(deleteTarget)
    setDeleteTarget(null)
  }, [deleteTarget, deleteStudent])

  const handleAddStudent = useCallback(async () => {
    const data = { ...formData }
    if (!data.name.trim() || !data.parentName.trim() || !data.phone.trim()) {
      toast.error("Name, parent name, and phone are required")
      return
    }
    await addStudent.mutateAsync({ busId: id, data })
    setFormData({ name: "", klass: "", parentName: "", phone: "", secondaryPhone: "", checkpoint: "" })
    setAddFormOpen(false)
  }, [id, formData, addStudent])

  const handleFormField = (field: keyof StudentRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlateAuthorize = useCallback(
    async (data: PlateChangeAuthorizeRequest) => {
      const res = await authorizePlate.mutateAsync({ busId: id, data })
      return { unlockToken: res.data.unlockToken }
    },
    [id, authorizePlate],
  )

  const handlePlateUpdate = useCallback(
    async (data: PlateUpdateRequest) => {
      await updatePlate.mutateAsync({ busId: id, data })
    },
    [id, updatePlate],
  )

  const handleSaveCheckpoints = useCallback(
    async (data: CheckpointRequest) => {
      await replaceCheckpoints.mutateAsync({ busId: id, data })
    },
    [id, replaceCheckpoints],
  )

  const handleSaveCheckpointsInline = useCallback(async () => {
    const valid = checkpointItems.filter((i) => i.label.trim())
    if (valid.length === 0) {
      toast.error("At least one checkpoint is required")
      return
    }
    await handleSaveCheckpoints({
      checkpoints: valid.map((i) => (i.id ? { id: i.id, label: i.label.trim() } : { label: i.label.trim() })),
    })
    setCheckpointDirty(false)
    toast.success("Checkpoints saved")
  }, [checkpointItems, handleSaveCheckpoints])

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
        <span className="text-sm text-base-content/40">{(error as Error)?.message ?? "Failed to load bus"}</span>
        <div className="flex gap-2">
          <Link href="/bus" className="btn btn-ghost btn-sm">Back to Buses</Link>
          <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  if (!bus) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-sm text-base-content/40">Bus not found</span>
        <Link href="/bus" className="btn btn-ghost btn-sm">Back to Buses</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Buses", href: "/bus" }, { label: bus.displayId }]} />

      <div className="flex items-start gap-3">
        <Link href="/bus" className="btn btn-ghost btn-xs btn-square mt-0.5 shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-xl font-bold">{bus.displayId.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{bus.displayId}</h1>
            <StatusBadge status={bus.status} label={statusLabel[bus.status.toLowerCase()] ?? bus.status} />
            <button
              className="btn btn-primary btn-xs gap-1.5 ml-auto"
              disabled={!checkpointDirty || replaceCheckpoints.isPending}
              onClick={handleSaveCheckpointsInline}
            >
              {replaceCheckpoints.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Save size={12} />
              )}
              Save
            </button>
          </div>
          <p className="mt-0.5 text-sm text-base-content/50 truncate">
            {checkpoints.length > 0
              ? checkpoints
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((c) => c.label)
                  .join(" → ")
              : "No checkpoints"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_2fr] items-start">
        <div className="rounded-box bg-base-100 p-4 shadow-card">
          <h2 className="t-label font-semibold mb-3">Bus Details</h2>
          <div className="flex flex-col gap-3">
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Plate Number</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full gap-2">
                <span className="flex-1 font-mono">{bus.plate}</span>
                <Lock size={13} className="text-base-content/20 shrink-0" />
              </div>
              <button
                className="label-text text-primary link link-hover mt-1 text-xs"
                onClick={() => setPlateChangeOpen(true)}
              >
                Request Plate Change
              </button>
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Capacity</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                {bus.capacity ?? "—"}
              </div>
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Shift</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                {bus.shift ?? "—"}
              </div>
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Driver</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                {bus.driverName ?? "—"}
              </div>
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Driver Phone</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                {bus.driverPhone ?? "—"}
              </div>
            </label>
            <label className="form-control w-full">
              <div className="label py-0 pb-1">
                <span className="label-text text-xs text-base-content/40">Status</span>
              </div>
              <div className="input input-bordered input-md bg-base-200/50 flex items-center text-sm h-10 px-3 rounded-lg w-full">
                <StatusBadge status={bus.status} label={statusLabel[bus.status.toLowerCase()] ?? bus.status} />
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-box bg-base-100 p-4 shadow-card">
          <h2 className="t-label font-semibold mb-3">Route</h2>
          <div className="space-y-3">
            {checkpointItems.length > 0 ? (
              checkpointItems.map((cp, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-base-200/50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {i + 1}
                  </div>
                  <span className="flex-1 text-sm">{cp.label}</span>
                  <button
                    className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-base-content/50"
                    aria-label="Move up"
                    disabled={i === 0}
                    onClick={() => handleMoveCheckpointUp(i)}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-base-content/50"
                    aria-label="Move down"
                    disabled={i === checkpointItems.length - 1}
                    onClick={() => handleMoveCheckpointDown(i)}
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-error"
                    aria-label={`Remove checkpoint ${i + 1}`}
                    onClick={() => handleRemoveCheckpoint(i)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-base-content/40 py-2">No checkpoints.</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-base-200">
            <input
              className="input input-sm flex-1 min-w-0"
              placeholder="Add checkpoint"
              value={newCheckpoint}
              onChange={(e) => setNewCheckpoint(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddCheckpoint() }}
            />
            <button
              className="btn btn-primary btn-sm gap-1"
              disabled={!newCheckpoint.trim()}
              onClick={handleAddCheckpoint}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-box bg-base-100 p-3 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h2 className="t-label font-semibold">
            Students
            {bus.students.length > 0 && (
              <span className="badge badge-sm badge-ghost ml-1.5">{bus.students.length}</span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-primary btn-sm gap-1.5"
              onClick={() => setAddFormOpen(true)}
            >
              <Plus size={14} />
              Add Student
            </button>
            <FileUploadBtn
              label="Import XLSX"
              loading={importPreview.isPending}
              onFile={handleImportFile}
            />
            <button
              className="btn btn-outline btn-sm gap-1.5"
              onClick={handleExport}
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {bus.students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Parent Name</th>
                  <th>Phone Number</th>
                  <th>Secondary Phone</th>
                  <th>Address</th>
                  <th>Stop</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {bus.students.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium text-sm">{s.name}</td>
                    <td className="text-sm text-base-content/60">{s.parentName ?? "—"}</td>
                    <td className="text-sm text-base-content/60 font-mono text-xs">{s.phone ?? "—"}</td>
                    <td className="text-sm text-base-content/60 font-mono text-xs">{s.secondaryPhone ?? "—"}</td>
                    <td className="text-sm text-base-content/60">—</td>
                    <td className="text-sm text-base-content/60">{s.checkpoint ?? "—"}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-xs text-base-content/30 hover:text-error"
                        aria-label={`Delete ${s.name}`}
                        onClick={() => setDeleteTarget(s.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-base-content/40 py-4 text-center">No students assigned to this bus.</p>
        )}
      </div>

      <ImportPreviewModal
        open={importPreviewOpen}
        rows={importRows}
        okCount={importOkCount}
        errorCount={importErrorCount}
        loading={importCommit.isPending}
        onConfirm={handleImportCommit}
        onCancel={() => {
          setImportPreviewOpen(false)
          setImportRows([])
        }}
      />

      <ConfirmDialog
        open={deleteTarget != null}
        title="Remove student"
        message="This will permanently remove this student from the bus. The parent account will remain but the link will be broken."
        confirmLabel="Remove"
        tone="danger"
        loading={deleteStudent.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <PlateChangeModal
        open={plateChangeOpen}
        currentPlate={bus.plate}
        authorizePending={authorizePlate.isPending}
        updatePending={updatePlate.isPending}
        onAuthorize={handlePlateAuthorize}
        onUpdatePlate={handlePlateUpdate}
        onCancel={() => setPlateChangeOpen(false)}
      />

      <dialog ref={formRef} className="modal" open={addFormOpen} onClose={() => setAddFormOpen(false)}>
        <div className="modal-box max-w-md p-0 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-base-200">
            <h3 className="t-h3">Add Student</h3>
            <p className="t-body text-base-content/50 mt-0.5">Assign a new student to this bus</p>
          </div>

          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="t-label text-base-content/70 mb-1.5 block">Name</label>
              <input
                className="input w-full"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => handleFormField("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="t-label text-base-content/70 mb-1.5 block">Class</label>
                <input
                  className="input w-full"
                  placeholder="e.g. 10A"
                  value={formData.klass ?? ""}
                  onChange={(e) => handleFormField("klass", e.target.value)}
                />
              </div>
              <div>
                <label className="t-label text-base-content/70 mb-1.5 block">Checkpoint</label>
                <input
                  className="input w-full"
                  placeholder="Stop label"
                  value={formData.checkpoint ?? ""}
                  onChange={(e) => handleFormField("checkpoint", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="t-label text-base-content/70 mb-1.5 block">Parent name</label>
              <input
                className="input w-full"
                placeholder="Parent or guardian"
                value={formData.parentName}
                onChange={(e) => handleFormField("parentName", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="t-label text-base-content/70 mb-1.5 block">Phone</label>
                <input
                  className="input w-full"
                  placeholder="Primary contact"
                  value={formData.phone}
                  onChange={(e) => handleFormField("phone", e.target.value)}
                />
              </div>
              <div>
                <label className="t-label text-base-content/70 mb-1.5 block">Secondary phone</label>
                <input
                  className="input w-full"
                  placeholder="Optional"
                  value={formData.secondaryPhone}
                  onChange={(e) => handleFormField("secondaryPhone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-base-200 px-6 py-4">
            <button
              className="btn btn-ghost btn-sm"
              disabled={addStudent.isPending}
              onClick={() => {
                setAddFormOpen(false)
                setFormData({ name: "", klass: "", parentName: "", phone: "", secondaryPhone: "", checkpoint: "" })
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm gap-1.5"
              disabled={addStudent.isPending}
              onClick={handleAddStudent}
            >
              {addStudent.isPending ? <span className="loading loading-spinner loading-xs" /> : null}
              Add Student
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setAddFormOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  )
}
