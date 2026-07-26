"use client"

import { useEffect, useRef } from "react"
import { TriangleAlert } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: "danger" | "warning" | "info"
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const toneStyles: Record<string, { icon: string; iconColor: string; btn: string }> = {
  danger: {
    icon: "bg-error/10",
    iconColor: "text-error",
    btn: "btn-error",
  },
  warning: {
    icon: "bg-warning/10",
    iconColor: "text-warning",
    btn: "btn-warning",
  },
  info: {
    icon: "bg-info/10",
    iconColor: "text-info",
    btn: "btn-primary",
  },
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
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

  const s = toneStyles[tone]

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-sm">
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${s.icon}`}>
            <TriangleAlert size={24} className={s.iconColor} />
          </div>
          <h3 className="t-h3">{title}</h3>
          <p className="t-body text-base-content/50">{message}</p>
        </div>
        <div className="modal-action mt-4">
          <button className="btn btn-ghost btn-sm" disabled={loading} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={`btn btn-sm ${s.btn}`} disabled={loading} onClick={onConfirm}>
            {loading ? <span className="loading loading-spinner loading-xs" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
}
