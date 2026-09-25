"use client"

import { useEffect, useRef, useState } from "react"
import { CircleCheck, KeyRound } from "lucide-react"
import type { PlateChangeAuthorizeRequest, PlateUpdateRequest } from "@bustrack/types/models/bus"

interface PlateChangeModalProps {
  open: boolean
  currentPlate: string
  authorizePending?: boolean
  updatePending?: boolean
  onAuthorize: (data: PlateChangeAuthorizeRequest) => Promise<{ unlockToken: string }>
  onUpdatePlate: (data: PlateUpdateRequest) => Promise<void>
  onCancel: () => void
}

type Step = "authorize" | "new-plate" | "done"

export function PlateChangeModal({
  open,
  currentPlate,
  authorizePending,
  updatePending,
  onAuthorize,
  onUpdatePlate,
  onCancel,
}: PlateChangeModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [step, setStep] = useState<Step>("authorize")
  const [password, setPassword] = useState("")
  const [newPlate, setNewPlate] = useState("")
  const [unlockToken, setUnlockToken] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
      setStep("authorize")
      setPassword("")
      setNewPlate("")
      setUnlockToken("")
      setError("")
    }
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = () => {
      if (step !== "done") onCancel()
    }
    el.addEventListener("close", handler)
    return () => el.removeEventListener("close", handler)
  }, [onCancel, step])

  const handleAuthorize = async () => {
    if (!password.trim()) return
    setError("")
    try {
      const res = await onAuthorize({ password })
      setUnlockToken(res.unlockToken)
      setStep("new-plate")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authorization failed"
      setError(msg)
    }
  }

  const handleUpdate = async () => {
    if (!newPlate.trim()) return
    setError("")
    try {
      await onUpdatePlate({ newPlate: newPlate.trim(), unlockToken })
      setStep("done")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update plate"
      setError(msg)
    }
  }

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-sm p-0 overflow-hidden">
        {step === "authorize" && (
          <>
            <div className="px-5 pt-5 pb-4 border-b border-base-200">
              <h3 className="t-h3">Change Plate Number</h3>
              <p className="t-body text-base-content/50 mt-0.5">
                Current plate: <span className="font-mono font-semibold text-base-content">{currentPlate}</span>
              </p>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="flex items-start gap-3 rounded-box bg-warning/10 p-3">
                <KeyRound size={14} className="mt-0.5 shrink-0 text-warning" />
                <p className="text-xs text-warning">
                  Enter your account password to authorize this change. This step expires after 2 minutes.
                </p>
              </div>

              <div>
                <label className="t-label text-base-content/70 mb-1.5 block">Password</label>
                <input
                  className="input w-full"
                  type="password"
                  placeholder="Your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAuthorize()}
                />
              </div>

              {error && <p className="text-xs text-error">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-base-200 px-5 py-4">
              <button className="btn btn-ghost btn-sm" disabled={authorizePending} onClick={onCancel}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                disabled={authorizePending || !password.trim()}
                onClick={handleAuthorize}
              >
                {authorizePending ? <span className="loading loading-spinner loading-xs" /> : null}
                Authorize
              </button>
            </div>
          </>
        )}

        {step === "new-plate" && (
          <>
            <div className="px-5 pt-5 pb-4 border-b border-base-200">
              <h3 className="t-h3">New Plate Number</h3>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="t-label text-base-content/70 mb-1.5 block">New plate</label>
                <input
                  className="input w-full"
                  placeholder="e.g. BA1JA5678"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                />
              </div>

              {error && <p className="text-xs text-error">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-base-200 px-5 py-4">
              <button
                className="btn btn-ghost btn-sm"
                disabled={updatePending}
                onClick={() => { setStep("authorize"); setError(""); setPassword(""); setUnlockToken("") }}
              >
                Back
              </button>
              <button
                className="btn btn-primary btn-sm gap-1.5"
                disabled={updatePending || !newPlate.trim()}
                onClick={handleUpdate}
              >
                {updatePending ? <span className="loading loading-spinner loading-xs" /> : null}
                Update Plate
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <>
            <div className="px-5 pt-5 pb-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mx-auto mb-3">
                <CircleCheck size={24} className="text-success" />
              </div>
              <h3 className="t-h3">Plate Updated</h3>
              <p className="t-body text-base-content/50 mt-1">
                Plate changed from <span className="font-mono line-through text-base-content/30">{currentPlate}</span> to{" "}
                <span className="font-mono font-semibold text-base-content">{newPlate}</span>
              </p>
            </div>
            <div className="flex justify-center border-t border-base-200 px-5 py-4">
              <button className="btn btn-primary btn-sm" onClick={onCancel}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
}
