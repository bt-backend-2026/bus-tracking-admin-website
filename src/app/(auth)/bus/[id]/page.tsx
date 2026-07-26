"use client"

import { useState, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Download } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { StatusBadge } from "@/components/status-badge"
import { FileUploadBtn } from "@/components/file-upload-btn"
import { ImportPreviewModal } from "@/components/import-preview-modal"
import { ConfirmDialog } from "@/components/confirm-dialog"
import useBus from "@/hooks/use-bus"
import useStudent from "@/hooks/use-student"
import { exportStudentsRoster } from "@/services/student-service"
import type { StudentRequest, StudentImportRowResult } from "@/types/models/student"

const statusLabel: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
}

export default function BusDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { useBusDetail, useBusCheckpoints, useAddStudentToBus } = useBus()
  const { useImportPreview, useImportCommit, useDeleteStudent } = useStudent()

  const { data, isLoading, error } = useBusDetail(id)
  const { data: cpRes } = useBusCheckpoints(id)
  const bus = data?.data ?? null
  const checkpoints = cpRes?.data ?? []

  const importPreview = useImportPreview()
  const importCommit = useImportCommit()
  const addStudent = useAddStudentToBus()
  const deleteStudent = useDeleteStudent()

  const [importRows, setImportRows] = useState<StudentImportRowResult[]>([])
  const [importPreviewOpen, setImportPreviewOpen] = useState(false)
  const [importOkCount, setImportOkCount] = useState(0)
  const [importErrorCount, setImportErrorCount] = useState(0)

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

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
      <Link href="/bus" className="inline-flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/70 transition-colors">
        <ArrowLeft size={14} />
        Back to Buses
      </Link>

      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Buses", href: "/bus" }, { label: bus.displayId }]} />

      <div className="rounded-box bg-base-100 p-4 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="t-h1">{bus.displayId}</h1>
              <StatusBadge status={bus.status} label={statusLabel[bus.status.toLowerCase()] ?? bus.status} />
            </div>
            <p className="t-body text-base-content/50 mt-0.5">{bus.plate}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-box bg-base-100 p-3 shadow-card">
          <h2 className="t-label font-semibold mb-2">Bus Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/40">Display ID</span>
              <span className="text-base-content">{bus.displayId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/40">Plate</span>
              <span className="text-base-content font-mono">{bus.plate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/40">Capacity</span>
              <span className="text-base-content">{bus.capacity ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/40">Shift</span>
              <span className="text-base-content">{bus.shift ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/40">Route</span>
              <span className="text-base-content text-right max-w-56">{bus.routeName ?? "—"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-box bg-base-100 p-3 shadow-card">
          <h2 className="t-label font-semibold mb-2">Driver Assignment</h2>
          {bus.driverName ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/40">Driver</span>
                <span className="text-base-content font-medium">{bus.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/40">Phone</span>
                <span className="text-base-content">{bus.driverPhone ?? "—"}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-base-content/40 py-4 text-center">No driver assigned.</p>
          )}
        </div>
      </div>

      {checkpoints.length > 0 && (
        <div className="rounded-box bg-base-100 p-3 shadow-card">
          <h2 className="t-label font-semibold mb-2">Checkpoints</h2>
          <div className="space-y-1 text-sm">
            {checkpoints.map((cp) => (
              <div key={cp.id} className="flex items-center gap-2">
                <span className="text-base-content/40">{cp.order + 1}.</span>
                <span className="text-base-content">{cp.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <th className="w-36">Name</th>
                  <th className="w-20">Grade</th>
                  <th className="w-28">Checkpoint</th>
                  <th className="w-32">Parent</th>
                  <th className="w-32">Phone</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {bus.students.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium text-sm">{s.name}</td>
                    <td className="text-sm text-base-content/60">{s.klass ?? "—"}</td>
                    <td className="text-sm text-base-content/60">{s.checkpoint ?? "—"}</td>
                    <td className="text-sm text-base-content/60">{s.parentName ?? "—"}</td>
                    <td className="text-sm text-base-content/60 font-mono text-xs">{s.phone ?? "—"}</td>
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
