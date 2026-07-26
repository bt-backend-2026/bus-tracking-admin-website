"use client"

import { useEffect, useRef } from "react"
import { CircleCheck, CircleX, AlertTriangle } from "lucide-react"
import type { StudentImportRowResult } from "@/types/models/student"

interface ImportPreviewModalProps {
  open: boolean
  rows: StudentImportRowResult[]
  okCount: number
  errorCount: number
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ImportPreviewModal({
  open,
  rows,
  okCount,
  errorCount,
  loading,
  onConfirm,
  onCancel,
}: ImportPreviewModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = () => onCancel()
    el.addEventListener("close", handler)
    return () => el.removeEventListener("close", handler)
  }, [onCancel])

  // errorCount is used directly from props for the warning banner

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-2xl p-0 overflow-hidden">
        <div className="p-5 pb-0">
          <div className="flex items-center justify-between">
            <h3 className="t-h3">Import Preview</h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-success">
                <CircleCheck size={14} />
                {okCount} valid
              </span>
              {errorCount > 0 && (
                <span className="flex items-center gap-1 text-error">
                  <CircleX size={14} />
                  {errorCount} errors
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-80 mt-3">
          <table className="table table-pin-rows">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th className="w-10"></th>
                <th>Name</th>
                <th className="w-20">Class</th>
                <th className="w-28">Parent</th>
                <th className="w-28">Phone</th>
                <th className="w-28">Checkpoint</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.rowNumber} className={row.ok ? "" : "bg-error/5"}>
                  <td className="text-xs text-base-content/40 font-mono">{row.rowNumber}</td>
                  <td>
                    {row.ok ? (
                      <CircleCheck size={14} className="text-success" />
                    ) : (
                      <CircleX size={14} className="text-error" />
                    )}
                  </td>
                  <td className={`text-sm ${row.ok ? "" : "text-error"}`}>
                    {row.name ?? "—"}
                    {!row.ok && row.error && (
                      <div className="text-[11px] text-error/70 mt-0.5 leading-tight">{row.error}</div>
                    )}
                  </td>
                  <td className="text-sm text-base-content/60">{row.klass ?? "—"}</td>
                  <td className="text-sm text-base-content/60">{row.parentName ?? "—"}</td>
                  <td className="text-sm text-base-content/60 font-mono">{row.phone ?? "—"}</td>
                  <td className="text-sm text-base-content/60">{row.checkpoint ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {errorCount > 0 && (
          <div className="mx-5 mb-2 mt-3 flex items-start gap-2 rounded-box bg-warning/10 p-3">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" />
            <p className="text-xs text-warning">
              {errorCount} row{errorCount > 1 ? "s" : ""} will be skipped during import.
              Only {okCount} valid row{okCount > 1 ? "s" : ""} will be imported.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-base-200 p-4">
          <button className="btn btn-ghost btn-sm" disabled={loading} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary btn-sm gap-1.5"
            disabled={loading || okCount === 0}
            onClick={onConfirm}
          >
            {loading ? <span className="loading loading-spinner loading-xs" /> : null}
            Import {okCount > 0 ? `${okCount} student${okCount > 1 ? "s" : ""}` : ""}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
}
